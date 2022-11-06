import { EDBEntity, GraphQLPaths, TAttribute, TPagedList, TPermissionName } from '@cromwell/core';
import {
  Attribute,
  AttributeInput,
  AttributeRepository,
  BaseFilterInput,
  DeleteManyInput,
  entityMetaRepository,
  PagedAttribute,
  PagedParamsInput,
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

const getOneByIdPath = GraphQLPaths.Attribute.getOneById;
const getManyPath = GraphQLPaths.Attribute.getMany;
const createPath = GraphQLPaths.Attribute.create;
const updatePath = GraphQLPaths.Attribute.update;
const deletePath = GraphQLPaths.Attribute.delete;
const deleteManyPath = GraphQLPaths.Attribute.deleteMany;

@Resolver(Attribute)
export class AttributeResolver {
  private repository = getCustomRepository(AttributeRepository);

  @Query(() => Attribute)
  async [getOneByIdPath](@Ctx() ctx: TGraphQLContext, @Arg('id', () => Int) id: number): Promise<TAttribute> {
    return getByIdWithFilters('Attribute', ctx, [], ['read_attributes'], id, (...args) =>
      this.repository.getAttribute(...args),
    );
  }

  @Query(() => PagedAttribute)
  async [getManyPath](
    @Ctx() ctx: TGraphQLContext,
    @Arg('pagedParams', { nullable: true }) pagedParams?: PagedParamsInput<TAttribute>,
    @Arg('filterParams', () => BaseFilterInput, { nullable: true }) filterParams?: BaseFilterInput,
  ): Promise<TPagedList<TAttribute> | undefined> {
    return getManyWithFilters('Attribute', ctx, [], ['read_attributes'], pagedParams, filterParams, (...args) =>
      this.repository.getFilteredAttributes(...args),
    );
  }

  @Authorized<TPermissionName>('create_attribute')
  @Mutation(() => Attribute)
  async [createPath](@Ctx() ctx: TGraphQLContext, @Arg('data') data: AttributeInput): Promise<TAttribute> {
    return createWithFilters('Attribute', ctx, ['create_attribute'], data, (...args) =>
      this.repository.createAttribute(...args),
    );
  }

  @Authorized<TPermissionName>('update_attribute')
  @Mutation(() => Attribute)
  async [updatePath](
    @Ctx() ctx: TGraphQLContext,
    @Arg('id', () => Int) id: number,
    @Arg('data') data: AttributeInput,
  ): Promise<TAttribute> {
    return updateWithFilters('Attribute', ctx, ['update_attribute'], data, id, (...args) =>
      this.repository.updateAttribute(...args),
    );
  }

  @Authorized<TPermissionName>('delete_attribute')
  @Mutation(() => Boolean)
  async [deletePath](@Ctx() ctx: TGraphQLContext, @Arg('id', () => Int) id: number): Promise<boolean> {
    return deleteWithFilters('Attribute', ctx, ['delete_attribute'], id, (...args) =>
      this.repository.deleteAttribute(...args),
    );
  }

  @Authorized<TPermissionName>('delete_attribute')
  @Mutation(() => Boolean)
  async [deleteManyPath](
    @Ctx() ctx: TGraphQLContext,
    @Arg('input') input: DeleteManyInput,
    @Arg('filterParams', () => BaseFilterInput, { nullable: true }) filterParams?: BaseFilterInput,
  ): Promise<boolean | undefined> {
    return deleteManyWithFilters('Attribute', ctx, ['delete_attribute'], input, filterParams, (...args) =>
      this.repository.deleteManyFilteredAttributes(...args),
    );
  }

  @FieldResolver(() => GraphQLJSONObject, { nullable: true })
  async customMeta(@Root() entity: Attribute, @Arg('keys', () => [String]) fields: string[]): Promise<any> {
    return entityMetaRepository.getEntityMetaByKeys(EDBEntity.Attribute, entity.id, fields);
  }
}
