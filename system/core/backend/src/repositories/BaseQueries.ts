import { getManager, SelectQueryBuilder } from "typeorm";
import { TPagedParams, TPagedList, TBasePageEntity, TBasePageEntityInput } from '@cromwell/core';
import { getStoreItem, getRandStr } from '@cromwell/core';
import { BasePageEntity } from "../entities/BasePageEntity";

export const applyGetPaged = <T>(qb: SelectQueryBuilder<T>, sortByTableName?: string, params?: TPagedParams<T>): SelectQueryBuilder<T> => {
    const cmsSettings = getStoreItem('cmsSettings');
    const p = params ? params : {};
    if (!p.pageNumber) p.pageNumber = 1;
    if (!p.pageSize) {
        const def = cmsSettings?.defaultPageSize
        p.pageSize = def && typeof def === 'number' ? def : 15;
    }

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
    return qb.innerJoinAndSelect(`${firstEntityName}.${firstEntityProp}`,
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

export const handleBaseInput = (entity: TBasePageEntity, input: TBasePageEntityInput) => {
    entity.slug = input.slug
    if (entity.slug) {
        entity.slug = entity.slug.replace(/\W/g, '-').toLowerCase();
    }
    entity.pageTitle = input.pageTitle;
    entity.isEnabled = input.isEnabled;
}

export const checkEntitySlug = async <T extends BasePageEntity>(entity: T, EntityClass: new (...args: any[]) => T): Promise<T> => {
    // check for absence and set id instead
    let hasModified = false;
    if (!entity.slug || entity.slug === '') {
        entity.slug = entity.id;
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
        };
    }

    if (hasModified)
        await entity.save();

    return entity;
}