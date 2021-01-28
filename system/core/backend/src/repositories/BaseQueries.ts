import { SelectQueryBuilder } from "typeorm";
import { TPagedParams, TPagedList, TBasePageEntity, TBasePageEntityInput } from '@cromwell/core';
import { getStoreItem } from '@cromwell/core';

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
        // console.log('qb.getSql()', qb.getSql())
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
    entity.slug = input.slug;
    entity.pageTitle = input.pageTitle;
    entity.isEnabled = input.isEnabled;
}