import { EDBEntity, getRandStr, getStoreItem, TBasePageEntityInput, TPagedList, TPagedParams } from '@cromwell/core';
import { HttpException, HttpStatus } from '@nestjs/common';
import { BaseEntity, ConnectionOptions, getManager, SelectQueryBuilder } from 'typeorm';
import { DateUtils } from 'typeorm/util/DateUtils';

import { entityMetaRepository } from '../helpers/entity-meta';
import { BasePageEntity } from '../models/entities/base-page.entity';
import { BaseFilterInput } from '../models/filters/base-filter.filter';

const MAX_PAGE_SIZE = 300;

export const applyGetPaged = <T>(
  qb: SelectQueryBuilder<T>,
  sortByTableName?: string,
  params?: TPagedParams<T>,
): SelectQueryBuilder<T> => {
  const cmsSettings = getStoreItem('cmsSettings');
  const p = params ?? {};
  if (!p.pageNumber) p.pageNumber = 1;
  if (!p.pageSize) {
    const def = cmsSettings?.defaultPageSize;
    p.pageSize = def && typeof def === 'number' && def > 0 ? def : 15;
  }
  if (p.pageSize > MAX_PAGE_SIZE) p.pageSize = MAX_PAGE_SIZE;

  if (p.orderBy && isSimpleString(String(p.orderBy))) {
    if (p.order !== 'DESC' && p.order !== 'ASC') p.order = 'DESC';
    if (sortByTableName) qb.orderBy(`${sortByTableName}.${String(p.orderBy)}`, p.order);
    else qb.orderBy(String(p.orderBy) + '', p.order);
  }

  return qb.skip(p.pageSize * (p.pageNumber - 1)).take(p.pageSize);
};

/** Retrieve all related entities of one specified entity by id in many-to-many relationship
 * E.g. get all products from a category
 * @prop firstEntityName - table DB name of many
 * @prop firstEntityProp - property of many that refers to relationship
 * @prop secondEntityName - table DB name of one
 * @prop secondEntityId - DB id of one
 */
export const applyGetManyFromOne = <T>(
  qb: SelectQueryBuilder<T>,
  firstEntityName: string,
  firstEntityProp: keyof T,
  secondEntityName: string,
  secondEntityId: number,
): SelectQueryBuilder<T> => {
  return qb.innerJoin(
    `${firstEntityName}.${String(firstEntityProp)}`,
    secondEntityName,
    `${secondEntityName}.id = :entityId`,
    {
      entityId: secondEntityId,
    },
  );
};

export const getPaged = async <T>(
  qb: SelectQueryBuilder<T>,
  sortByTableName?: string,
  params?: TPagedParams<T>,
): Promise<TPagedList<T>> => {
  const [count, elements] = await Promise.all([
    qb.getCount(),
    (() => {
      applyGetPaged(qb, sortByTableName, params);
      return qb.getMany();
    })(),
  ]);

  const pagedMeta = {
    pageNumber: params?.pageNumber,
    pageSize: params?.pageSize,
    totalPages: params?.pageSize ? Math.ceil(count / params.pageSize) : undefined,
    totalElements: count,
  };

  return { pagedMeta, elements };
};

export const handleBaseInput = async (entity: BasePageEntity, input: TBasePageEntityInput) => {
  entity.slug = input.slug;
  if (entity.slug) {
    entity.slug = (entity.slug + '').replace(/\W/g, '-').toLowerCase();
  }
  entity.pageTitle = input.pageTitle;
  entity.pageDescription = input.pageDescription;
  entity.isEnabled = input.isEnabled;
  if (input.meta) {
    entity.meta = {
      keywords: input.meta?.keywords,
    };
  }
};

export const handleCustomMetaInput = async <T extends { customMeta?: Record<string, string | null> | null }>(
  entity: BasePageEntity,
  input: T,
) => {
  if (!entity.id) await entity.save();

  if (input.customMeta && typeof input.customMeta === 'object' && Object.keys(input.customMeta).length) {
    for (const key of Object.keys(input.customMeta)) {
      await entityMetaRepository.setEntityMeta(
        entityMetaRepository.getEntityType(entity),
        entity.id,
        key,
        input.customMeta[key],
      );
    }
  }
};

export const checkEntitySlug = async <T extends BasePageEntity>(
  entity: T,
  EntityClass: new (...args: any[]) => T,
): Promise<T> => {
  // check for absence and set id instead
  let hasModified = false;
  if (!entity.slug) {
    entity.slug = entity.id + '';
    hasModified = true;
  }

  // check for unique and reset if not
  if (entity.slug) {
    const matches = await getManager().find(EntityClass, {
      where: {
        slug: entity.slug,
      },
    });
    for (const match of matches) {
      if (hasModified) {
        if (match.id !== entity.id) {
          entity.slug = entity.id + '_' + getRandStr(6);
          break;
        }
      } else {
        if (match.id !== entity.id) {
          throw new HttpException('Slug is not unique', HttpStatus.BAD_REQUEST);
        }
      }
    }
  }

  return entity;
};

export const isSimpleString = (str: string | undefined) => str && /^[a-zA-Z0-9_]+$/.test(str);

export const getSqlBoolStr = (dbType: ConnectionOptions['type'], b: boolean) => {
  if (dbType === 'postgres') {
    return b ? 'true' : 'false';
  }
  return b ? '1' : '0';
};

export const getSqlLike = (dbType: ConnectionOptions['type']) => {
  if (dbType === 'postgres') return 'ILIKE';
  return 'LIKE';
};

export const wrapInQuotes = (dbType: ConnectionOptions['type'], str: string) => {
  if (dbType === 'postgres') return `"${str}"`;
  return '`' + str + '`';
};

export const applyBaseFilter = <TEntity>({
  qb,
  filter,
  entityType,
  dbType,
  EntityClass,
}: {
  qb: SelectQueryBuilder<TEntity>;
  filter: BaseFilterInput;
  dbType: ConnectionOptions['type'];
  entityType?: EDBEntity;
  EntityClass?: (new (...args: any[]) => BasePageEntity) & typeof BaseEntity;
}): SelectQueryBuilder<TEntity> => {
  if (!EntityClass && entityType) EntityClass = entityMetaRepository.getEntityClass(entityType);
  if (!EntityClass) return qb;
  const EntityMetaClass = entityType && entityMetaRepository.getMetaClass(entityType);

  const metaTablePath = EntityMetaClass?.getRepository()?.metadata?.tablePath;
  const entityTablePath = EntityClass.getRepository().metadata.tablePath;

  const hasToJoinMeta = filter?.filters?.find((prop) => prop.inMeta) || filter?.sorts?.find((sort) => sort.inMeta);

  if (filter?.filters?.length) {
    const searchMetaJoinName = `${metaTablePath}_search`;

    if (EntityMetaClass && filter?.filters?.find((prop) => prop.inMeta)) {
      if (EntityMetaClass && EntityClass) {
        qb.leftJoin(
          EntityMetaClass,
          searchMetaJoinName,
          `${searchMetaJoinName}.${wrapInQuotes(dbType, 'entityId')} = ${entityTablePath}.id`,
        );
      }
    }

    filter.filters.forEach((prop, index) => {
      if (typeof prop.value === 'boolean') {
        prop = {
          ...prop,
          value: getSqlBoolStr(dbType, prop.value),
          exact: true,
        };
      }
      if (!prop.key || !isSimpleString(prop.key)) return;
      const valueName = `value_filter_${index}`;
      const keyName = `key_filter_${index}`;

      const getRangeValue = (value: string | number | Date | boolean) => {
        if (value instanceof Date) return DateUtils.mixedDateToDatetimeString(value);
        return value;
      };

      if (!prop.inMeta) {
        if (prop.from && prop.to) {
          const fromName = `from_filter_${index}`;
          const toName = `to_filter_${index}`;

          qb.andWhere(`${entityTablePath}.${wrapInQuotes(dbType, prop.key)} BETWEEN :${fromName} AND :${toName}`, {
            [fromName]: getRangeValue(prop.from),
            [toName]: getRangeValue(prop.to),
          });
        } else if (Array.isArray(prop.in)) {
          if (prop.in.length) {
            qb.andWhere(`${entityTablePath}.${wrapInQuotes(dbType, prop.key)} IN (:...${valueName})`, {
              [valueName]: prop.in,
            });
          }
        } else {
          qb.andWhere(
            `${entityTablePath}.${wrapInQuotes(dbType, prop.key)} ${
              prop.exact ? '=' : getSqlLike(dbType)
            } :${valueName}`,
            { [valueName]: prop.exact ? prop.value : `%${prop.value}%` },
          );
        }
      } else if (EntityMetaClass) {
        qb.andWhere(`${searchMetaJoinName}.${wrapInQuotes(dbType, 'key')} = :${keyName}`, {
          [keyName]: prop.key,
        });

        if (prop.from && prop.to) {
          const fromName = `from_filter_${index}`;
          const toName = `to_filter_${index}`;

          qb.andWhere(`${searchMetaJoinName}.${wrapInQuotes(dbType, 'value')} BETWEEN :${fromName} AND :${toName}`, {
            [fromName]: getRangeValue(prop.from),
            [toName]: getRangeValue(prop.to),
          });
        } else if (Array.isArray(prop.in)) {
          if (prop.in.length) {
            qb.andWhere(`${searchMetaJoinName}.${wrapInQuotes(dbType, 'value')} IN (:...${valueName})`, {
              [valueName]: prop.in,
            });
          }
        } else {
          qb.andWhere(
            `${searchMetaJoinName}.${wrapInQuotes(dbType, 'value')} ${
              prop.exact ? '=' : getSqlLike(dbType)
            } :${valueName}`,
            { [valueName]: prop.exact ? prop.value : `%${prop.value}%` },
          );
        }
      }
    });
  }
  if (filter?.sorts?.length) {
    filter.sorts.forEach((sort, index) => {
      const sortKey = sort?.key;
      const keyParamName = `key_sort_${index}`;
      if (!sortKey || !isSimpleString(sortKey)) return;
      if (sort.sort !== 'DESC' && sort.sort !== 'ASC') sort.sort = 'DESC';

      if (!sort.inMeta) {
        const args: [string, 'ASC' | 'DESC'] = [`${entityTablePath}.${sortKey}`, sort.sort];
        if (index === 0) {
          qb.orderBy(...args);
        } else {
          qb.addOrderBy(...args);
        }
      } else if (EntityMetaClass) {
        const sortJoinName = `${metaTablePath}_sort_${index}`;
        qb.leftJoinAndSelect(
          EntityMetaClass,
          sortJoinName,
          `${sortJoinName}.entityId = ${entityTablePath}.id AND ` + `${sortJoinName}.key = :${keyParamName}`,
        ).setParameter(keyParamName, sortKey);
        const args: [string, 'ASC' | 'DESC'] = [`${sortJoinName}.value`, sort.sort];
        if (index === 0) {
          qb.orderBy(...args);
        } else {
          qb.addOrderBy(...args);
        }
      }
    });
  }

  if (hasToJoinMeta) {
    qb.groupBy(`${entityTablePath}.id`);
  }
  return qb;
};
