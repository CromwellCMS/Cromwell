import { EDBEntity, GraphQLPaths, TAuthRole, TPagedList, TCustomEntity } from '@cromwell/core';
import {
    DeleteManyInput,
    entityMetaRepository,
    CustomEntityInput,
    PagedParamsInput,
    PagedCustomEntity,
    CustomEntity,
    CustomEntityRepository,
    CustomEntityFilterInput,
} from '@cromwell/core-backend';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Arg, Authorized, FieldResolver, Int, Mutation, Query, Resolver, Root } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

import { resetAllPagesCache } from '../helpers/reset-page';
import { serverFireAction } from '../helpers/server-fire-action';

const getOneBySlugPath = GraphQLPaths.CustomEntity.getOneBySlug;
const getOneByIdPath = GraphQLPaths.CustomEntity.getOneById;
const getManyPath = GraphQLPaths.CustomEntity.getMany;
const createPath = GraphQLPaths.CustomEntity.create;
const updatePath = GraphQLPaths.CustomEntity.update;
const deletePath = GraphQLPaths.CustomEntity.delete;
const deleteManyPath = GraphQLPaths.CustomEntity.deleteMany;
const getFilteredPath = GraphQLPaths.CustomEntity.getFiltered;
const deleteManyFilteredPath = GraphQLPaths.CustomEntity.deleteManyFiltered;
const viewsKey: keyof TCustomEntity = 'views';


@Resolver(CustomEntity)
export class CustomEntityResolver {

    private repository = getCustomRepository(CustomEntityRepository);

    @Query(() => PagedCustomEntity)
    async [getManyPath](@Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TCustomEntity>):
        Promise<TPagedList<TCustomEntity>> {
        return this.repository.getCustomEntities(pagedParams);
    }

    @Query(() => PagedCustomEntity)
    async [getFilteredPath](
        @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TCustomEntity>,
        @Arg("filterParams", { nullable: true }) filterParams?: CustomEntityFilterInput,
    ): Promise<TPagedList<TCustomEntity> | undefined> {
        return this.repository.getFilteredCustomEntities(pagedParams, filterParams);
    }

    @Query(() => CustomEntity)
    async [getOneBySlugPath](@Arg("slug") slug: string): Promise<TCustomEntity | undefined> {
        return this.repository.getCustomEntityBySlug(slug);
    }

    @Query(() => CustomEntity)
    async [getOneByIdPath](@Arg("id", () => Int) id: number): Promise<TCustomEntity | undefined> {
        return this.repository.getCustomEntityById(id);
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => CustomEntity)
    async [createPath](@Arg("data") data: CustomEntityInput): Promise<TCustomEntity> {
        const customEntity = await this.repository.createCustomEntity(data);
        serverFireAction('create_custom_entity', customEntity);
        resetAllPagesCache();
        return customEntity;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => CustomEntity)
    async [updatePath](@Arg("id", () => Int) id: number, @Arg("data") data: CustomEntityInput): Promise<TCustomEntity | undefined> {
        const customEntity = await this.repository.updateCustomEntity(id, data);
        serverFireAction('update_custom_entity', customEntity);
        resetAllPagesCache();
        return customEntity;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Boolean)
    async [deletePath](@Arg("id", () => Int) id: number): Promise<boolean> {
        const customEntity = await this.repository.deleteCustomEntity(id);
        serverFireAction('delete_custom_entity', { id });
        resetAllPagesCache();
        return customEntity;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Boolean)
    async [deleteManyPath](@Arg("data") data: DeleteManyInput): Promise<boolean | undefined> {
        const res = await this.repository.deleteMany(data);
        resetAllPagesCache();
        return res;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Boolean)
    async [deleteManyFilteredPath](
        @Arg("input") input: DeleteManyInput,
        @Arg("filterParams", { nullable: true }) filterParams?: CustomEntityFilterInput,
    ): Promise<boolean | undefined> {
        const res = await this.repository.deleteManyFilteredCustomEntities(input, filterParams);
        resetAllPagesCache();
        return res;
    }

    @FieldResolver(() => GraphQLJSONObject, { nullable: true })
    async customMeta(@Root() entity: CustomEntity, @Arg("fields", () => [String]) fields: string[]): Promise<any> {
        return entityMetaRepository.getEntityMetaValuesByKeys(EDBEntity.CustomEntity, entity.id, fields);
    }

    @FieldResolver(() => Int, { nullable: true })
    async [viewsKey](@Root() entity: CustomEntity): Promise<number | undefined> {
        return this.repository.getEntityViews(entity.id, EDBEntity.CustomEntity);
    }
}