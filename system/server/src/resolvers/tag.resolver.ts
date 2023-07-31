import { EDBEntity, GraphQLPaths, TPagedList, TPermissionName, TTag } from '@cromwell/core';
import {
  BaseFilterInput,
  DeleteManyInput,
  entityMetaRepository,
  PagedParamsInput,
  PagedTag,
  Tag,
  TagInput,
  TagRepository,
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
  getBySlugWithFilters,
  getManyWithFilters,
  updateWithFilters,
} from '../helpers/data-filters';

const getOneBySlugPath = GraphQLPaths.Tag.getOneBySlug;
const getOneByIdPath = GraphQLPaths.Tag.getOneById;
const getManyPath = GraphQLPaths.Tag.getMany;
const createPath = GraphQLPaths.Tag.create;
const updatePath = GraphQLPaths.Tag.update;
const deletePath = GraphQLPaths.Tag.delete;
const deleteManyPath = GraphQLPaths.Tag.deleteMany;
const viewsKey: keyof TTag = 'views';

@Resolver(Tag)
export class TagResolver {
  private repository = getCustomRepository(TagRepository);

  @Query(() => Tag)
  async [getOneByIdPath](@Ctx() ctx: TGraphQLContext, @Arg('id', () => Int) id: number): Promise<TTag> {
    return getByIdWithFilters('Tag', ctx, [], ['read_tags'], id, (...args) => this.repository.getTagById(...args));
  }

  @Query(() => Tag)
  async [getOneBySlugPath](@Ctx() ctx: TGraphQLContext, @Arg('slug', () => String) slug: string): Promise<TTag> {
    return getBySlugWithFilters('Tag', ctx, [], ['read_tags'], slug, (...args) =>
      this.repository.getTagBySlug(...args),
    );
  }

  @Query(() => PagedTag)
  async [getManyPath](
    @Ctx() ctx: TGraphQLContext,
    @Arg('pagedParams', () => PagedParamsInput, { nullable: true }) pagedParams?: PagedParamsInput<TTag>,
    @Arg('filterParams', () => BaseFilterInput, { nullable: true }) filterParams?: BaseFilterInput,
  ): Promise<TPagedList<TTag> | undefined> {
    return getManyWithFilters('Tag', ctx, [], ['read_tags'], pagedParams, filterParams, (...args) =>
      this.repository.getFilteredTags(...args),
    );
  }

  @Authorized<TPermissionName>('create_tag')
  @Mutation(() => Tag)
  async [createPath](@Ctx() ctx: TGraphQLContext, @Arg('data', () => TagInput) data: TagInput): Promise<TTag> {
    return createWithFilters('Tag', ctx, ['create_tag'], data, (...args) => this.repository.createTag(...args));
  }

  @Authorized<TPermissionName>('update_tag')
  @Mutation(() => Tag)
  async [updatePath](
    @Ctx() ctx: TGraphQLContext,
    @Arg('id', () => Int) id: number,
    @Arg('data', () => TagInput) data: TagInput,
  ): Promise<TTag | undefined> {
    return updateWithFilters('Tag', ctx, ['update_tag'], data, id, (...args) => this.repository.updateTag(...args));
  }

  @Authorized<TPermissionName>('delete_tag')
  @Mutation(() => Boolean)
  async [deletePath](@Ctx() ctx: TGraphQLContext, @Arg('id', () => Int) id: number): Promise<boolean> {
    return deleteWithFilters('Tag', ctx, ['delete_tag'], id, (...args) => this.repository.deleteTag(...args));
  }

  @Authorized<TPermissionName>('delete_tag')
  @Mutation(() => Boolean)
  async [deleteManyPath](
    @Ctx() ctx: TGraphQLContext,
    @Arg('input', () => DeleteManyInput) input: DeleteManyInput,
    @Arg('filterParams', () => BaseFilterInput, { nullable: true }) filterParams?: BaseFilterInput,
  ): Promise<boolean | undefined> {
    return deleteManyWithFilters('Tag', ctx, ['delete_tag'], input, filterParams, (...args) =>
      this.repository.deleteManyFilteredTags(...args),
    );
  }

  @FieldResolver(() => GraphQLJSONObject, { nullable: true })
  async customMeta(@Root() entity: Tag, @Arg('keys', () => [String]) fields: string[]): Promise<any> {
    return entityMetaRepository.getEntityMetaByKeys(EDBEntity.Tag, entity.id, fields);
  }

  @FieldResolver(() => Int, { nullable: true })
  async [viewsKey](@Root() product: Tag): Promise<number | undefined> {
    return this.repository.getEntityViews(product.id, EDBEntity.Tag);
  }
}
