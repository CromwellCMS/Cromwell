import { TPagedList } from '@cromwell/core';
import { BaseRepository, PagedMeta, PagedParamsInput } from '@cromwell/core-backend';
import { Arg, Args, ArgsType, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { EntityRepository, getCustomRepository } from 'typeorm';

export const createResolver = <EntityType>(entityName: string, DBTableName: string,
    EntityClass: new (...args: any[]) => EntityType,
    InputEntityClass: new (...args: any[]) => EntityType) => {

    @EntityRepository(EntityClass)
    class GenericRepository extends BaseRepository<EntityType> {
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
        @Field(() => InputEntityClass)
        data: EntityType;
    }

    @ArgsType()
    class UpdateArgs {
        @Field(() => String)
        id: string;

        @Field(() => InputEntityClass)
        data: EntityType;
    }

    const getPagedPath = 'getPaged' + entityName;
    const getAllPath = 'getAll' + entityName;
    const getBySlugPath = 'getBySlug' + entityName;
    const getByIdPath = 'getById' + entityName;
    const createPath = 'create' + entityName;
    const updatePath = 'update' + entityName;
    const deletePath = 'delete' + entityName;

    @Resolver(EntityClass)
    class GenericResolver {

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

    return GenericResolver;
}

