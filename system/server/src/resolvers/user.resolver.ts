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

import { resetAllPagesCache } from '../helpers/reset-page';
import { serverFireAction } from '../helpers/server-fire-action';

const getOneByIdPath = GraphQLPaths.User.getOneById;
const getOneByEmailPath = GraphQLPaths.User.getOneByEmail;
const getManyPath = GraphQLPaths.User.getMany;
const createPath = GraphQLPaths.User.create;
const updatePath = GraphQLPaths.User.update;
const deletePath = GraphQLPaths.User.delete;
const getFilteredPath = GraphQLPaths.User.getFiltered;
const deleteManyFilteredPath = GraphQLPaths.User.deleteManyFiltered;

@Resolver(User)
export class UserResolver {

    private repository = getCustomRepository(UserRepository);

    @Authorized<TPermissionName>('read_users')
    @Query(() => User)
    async [getOneByEmailPath](@Arg("email") email: string): Promise<User | undefined> {
        return this.repository.getUserByEmail(email);
    }

    @Authorized<TPermissionName>('read_users')
    @Query(() => PagedUser)
    async [getManyPath](@Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<User>):
        Promise<TPagedList<TUser>> {
        return this.repository.getUsers(pagedParams);
    }

    @Authorized<TPermissionName>('read_users', 'read_my_user')
    @Query(() => User)
    async [getOneByIdPath](@Arg("id", () => Int) id: number,
        @Ctx() ctx: TGraphQLContext
    ): Promise<User | undefined> {
        // If no 'read_user', check that has 'read_my_user' and the same id
        if (!matchPermissions(ctx.user, ['read_users'])) {
            if (!ctx?.user?.id + '' === id + '')
                throw new HttpException('Access denied.', HttpStatus.FORBIDDEN);
        }
        return this.repository.getUserById(id);
    }

    @Authorized<TPermissionName>('create_user')
    @Mutation(() => User)
    async [createPath](@Arg("data") data: CreateUser): Promise<TUser> {
        const user = await this.repository.createUser(data);
        serverFireAction('create_user', user);
        return user;
    }

    @Authorized<TPermissionName>('update_user', 'update_my_user')
    @Mutation(() => User)
    async [updatePath](
        @Arg("id", () => Int) id: number,
        @Arg("data") data: UpdateUser,
        @Ctx() ctx: TGraphQLContext,
    ): Promise<User> {
        const oldUser = await this.repository.getUserById(id);

        // 'update_my_user' cannot change roles
        if (data?.roles?.length && (data?.roles?.length !== oldUser?.roles?.length ||
            !data?.roles.every(roleName => oldUser?.roles?.find(r => r.name === roleName)))) {
            if (!matchPermissions(ctx.user, ['update_user'])) {
                throw new HttpException("Access denied! You don't have permission for this action!", HttpStatus.FORBIDDEN);
            }
        }

        const user = await this.repository.updateUser(id, data);
        serverFireAction('update_user', user);
        resetAllPagesCache();
        return user;
    }

    @Authorized<TPermissionName>('delete_user')
    @Mutation(() => Boolean)
    async [deletePath](@Arg("id", () => Int) id: number): Promise<boolean> {
        const user = await this.repository.deleteUser(id);
        serverFireAction('delete_user', { id });
        resetAllPagesCache();
        return user;
    }

    @Authorized<TPermissionName>('delete_user')
    @Mutation(() => Boolean)
    async [deleteManyFilteredPath](
        @Arg("input") input: DeleteManyInput,
        @Arg("filterParams", { nullable: true }) filterParams?: UserFilterInput,
    ): Promise<boolean | undefined> {
        const res = await this.repository.deleteManyFilteredUsers(input, filterParams);
        resetAllPagesCache();
        return res;
    }

    @Authorized<TPermissionName>('read_users')
    @Query(() => PagedUser)
    async [getFilteredPath](
        @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TUser>,
        @Arg("filterParams", { nullable: true }) filterParams?: UserFilterInput,
    ): Promise<TPagedList<TUser> | undefined> {
        return this.repository.getFilteredUsers(pagedParams, filterParams);
    }

    @FieldResolver(() => GraphQLJSONObject, { nullable: true })
    async customMeta(@Root() entity: User, @Arg("keys", () => [String]) fields: string[]): Promise<any> {
        return entityMetaRepository.getEntityMetaByKeys(EDBEntity.User, entity.id, fields);
    }
}