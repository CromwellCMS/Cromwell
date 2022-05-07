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

import {
    createWithFilters,
    deleteManyWithFilters,
    deleteWithFilters,
    getByIdWithFilters,
    getBySlugWithFilters,
    getManyWithFilters,
    updateWithFilters,
} from '../helpers/data-filters';
import { CmsService } from '../services/cms.service';

const getOneBySlugPath = GraphQLPaths.CustomEntity.getOneBySlug;
const getOneByIdPath = GraphQLPaths.CustomEntity.getOneById;
const createPath = GraphQLPaths.CustomEntity.create;
const updatePath = GraphQLPaths.CustomEntity.update;
const deletePath = GraphQLPaths.CustomEntity.delete;
const deleteManyPath = GraphQLPaths.CustomEntity.deleteMany;
const getManyPath = GraphQLPaths.CustomEntity.getMany;
const viewsKey: keyof TCustomEntity = 'views';

@Resolver(CustomEntity)
export class CustomEntityResolver {

    private repository = getCustomRepository(CustomEntityRepository);

    private get cmsService() {
        return Container.get(CmsService);
    }

    private customEntities: TAdminCustomEntity[] = [];

    async checkPermissions(entityType: string | undefined, action: 'read' | 'create' | 'update' | 'delete',
        ctx: TGraphQLContext): Promise<TPermissionName[]> {
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

        const permissions: TPermissionName[] = [];

        // Anyone can read by default if no permissions specified
        if (action === 'read') {
            if (entityConfig.permissions?.read) {
                permissions.push('read_custom_entities', entityConfig.permissions?.read as any);
            }
            else return permissions;
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

        return permissions;
    }

    private updateEntityConfig = throttle(1000, () => {
        setTimeout(async () => {
            this.customEntities = (await this.cmsService.getAdminSettings()).customEntities ?? [];
        }, 100);
    });

    @Query(() => CustomEntity)
    async [getOneByIdPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("entityType") entityType: string,
        @Arg("id", () => Int) id: number
    ): Promise<TCustomEntity | undefined> {
        const permissions = await this.checkPermissions(entityType, 'read', ctx);
        return getByIdWithFilters('CustomEntity', ctx, permissions, id,
            (...args) => this.repository.getCustomEntityById(...args));
    }

    @Query(() => CustomEntity)
    async [getOneBySlugPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("entityType") entityType: string,
        @Arg("slug") slug: string
    ): Promise<TCustomEntity | undefined> {
        const permissions = await this.checkPermissions(entityType, 'read', ctx);
        return getBySlugWithFilters('CustomEntity', ctx, permissions, slug,
            (...args) => this.repository.getCustomEntityBySlug(...args));
    }

    @Query(() => PagedCustomEntity)
    async [getManyPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TCustomEntity>,
        @Arg("filterParams", { nullable: true }) filterParams?: CustomEntityFilterInput,
    ): Promise<TPagedList<TCustomEntity> | undefined> {
        const permissions = await this.checkPermissions(filterParams?.entityType, 'read', ctx);
        return getManyWithFilters('CustomEntity', ctx, permissions, pagedParams, filterParams,
            (...args) => this.repository.getFilteredCustomEntities(...args));
    }

    @Mutation(() => CustomEntity)
    async [createPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("data") data: CustomEntityInput
    ): Promise<TCustomEntity> {
        const permissions = await this.checkPermissions(data?.entityType, 'create', ctx);
        return createWithFilters('CustomEntity', ctx, permissions, data,
            (...args) => this.repository.createCustomEntity(...args));
    }

    @Mutation(() => CustomEntity)
    async [updatePath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("id", () => Int) id: number,
        @Arg("data") data: CustomEntityInput
    ): Promise<TCustomEntity | undefined> {
        const permissions = await this.checkPermissions(data?.entityType, 'update', ctx);
        return updateWithFilters('CustomEntity', ctx, permissions, data, id,
            (...args) => this.repository.updateCustomEntity(...args));
    }


    @Mutation(() => Boolean)
    async [deletePath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("entityType") entityType: string,
        @Arg("id", () => Int) id: number
    ): Promise<boolean> {
        const permissions = await this.checkPermissions(entityType, 'delete', ctx);
        return deleteWithFilters('CustomEntity', ctx, permissions, id,
            (...args) => this.repository.deleteCustomEntity(...args));
    }

    @Mutation(() => Boolean)
    async [deleteManyPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("input") input: DeleteManyInput,
        @Arg("filterParams", { nullable: true }) filterParams?: CustomEntityFilterInput,
    ): Promise<boolean | undefined> {
        const permissions = await this.checkPermissions(filterParams?.entityType, 'delete', ctx);
        return deleteManyWithFilters('CustomEntity', ctx, permissions, input, filterParams,
            (...args) => this.repository.deleteManyFilteredCustomEntities(...args));
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