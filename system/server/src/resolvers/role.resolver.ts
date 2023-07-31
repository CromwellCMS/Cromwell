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
  TGraphQLContext,
} from '@cromwell/core-backend';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Arg, Authorized, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

import {
  createWithFilters,
  deleteManyWithFilters,
  deleteWithFilters,
  getByIdWithFilters,
  getManyWithFilters,
  updateWithFilters,
} from '../helpers/data-filters';

const getOneByIdPath = GraphQLPaths.Role.getOneById;
const getManyPath = GraphQLPaths.Role.getMany;
const createPath = GraphQLPaths.Role.create;
const updatePath = GraphQLPaths.Role.update;
const deletePath = GraphQLPaths.Role.delete;
const deleteManyPath = GraphQLPaths.Role.deleteMany;

@Resolver(Role)
export class RoleResolver {
  private repository = getCustomRepository(RoleRepository);

  @Authorized<TPermissionName>('read_roles')
  @Query(() => Role)
  async [getOneByIdPath](@Ctx() ctx: TGraphQLContext, @Arg('id', () => Int) id: number): Promise<TRole | undefined> {
    return getByIdWithFilters('Role', ctx, ['read_roles'], ['read_roles'], id, (...args) =>
      this.repository.getRoleById(...args),
    );
  }

  @Authorized<TPermissionName>('read_roles')
  @Query(() => PagedRole)
  async [getManyPath](
    @Ctx() ctx: TGraphQLContext,
    @Arg('pagedParams', () => PagedParamsInput, { nullable: true }) pagedParams?: PagedParamsInput<TRole>,
    @Arg('filterParams', () => BaseFilterInput, { nullable: true }) filterParams?: BaseFilterInput,
  ): Promise<TPagedList<TRole> | undefined> {
    return getManyWithFilters('Role', ctx, ['read_roles'], ['read_roles'], pagedParams, filterParams, (...args) =>
      this.repository.getFilteredRoles(...args),
    );
  }

  @Authorized<TPermissionName>('create_role')
  @Mutation(() => Role)
  async [createPath](@Ctx() ctx: TGraphQLContext, @Arg('data', () => RoleInput) data: RoleInput): Promise<TRole> {
    return createWithFilters('Role', ctx, ['create_role'], data, (...args) => this.repository.createRole(...args));
  }

  @Authorized<TPermissionName>('update_role')
  @Mutation(() => Role)
  async [updatePath](
    @Ctx() ctx: TGraphQLContext,
    @Arg('id', () => Int) id: number,
    @Arg('data', () => RoleInput) data: RoleInput,
  ): Promise<TRole | undefined> {
    return updateWithFilters('Role', ctx, ['update_role'], data, id, (...args) => this.repository.updateRole(...args));
  }

  @Authorized<TPermissionName>('delete_role')
  @Mutation(() => Boolean)
  async [deletePath](@Ctx() ctx: TGraphQLContext, @Arg('id', () => Int) id: number): Promise<boolean> {
    return deleteWithFilters('Role', ctx, ['delete_role'], id, (...args) => this.repository.deleteRole(...args));
  }

  @Authorized<TPermissionName>('delete_role')
  @Mutation(() => Boolean)
  async [deleteManyPath](
    @Ctx() ctx: TGraphQLContext,
    @Arg('input', () => DeleteManyInput) input: DeleteManyInput,
    @Arg('filterParams', () => BaseFilterInput, { nullable: true }) filterParams?: BaseFilterInput,
  ): Promise<boolean | undefined> {
    return deleteManyWithFilters('Role', ctx, ['delete_role'], input, filterParams, (...args) =>
      this.repository.deleteManyFilteredRoles(...args),
    );
  }

  @FieldResolver(() => GraphQLJSONObject, { nullable: true })
  async customMeta(@Root() entity: Role, @Arg('keys', () => [String]) fields: string[]): Promise<any> {
    return entityMetaRepository.getEntityMetaByKeys(EDBEntity.Role, entity.id, fields);
  }
}
