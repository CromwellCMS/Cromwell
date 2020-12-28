import { GraphQLPaths, TPagedList } from '@cromwell/core';
import { BaseRepository, PagedMeta, PagedParamsInput } from '@cromwell/core-backend';
import { Arg, Args, ArgsType, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { EntityRepository, getCustomRepository } from 'typeorm';

export const createGenericEntity = <EntityType, EntityInputType = EntityType>(entityName: string, DBTableName: string,
    EntityClass: new (...args: any[]) => EntityType,
    InputEntityClass?: new (...args: any[]) => EntityInputType) => {

    @EntityRepository(EntityClass)
    class GenericRepository extends BaseRepository<EntityType, EntityInputType> {
        constructor() {
            super(DBTableName, EntityClass)
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
        @Field(() => String)
        id: string;

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

    @Resolver(EntityClass, { isAbstract: true })
    abstract class GenericResolver {

        private repository = getCustomRepository(GenericRepository)

        @Query(() => PagedEntity)
        async [getPagedPath](@Arg("pagedParams") pagedParams: PagedParamsInput<EntityType>):
            Promise<TPagedList<EntityType>> {
            return this.repository.getPaged(pagedParams);
        }

        @Query(() => [EntityClass])
        async [getAllPath](): Promise<EntityType[]> {
            return this.repository.getAll();
        }

        @Query(() => EntityClass)
        async [getBySlugPath](@Arg("slug") slug: string): Promise<EntityType | undefined> {
            return this.repository.getBySlug(slug);
        }

        @Query(() => EntityClass)
        async [getByIdPath](@Arg("id") id: string): Promise<EntityType | undefined> {
            return this.repository.getById(id);
        }

        @Mutation(() => EntityClass)
        async [createPath](@Args() { data }: CreateArgs): Promise<EntityType> {
            return this.repository.createEntity(data);
        }

        @Mutation(() => EntityClass)
        async [updatePath](@Args() { id, data }: UpdateArgs): Promise<EntityType> {
            return this.repository.updateEntity(id, data);
        }

        @Mutation(() => Boolean)
        async [deletePath](@Arg("id") id: string): Promise<boolean> {
            return this.repository.deleteEntity(id);
        }

    }

    return {
        abstractResolver: GenericResolver,
        repository: GenericRepository,
        pagedEntity: PagedEntity,
        createArgs: CreateArgs,
        updateArgs: UpdateArgs
    }
}

