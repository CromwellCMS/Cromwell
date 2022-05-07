import { TPagedList, TPagedParams, TPermissionName } from '@cromwell/core';
import { applyDataFilters, DeleteManyInput, TFilterableEntities, TGraphQLContext } from '@cromwell/core-backend';

import { resetAllPagesCache } from './reset-page';


export const getByIdWithFilters = async <TEntityKey extends keyof TFilterableEntities>(
    entity: TEntityKey,
    ctx: TGraphQLContext,
    permissions: TPermissionName[],
    id: number,
    getById: (id: number) => Promise<TFilterableEntities[TEntityKey]['entity']>
): Promise<TFilterableEntities[TEntityKey]['entity']> => {
    id = (await applyDataFilters(entity, 'getOneByIdInput', {
        id,
        user: ctx?.user,
        permissions,
    })).id;
    return (await applyDataFilters(entity, 'getOneByIdOutput', {
        id,
        data: await getById(id),
        user: ctx?.user,
        permissions,
    })).data;
}

export const getBySlugWithFilters = async <TEntityKey extends keyof TFilterableEntities>(
    entity: TEntityKey,
    ctx: TGraphQLContext,
    permissions: TPermissionName[],
    slug: string,
    getBySlug: (slug: string) => Promise<TFilterableEntities[TEntityKey]['entity']>
): Promise<TFilterableEntities[TEntityKey]['entity']> => {
    slug = (await applyDataFilters(entity, 'getOneBySlugInput', {
        slug,
        user: ctx?.user,
        permissions,
    })).slug;
    return (await applyDataFilters(entity, 'getOneBySlugOutput', {
        slug,
        data: await getBySlug(slug),
        user: ctx?.user,
        permissions,
    })).data;
}

export const getManyWithFilters = async <TEntityKey extends keyof TFilterableEntities>(
    entity: TEntityKey,
    ctx: TGraphQLContext,
    permissions: TPermissionName[],
    params: TPagedParams<TFilterableEntities[TEntityKey]['entity']> | undefined,
    filter: TFilterableEntities[TEntityKey]['filter'] | undefined,
    getMany: (params?: TPagedParams<TFilterableEntities[TEntityKey]['entity']>,
        filter?: TFilterableEntities[TEntityKey]['filter']) =>
        Promise<TPagedList<TFilterableEntities[TEntityKey]['entity']>>
): Promise<TPagedList<TFilterableEntities[TEntityKey]['entity']>> => {
    const result = (await applyDataFilters(entity, 'getManyInput', {
        params,
        filter,
        user: ctx?.user,
        permissions,
    }));
    params = result.params;
    filter = result.filter;
    return (await applyDataFilters(entity, 'getManyOutput', {
        params,
        filter,
        data: await getMany(params, filter),
        user: ctx?.user,
        permissions,
    })).data;
}


export const createWithFilters = async <TEntityKey extends keyof TFilterableEntities>(
    entity: TEntityKey,
    ctx: TGraphQLContext,
    permissions: TPermissionName[],
    input: TFilterableEntities[TEntityKey]['create'],
    create: (input: TFilterableEntities[TEntityKey]['create']) => Promise<TFilterableEntities[TEntityKey]['entity']>
): Promise<TFilterableEntities[TEntityKey]['entity']> => {
    input = (await applyDataFilters(entity, 'createInput', {
        data: input,
        user: ctx?.user,
        permissions,
    })).data;
    return (await applyDataFilters(entity, 'createOutput', {
        data: await create(input),
        user: ctx?.user,
        permissions,
    }).then(res => { resetAllPagesCache(); return res; })).data;
}


export const updateWithFilters = async <TEntityKey extends keyof TFilterableEntities>(
    entity: TEntityKey,
    ctx: TGraphQLContext,
    permissions: TPermissionName[],
    input: TFilterableEntities[TEntityKey]['update'],
    id: number,
    update: (id: number, input: TFilterableEntities[TEntityKey]['update']) => Promise<TFilterableEntities[TEntityKey]['entity']>
): Promise<TFilterableEntities[TEntityKey]['entity']> => {
    const result = (await applyDataFilters(entity, 'updateInput', {
        id,
        data: input,
        user: ctx?.user,
        permissions,
    }));
    input = result.data;
    id = result.id;
    return (await applyDataFilters(entity, 'updateOutput', {
        id,
        data: await update(id, input),
        user: ctx?.user,
        permissions,
    }).then(res => { resetAllPagesCache(); return res; })).data;
}


export const deleteWithFilters = async <TEntityKey extends keyof TFilterableEntities>(
    entity: TEntityKey,
    ctx: TGraphQLContext,
    permissions: TPermissionName[],
    id: number,
    deleteById: (id: number) => Promise<boolean>
): Promise<boolean> => {
    id = (await applyDataFilters(entity, 'deleteInput', {
        id,
        user: ctx?.user,
        permissions,
    })).id;
    return (await applyDataFilters(entity, 'deleteOutput', {
        id,
        success: await deleteById(id),
        user: ctx?.user,
        permissions,
    }).then(res => { resetAllPagesCache(); return res; })).success;
}

export const deleteManyWithFilters = async <TEntityKey extends keyof TFilterableEntities>(
    entity: TEntityKey,
    ctx: TGraphQLContext,
    permissions: TPermissionName[],
    input: DeleteManyInput,
    filter: TFilterableEntities[TEntityKey]['filter'] | undefined,
    deleteMany: (input: DeleteManyInput, filter?: TFilterableEntities[TEntityKey]['filter']) => Promise<boolean>
): Promise<boolean> => {
    const result = (await applyDataFilters(entity, 'deleteManyInput', {
        input,
        filter,
        user: ctx?.user,
        permissions,
    }));
    input = result.input;
    filter = result.filter;
    return (await applyDataFilters(entity, 'deleteManyOutput', {
        input,
        filter,
        success: await deleteMany(input, filter),
        user: ctx?.user,
        permissions,
    }).then(res => { resetAllPagesCache(); return res; })).success;
}
