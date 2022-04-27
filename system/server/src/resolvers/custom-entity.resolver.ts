import {
    EDBEntity,
    GraphQLPaths,
    matchPermissions,
    TAdminCustomEntity,
    TCustomEntity,
    TPagedList,
    TPermissionName,
} from '@cromwell/core';
import {
    CustomEntity,
    CustomEntityFilterInput,
    CustomEntityInput,
    CustomEntityRepository,
    DeleteManyInput,
    entityMetaRepository,
    PagedCustomEntity,
    PagedParamsInput,
    TGraphQLContext,
} from '@cromwell/core-backend';
import { HttpException, HttpStatus } from '@nestjs/common';
import { GraphQLJSONObject } from 'graphql-type-json';
import { throttle } from 'throttle-debounce';
import { Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Container } from 'typedi';
import { getCustomRepository } from 'typeorm';

import { resetAllPagesCache } from '../helpers/reset-page';
import { serverFireAction } from '../helpers/server-fire-action';
import { CmsService } from '../services/cms.service';

const getOneBySlugPath = GraphQLPaths.CustomEntity.getOneBySlug;
const getOneByIdPath = GraphQLPaths.CustomEntity.getOneById;
const createPath = GraphQLPaths.CustomEntity.create;
const updatePath = GraphQLPaths.CustomEntity.update;
const deletePath = GraphQLPaths.CustomEntity.delete;
const getFilteredPath = GraphQLPaths.CustomEntity.getFiltered;
const getManyPath = GraphQLPaths.CustomEntity.getMany;
const deleteManyFilteredPath = GraphQLPaths.CustomEntity.deleteManyFiltered;
const viewsKey: keyof TCustomEntity = 'views';

@Resolver(CustomEntity)
export class CustomEntityResolver {

    private repository = getCustomRepository(CustomEntityRepository);

    private get cmsService() {
        return Container.get(CmsService);
    }

    private customEntities: TAdminCustomEntity[] = [];

    async checkPermissions(entityType: string | undefined, action: 'read' | 'create' | 'update' | 'delete', ctx: TGraphQLContext) {
        if (!entityType) {
            throw new HttpException(`You must provide 'entityType' parameter for this request`, HttpStatus.BAD_REQUEST);
        }

        if (!this.customEntities.find(e => e.entityType === entityType)) {
            this.customEntities = (await this.cmsService.getAdminSettings()).customEntities ?? [];
        } else {
            // Async update to not slow down request
            this.updateEntityConfig();
        }

        const entityConfig = this.customEntities.find(e => e.entityType === entityType);
        if (!entityConfig) throw new HttpException(`Entity of type ${entityType} is not registered`, HttpStatus.BAD_REQUEST);

        const permissions: TPermissionName[] = ['all'];

        // Anyone can read by default if no permissions specified
        if (action === 'read') {
            if (entityConfig.permissions?.read) {
                permissions.push('read_custom_entities', entityConfig.permissions?.read as any);
            }
            else return true;
        }
        // Other actions require permission
        if (action === 'create') {
            permissions.push(...['create_custom_entity', entityConfig.permissions?.create as any].filter(Boolean));
        }
        if (action === 'update') {
            permissions.push(...['update_custom_entity', entityConfig.permissions?.update as any].filter(Boolean));
        }
        if (action === 'delete') {
            permissions.push(...['delete_custom_entity', entityConfig.permissions?.delete as any].filter(Boolean));
        }

        if (!matchPermissions(ctx?.user, permissions))
            throw new HttpException('Access denied.', HttpStatus.FORBIDDEN);

        return true;
    }

    private updateEntityConfig = throttle(1000, () => {
        setTimeout(async () => {
            this.customEntities = (await this.cmsService.getAdminSettings()).customEntities ?? [];
        }, 100);
    });


    @Query(() => PagedCustomEntity)
    async [getManyPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("entityType") entityType: string,
        @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TCustomEntity>
    ): Promise<TPagedList<TCustomEntity>> {
        await this.checkPermissions(entityType, 'read', ctx);
        return this.repository.getCustomEntities(pagedParams);
    }


    @Query(() => PagedCustomEntity)
    async [getFilteredPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TCustomEntity>,
        @Arg("filterParams", { nullable: true }) filterParams?: CustomEntityFilterInput,
    ): Promise<TPagedList<TCustomEntity> | undefined> {
        await this.checkPermissions(filterParams?.entityType, 'read', ctx);
        return this.repository.getFilteredCustomEntities(pagedParams, filterParams);
    }


    @Query(() => CustomEntity)
    async [getOneBySlugPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("entityType") entityType: string,
        @Arg("slug") slug: string
    ): Promise<TCustomEntity | undefined> {
        await this.checkPermissions(entityType, 'read', ctx);
        return this.repository.getCustomEntityBySlug(slug);
    }

    @Query(() => CustomEntity)
    async [getOneByIdPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("entityType") entityType: string,
        @Arg("id", () => Int) id: number
    ): Promise<TCustomEntity | undefined> {
        await this.checkPermissions(entityType, 'read', ctx);
        return this.repository.getCustomEntityById(id);
    }

    @Mutation(() => CustomEntity)
    async [createPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("data") data: CustomEntityInput
    ): Promise<TCustomEntity> {
        await this.checkPermissions(data?.entityType, 'create', ctx);
        const customEntity = await this.repository.createCustomEntity(data);
        serverFireAction('create_custom_entity', customEntity);
        resetAllPagesCache();
        return customEntity;
    }

    @Mutation(() => CustomEntity)
    async [updatePath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("id", () => Int) id: number,
        @Arg("data") data: CustomEntityInput
    ): Promise<TCustomEntity | undefined> {
        await this.checkPermissions(data?.entityType, 'update', ctx);
        const customEntity = await this.repository.updateCustomEntity(id, data);
        serverFireAction('update_custom_entity', customEntity);
        resetAllPagesCache();
        return customEntity;
    }


    @Mutation(() => Boolean)
    async [deletePath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("entityType") entityType: string,
        @Arg("id", () => Int) id: number
    ): Promise<boolean> {
        await this.checkPermissions(entityType, 'delete', ctx);
        const customEntity = await this.repository.deleteCustomEntity(id);
        serverFireAction('delete_custom_entity', { filterParams: { entityType } });
        resetAllPagesCache();
        return customEntity;
    }


    @Mutation(() => Boolean)
    async [deleteManyFilteredPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("input") input: DeleteManyInput,
        @Arg("filterParams", { nullable: true }) filterParams?: CustomEntityFilterInput,
    ): Promise<boolean | undefined> {
        await this.checkPermissions(filterParams?.entityType, 'delete', ctx);
        const res = await this.repository.deleteManyFilteredCustomEntities(input, filterParams);
        serverFireAction('delete_custom_entity', { filterParams });
        resetAllPagesCache();
        return res;
    }

    @FieldResolver(() => GraphQLJSONObject, { nullable: true })
    async customMeta(@Root() entity: CustomEntity, @Arg("keys", () => [String]) fields: string[]): Promise<any> {
        return entityMetaRepository.getEntityMetaByKeys(EDBEntity.CustomEntity, entity.id, fields);
    }

    @FieldResolver(() => Int, { nullable: true })
    async [viewsKey](@Root() entity: CustomEntity): Promise<number | undefined> {
        return this.repository.getEntityViews(entity.id, EDBEntity.CustomEntity);
    }
}