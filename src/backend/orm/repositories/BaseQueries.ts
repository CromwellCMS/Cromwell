import { SelectQueryBuilder } from "typeorm";
import { PagedParamsType, getCMSconfig } from "@cromwell/core";

export const getPaged = <T>(qb: SelectQueryBuilder<T>, entityName?: string, params?: PagedParamsType<T>): SelectQueryBuilder<T> => {
    const p = params ? params : {};
    if (!p.pageNumber) p.pageNumber = 1;
    if (!p.pageSize) {
        const defaultPageSize = getCMSconfig().defaultPageSize;
        p.pageSize = (defaultPageSize && typeof defaultPageSize === 'number') ? defaultPageSize : 15;
    }

    if (p.orderBy && entityName) {
        if (!p.order) p.order = 'DESC';
        qb.orderBy(`${entityName}.${p.orderBy}`, p.order)
    }
    return qb.skip(p.pageSize * (p.pageNumber - 1)).take(p.pageSize);
}

export const innerJoinById = <T>(qb: SelectQueryBuilder<T>, firstEntityName: string,
    firstEntityProp: keyof T, secondEntityName: string, secondEntityId: string): SelectQueryBuilder<T> => {
    return qb.innerJoinAndSelect(`${firstEntityName}.${firstEntityProp}`,
        secondEntityName, `${secondEntityName}.id = :entityId`,
        { entityId: secondEntityId });
}