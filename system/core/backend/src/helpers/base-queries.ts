import { getRandStr, getStoreItem, TBasePageEntity, TBasePageEntityInput, TPagedList, TPagedParams } from '@cromwell/core';
import { getManager, SelectQueryBuilder, ConnectionOptions, getCustomRepository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { BasePageEntity } from '../models/entities/base-page.entity';
import { EntityMetaRepository } from '../repositories/entity-meta.repository';

const MAX_PAGE_SIZE = 300;

export const applyGetPaged = <T>(qb: SelectQueryBuilder<T>, sortByTableName?: string, params?: TPagedParams<T>): SelectQueryBuilder<T> => {
    const cmsSettings = getStoreItem('cmsSettings');
    const p = params ? params : {};
    if (!p.pageNumber) p.pageNumber = 1;
    if (!p.pageSize) {
        const def = cmsSettings?.defaultPageSize
        p.pageSize = (def && typeof def === 'number' && def > 0) ? def : 15;
    }
    if (p.pageSize > MAX_PAGE_SIZE) p.pageSize = MAX_PAGE_SIZE;

    if (p.orderBy) {
        if (!p.order) p.order = 'DESC';
        if (sortByTableName) qb.orderBy(`${sortByTableName}.${p.orderBy}` + '', p.order);
        else qb.orderBy(p.orderBy + '', p.order);
    }

    return qb.skip(p.pageSize * (p.pageNumber - 1)).take(p.pageSize);
}

/** Retrieve all related entities of one specified entity by id in many-to-many relationship
 * E.g. get all products from a category
 * @prop firstEntityName - table DB name of many
 * @prop firstEntityProp - property of many that refers to relationship
 * @prop secondEntityName - table DB name of one
 * @prop secondEntityId - DB id of one
 */
export const applyGetManyFromOne = <T>(qb: SelectQueryBuilder<T>, firstEntityName: string,
    firstEntityProp: keyof T, secondEntityName: string, secondEntityId: string): SelectQueryBuilder<T> => {
    return qb.innerJoin(`${firstEntityName}.${firstEntityProp}`,
        secondEntityName, `${secondEntityName}.id = :entityId`,
        { entityId: secondEntityId });
}

export const getPaged = async <T>(qb: SelectQueryBuilder<T>, sortByTableName?: string,
    params?: TPagedParams<T>): Promise<TPagedList<T>> => {

    const [count, elements] = await Promise.all([qb.getCount(), (() => {
        applyGetPaged(qb, sortByTableName, params);
        return qb.getMany();
    })()]);

    const pagedMeta = {
        pageNumber: params?.pageNumber,
        pageSize: params?.pageSize,
        totalPages: params?.pageSize ? Math.ceil(count / params.pageSize) : undefined,
        totalElements: count,
    }

    return { pagedMeta, elements };
}

export const handleBaseInput = async (entity: TBasePageEntity, input: TBasePageEntityInput) => {
    entity.slug = input.slug;
    if (entity.slug) {
        entity.slug = (entity.slug + '').replace(/\W/g, '-').toLowerCase();
    }
    entity.pageTitle = input.pageTitle;
    entity.pageDescription = input.pageDescription;
    entity.isEnabled = input.isEnabled;
    if (input.meta) {
        entity.meta = {
            keywords: input.meta?.keywords
        }
    }

    await handleCustomMetaInput(entity, input);
}

export const handleCustomMetaInput = async <
    T extends { customMeta?: Record<string, string>; }
>(entity: TBasePageEntity, input: T) => {
    if (input.customMeta && typeof input.customMeta === 'object'
        && Object.keys(input.customMeta).length) {
        if (!entity.metaId) {
            entity.metaId = uuidv4();
        }

        await Promise.all(Object.keys(input.customMeta).map(async key => {
            if (entity.metaId && input.customMeta)
                return getCustomRepository(EntityMetaRepository).setEntityMeta(
                    entity.metaId, key, input.customMeta[key]);
        }));
    }
}

export const checkEntitySlug = async <T extends BasePageEntity>(entity: T, EntityClass: new (...args: any[]) => T): Promise<T> => {
    // check for absence and set id instead
    let hasModified = false;
    if (!entity.slug || entity.slug === '') {
        entity.slug = entity.id + '';
        hasModified = true;
    }

    // check for unique and reset if not
    if (entity.slug) {
        const matches = await getManager().find(EntityClass, {
            where: {
                slug: entity.slug
            }
        });
        for (const match of matches) {
            if (match.id !== entity.id) {
                entity.slug = entity.id;
                hasModified = true;
            }
            if (match.slug === entity.id) {
                entity.slug = entity.id + '_' + getRandStr(4);
                hasModified = true;
                break;
            }
        }
    }

    if (hasModified)
        await entity.save();

    return entity;
}


export const getSqlBoolStr = (dbType: ConnectionOptions['type'], b: boolean) => {
    if (dbType === 'postgres') {
        return b ? 'true' : 'false';
    }
    return b ? '1' : '0';
}

export const getSqlLike = (dbType: ConnectionOptions['type']) => {
    if (dbType === 'postgres') return 'ILIKE';
    return 'LIKE';
}

export const wrapInQuotes = (dbType: ConnectionOptions['type'], str: string) => {
    if (dbType === 'postgres') return `"${str}"`;
    return '`' + str + '`';
}