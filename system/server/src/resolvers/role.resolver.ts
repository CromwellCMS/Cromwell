import { EDBEntity, GraphQLPaths, TPagedList, TPermissionName, TRole } from '@cromwell/core';
import {
    BaseFilterInput,
    DeleteManyInput,
    entityMetaRepository,
    PagedParamsInput,
    PagedRole,
    Role,
    RoleInput,
    RoleRepository,
} from '@cromwell/core-backend';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Arg, Authorized, FieldResolver, Int, Mutation, Query, Resolver, Root } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

import { resetAllPagesCache } from '../helpers/reset-page';
import { serverFireAction } from '../helpers/server-fire-action';

const getOneByIdPath = GraphQLPaths.Role.getOneById;
const getManyPath = GraphQLPaths.Role.getMany;
const createPath = GraphQLPaths.Role.create;
const updatePath = GraphQLPaths.Role.update;
const deletePath = GraphQLPaths.Role.delete;
const deleteManyPath = GraphQLPaths.Role.deleteMany;
const deleteManyFilteredPath = GraphQLPaths.Role.deleteManyFiltered;
const getFilteredPath = GraphQLPaths.Role.getFiltered;

@Resolver(Role)
export class RoleResolver {

    private repository = getCustomRepository(RoleRepository);

    @Authorized<TPermissionName>('read_roles')
    @Query(() => PagedRole)
    async [getManyPath](
        @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TRole>
    ): Promise<TPagedList<TRole>> {
        return this.repository.getRoles(pagedParams);
    }

    @Authorized<TPermissionName>('read_roles')
    @Query(() => Role)
    async [getOneByIdPath](@Arg("id", () => Int) id: number): Promise<TRole | undefined> {
        entityMetaRepository.getAllEntityMetaKeys(EDBEntity.CustomEntity);
        return this.repository.getRoleById(id);
    }

    @Authorized<TPermissionName>('create_role')
    @Mutation(() => Role)
    async [createPath](@Arg("data") data: RoleInput): Promise<TRole> {
        const role = await this.repository.createRole(data);
        serverFireAction('create_role', role);
        resetAllPagesCache();
        return role;
    }

    @Authorized<TPermissionName>('update_role')
    @Mutation(() => Role)
    async [updatePath](@Arg("id", () => Int) id: number, @Arg("data") data: RoleInput): Promise<TRole | undefined> {
        const role = await this.repository.updateRole(id, data);
        serverFireAction('update_role', role);
        resetAllPagesCache();
        return role;
    }

    @Authorized<TPermissionName>('delete_role')
    @Mutation(() => Boolean)
    async [deletePath](@Arg("id", () => Int) id: number): Promise<boolean> {
        const role = await this.repository.deleteRole(id);
        serverFireAction('delete_role', { id });
        resetAllPagesCache();
        return role;
    }

    @Authorized<TPermissionName>('delete_role')
    @Mutation(() => Boolean)
    async [deleteManyPath](@Arg("data") data: DeleteManyInput): Promise<boolean | undefined> {
        const res = await this.repository.deleteMany(data);
        resetAllPagesCache();
        return res;
    }

    @Authorized<TPermissionName>('delete_role')
    @Mutation(() => Boolean)
    async [deleteManyPath](@Arg("data") data: DeleteManyInput): Promise<boolean | undefined> {
        const res = await this.repository.deleteMany(data);
        resetAllPagesCache();
        return res;
    }

    @Authorized<TPermissionName>('delete_role')
    @Mutation(() => Boolean)
    async [deleteManyFilteredPath](
        @Arg("input") input: DeleteManyInput,
        @Arg("filterParams", () => BaseFilterInput, { nullable: true }) filterParams?: BaseFilterInput,
    ): Promise<boolean | undefined> {
        const res = await this.repository.deleteManyFilteredRoles(input, filterParams);
        resetAllPagesCache();
        return res;
    }

    @Authorized<TPermissionName>('read_roles')
    @Query(() => PagedRole)
    async [getFilteredPath](
        @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TRole>,
        @Arg("filterParams", () => BaseFilterInput, { nullable: true }) filterParams?: BaseFilterInput,
    ): Promise<TPagedList<TRole> | undefined> {
        return this.repository.getFilteredRoles(pagedParams, filterParams);
    }

    @FieldResolver(() => GraphQLJSONObject, { nullable: true })
    async customMeta(@Root() entity: Role, @Arg("keys", () => [String]) fields: string[]): Promise<any> {
        return entityMetaRepository.getEntityMetaByKeys(EDBEntity.Role, entity.id, fields);
    }
}