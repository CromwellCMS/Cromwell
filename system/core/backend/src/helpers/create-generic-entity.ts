import { GraphQLPaths, TPermissionName, TPagedList } from '@cromwell/core';
import { Arg, Args, ArgsType, Authorized, Field, Int, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { EntityRepository, getCustomRepository, ObjectType as TObjectType } from 'typeorm';

import { PagedParamsInput } from '../models/inputs/paged-params.input';
import { BaseFilterInput } from '../models/filters/base-filter.filter';
import { PagedMeta } from '../models/paged/meta.paged';
import { BaseRepository } from '../repositories/base.repository';

export const createGenericEntity = <
  EntityType extends { id?: number | undefined },
  EntityInputType extends object = EntityType,
>(
  entityName: string,
  EntityClass: new (...args: any[]) => EntityType,
  InputEntityClass?: new (...args: any[]) => EntityInputType,
) => {
  @EntityRepository(EntityClass)
  class GenericRepository extends BaseRepository<EntityType, EntityInputType> {
    constructor() {
      super(EntityClass);
    }
  }

  @ObjectType(`Paged${entityName}`)
  class PagedEntity implements TPagedList<EntityType> {
    @Field(() => PagedMeta, { nullable: true })
    pagedMeta?: PagedMeta;

    @Field(() => [EntityClass], { nullable: true })
    elements?: EntityType[];
  }

  @ArgsType()
  class CreateArgs {
    @Field(() => InputEntityClass ?? String)
    data: EntityInputType;
  }

  @ArgsType()
  class UpdateArgs {
    @Field(() => Int)
    id: number;

    @Field(() => InputEntityClass ?? String)
    data: EntityInputType;
  }

  const getPagedPath = GraphQLPaths.Generic.getManyPaged + entityName;
  const getAllPath = GraphQLPaths.Generic.getMany + entityName;
  const getBySlugPath = GraphQLPaths.Generic.getOneBySlug + entityName;
  const getByIdPath = GraphQLPaths.Generic.getOneById + entityName;
  const createPath = GraphQLPaths.Generic.create + entityName;
  const updatePath = GraphQLPaths.Generic.update + entityName;
  const deletePath = GraphQLPaths.Generic.delete + entityName;
  const getFilteredPath = GraphQLPaths.Generic.getFiltered + entityName;

  @Resolver(EntityClass, { isAbstract: true })
  abstract class GenericResolver {
    private repository = getCustomRepository(GenericRepository);

    @Authorized<string>(`read_${entityName.toLowerCase()}s`)
    @Query(() => PagedEntity)
    async [getPagedPath](
      @Arg('pagedParams') pagedParams: PagedParamsInput<EntityType>,
    ): Promise<TPagedList<EntityType>> {
      return this.repository.getPaged(pagedParams);
    }

    @Authorized<string>(`read_${entityName.toLowerCase()}s`)
    @Query(() => [EntityClass])
    async [getAllPath](): Promise<EntityType[]> {
      return this.repository.getAll();
    }

    @Authorized<string>(`read_${entityName.toLowerCase()}s`)
    @Query(() => EntityClass)
    async [getBySlugPath](@Arg('slug') slug: string): Promise<EntityType | undefined> {
      return this.repository.getBySlug(slug);
    }

    @Authorized<string>(`read_${entityName.toLowerCase()}s`)
    @Query(() => EntityClass)
    async [getByIdPath](@Arg('id', () => Int) id: number): Promise<EntityType | undefined> {
      return this.repository.getById(id);
    }

    @Authorized<string>(`read_${entityName.toLowerCase()}s`)
    @Query(() => PagedEntity)
    async [getFilteredPath](
      @Arg('pagedParams', () => PagedParamsInput, { nullable: true }) pagedParams?: PagedParamsInput<EntityType>,
      @Arg('filterParams', () => BaseFilterInput, { nullable: true }) filterParams?: BaseFilterInput,
    ): Promise<TPagedList<EntityType> | undefined> {
      return this.repository.getFilteredEntities(pagedParams, filterParams);
    }

    @Authorized<string>(`create_${entityName.toLowerCase()}`)
    @Mutation(() => EntityClass)
    async [createPath](@Args() { data }: CreateArgs): Promise<EntityType> {
      return this.repository.createEntity(data);
    }

    @Authorized<string>(`update_${entityName.toLowerCase()}`)
    @Mutation(() => EntityClass)
    async [updatePath](@Args() { id, data }: UpdateArgs): Promise<EntityType> {
      return this.repository.updateEntity(id, data);
    }

    @Authorized<string>(`delete_${entityName.toLowerCase()}`)
    @Mutation(() => Boolean)
    async [deletePath](@Arg('id', () => Int) id: number): Promise<boolean> {
      return this.repository.deleteEntity(id);
    }
  }

  return {
    abstractResolver: GenericResolver as any,
    repository: GenericRepository as TObjectType<BaseRepository<EntityType, EntityInputType>>,
    pagedEntity: PagedEntity as any,
    createArgs: CreateArgs as any,
    updateArgs: UpdateArgs as any,
  };
};
