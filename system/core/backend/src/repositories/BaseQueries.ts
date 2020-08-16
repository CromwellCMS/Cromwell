import { SelectQueryBuilder } from "typeorm";
import { TPagedParams, TPagedList } from '@cromwell/core';
import { getStoreItem } from '@cromwell/core';
const cmsconfig = getStoreItem('cmsconfig');

export const applyGetPaged = <T>(qb: SelectQueryBuilder<T>, entityName?: string, params?: TPagedParams<T>): SelectQueryBuilder<T> => {
    const p = params ? params : {};
    if (!p.pageNumber) p.pageNumber = 1;
    if (!p.pageSize) {
        const defaultPageSize = cmsconfig ? cmsconfig.defaultPageSize : undefined;
        p.pageSize = (defaultPageSize && typeof defaultPageSize === 'number') ? defaultPageSize : 15;
    }

    if (p.orderBy && entityName) {
        if (!p.order) p.order = 'DESC';
        qb.orderBy(`${entityName}.${p.orderBy}`, p.order)
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

export const getPaged = async <T>(qb: SelectQueryBuilder<T>, entityName?: string,
    params?: TPagedParams<T>): Promise<TPagedList<T>> => {
    const count = await qb.getCount();
    applyGetPaged(qb, entityName, params)
    const elements = await qb.getMany();
    const pagedMeta = {
        pageNumber: params?.pageNumber,
        pageSize: params?.pageSize,
        totalPages: params?.pageSize ? Math.ceil(count / params.pageSize) : undefined,
        totalElements: count,
    }

    return { pagedMeta, elements };

}