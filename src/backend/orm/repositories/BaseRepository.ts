import { SelectQueryBuilder } from "typeorm";
import { PagedParamsType } from "@cromwell/core";

export const getPaged = <T>(qb: SelectQueryBuilder<T>, entityName?: string, params?: PagedParamsType<T>): SelectQueryBuilder<T> => {
    if (!params) params = {};
    if (!params.pageNumber) params.pageNumber = 1;
    if (!params.pageSize) params.pageSize = 4;

    if (params.orderBy && entityName) {
        if (!params.order) params.order = 'DESC';
        qb.orderBy(`${entityName}.${params.orderBy}`, params.order)
    }
    return qb.skip(params.pageSize * (params.pageNumber - 1))
        .take(params.pageSize);
}

export const innerJoinById = <T>(qb: SelectQueryBuilder<T>, firstEntityName: string,
    firstEntityProp: keyof T, secondEntityName: string, secondEntityId: string): SelectQueryBuilder<T> => {
    return qb.innerJoinAndSelect(`${firstEntityName}.${firstEntityProp}`,
        secondEntityName, `${secondEntityName}.id = :entityId`,
        { entityId: secondEntityId });
}