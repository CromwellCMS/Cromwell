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

export const applyInnerJoinById = <T>(qb: SelectQueryBuilder<T>, firstEntityName: string,
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
        totalPages: params?.pageSize ? Math.floor(count / params.pageSize) : undefined,
        totalElements: count,
    }
    
    return { pagedMeta, elements };

}