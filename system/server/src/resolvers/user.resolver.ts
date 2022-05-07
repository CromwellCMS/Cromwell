import { EDBEntity, GraphQLPaths, matchPermissions, TPagedList, TPermissionName, TUser } from '@cromwell/core';
import {
    CreateUser,
    DeleteManyInput,
    entityMetaRepository,
    PagedParamsInput,
    PagedUser,
    TGraphQLContext,
    UpdateUser,
    User,
    UserFilterInput,
    UserRepository,
} from '@cromwell/core-backend';
import { HttpException, HttpStatus } from '@nestjs/common';
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

const getOneByIdPath = GraphQLPaths.User.getOneById;
const getOneBySlugPath = GraphQLPaths.User.getOneBySlug;
const getOneByEmailPath = GraphQLPaths.User.getOneByEmail;
const getManyPath = GraphQLPaths.User.getMany;
const createPath = GraphQLPaths.User.create;
const updatePath = GraphQLPaths.User.update;
const deletePath = GraphQLPaths.User.delete;
const deleteManyPath = GraphQLPaths.User.deleteMany;

@Resolver(User)
export class UserResolver {

    private repository = getCustomRepository(UserRepository);

    @Authorized<TPermissionName>('read_users', 'read_my_user')
    @Query(() => User)
    async [getOneByIdPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("id", () => Int) id: number,
    ): Promise<TUser> {
        return getByIdWithFilters('User', ctx, ['read_users', 'read_my_user'], id,
            async (id) => {
                // If no 'read_user', check that has 'read_my_user' and the same id
                if (!matchPermissions(ctx.user, ['read_users'])) {
                    if (!ctx?.user?.id + '' === id + '')
                        throw new HttpException('Access denied.', HttpStatus.FORBIDDEN);
                }
                return this.repository.getUserById(id);
            });
    }

    @Authorized<TPermissionName>('read_users')
    @Query(() => User)
    async [getOneBySlugPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("slug") slug: string
    ): Promise<TUser> {
        return getBySlugWithFilters('User', ctx, ['read_users'], slug,
            (...args) => this.repository.getUserBySlug(...args));
    }

    @Authorized<TPermissionName>('read_users')
    @Query(() => User)
    async [getOneByEmailPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("email") email: string
    ): Promise<User | undefined> {
        return this.repository.getUserByEmail(email);
    }

    @Authorized<TPermissionName>('read_users')
    @Query(() => PagedUser)
    async [getManyPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TUser>,
        @Arg("filterParams", { nullable: true }) filterParams?: UserFilterInput,
    ): Promise<TPagedList<TUser> | undefined> {
        return getManyWithFilters('User', ctx, ['read_users'], pagedParams, filterParams,
            (...args) => this.repository.getFilteredUsers(...args));
    }

    @Authorized<TPermissionName>('create_user')
    @Mutation(() => User)
    async [createPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("data") data: CreateUser
    ): Promise<TUser> {
        return createWithFilters('User', ctx, ['create_user'], data,
            (...args) => this.repository.createUser(...args));
    }

    @Authorized<TPermissionName>('update_user', 'update_my_user')
    @Mutation(() => User)
    async [updatePath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("id", () => Int) id: number,
        @Arg("data") data: UpdateUser,
    ): Promise<TUser> {
        return updateWithFilters('User', ctx, ['update_user', 'update_my_user'], data, id,
            async (id, data) => {
                const oldUser = await this.repository.getUserById(id);

                // 'update_my_user' cannot change roles
                if (data?.roles?.length && (data?.roles?.length !== oldUser?.roles?.length ||
                    !data?.roles.every(roleName => oldUser?.roles?.find(r => r.name === roleName)))) {
                    if (!matchPermissions(ctx.user, ['update_user'])) {
                        throw new HttpException("Access denied! You don't have permission for this action!", HttpStatus.FORBIDDEN);
                    }
                }

                return this.repository.updateUser(id, data);
            });
    }

    @Authorized<TPermissionName>('delete_user')
    @Mutation(() => Boolean)
    async [deletePath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("id", () => Int) id: number
    ): Promise<boolean> {
        return deleteWithFilters('User', ctx, ['delete_user'], id,
            (...args) => this.repository.deleteUser(...args));
    }

    @Authorized<TPermissionName>('delete_user')
    @Mutation(() => Boolean)
    async [deleteManyPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("input") input: DeleteManyInput,
        @Arg("filterParams", { nullable: true }) filterParams?: UserFilterInput,
    ): Promise<boolean | undefined> {
        return deleteManyWithFilters('User', ctx, ['delete_user'], input, filterParams,
            (...args) => this.repository.deleteManyFilteredUsers(...args));
    }

    @FieldResolver(() => GraphQLJSONObject, { nullable: true })
    async customMeta(@Root() entity: User, @Arg("keys", () => [String]) fields: string[]): Promise<any> {
        return entityMetaRepository.getEntityMetaByKeys(EDBEntity.User, entity.id, fields);
    }
}