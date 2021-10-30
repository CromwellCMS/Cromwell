import { EDBEntity, GraphQLPaths, TAuthRole, TPagedList, TUser } from '@cromwell/core';
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

    @Authorized<TAuthRole>("administrator", "author", "guest")
    @Query(() => User)
    async [getOneByEmailPath](@Arg("email") email: string): Promise<User | undefined> {
        return this.repository.getUserByEmail(email);
    }

    @Authorized<TAuthRole>("administrator", "author", "guest")
    @Query(() => PagedUser)
    async [getManyPath](@Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<User>):
        Promise<TPagedList<TUser>> {
        return this.repository.getUsers(pagedParams);
    }

    @Authorized<TAuthRole>("administrator", "author", "guest", "self")
    @Query(() => User)
    async [getOneByIdPath](@Arg("id", () => Int) id: number): Promise<User | undefined> {
        return this.repository.getUserById(id);
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => User)
    async [createPath](@Arg("data") data: CreateUser): Promise<TUser> {
        const user = await this.repository.createUser(data);
        serverFireAction('create_user', user);
        return user;
    }

    @Authorized<TAuthRole>("administrator", "self")
    @Mutation(() => User)
    async [updatePath](@Arg("id", () => Int) id: number, @Arg("data") data: UpdateUser, @Ctx() ctx: TGraphQLContext): Promise<User> {
        const message = "Access denied! You don't have permission for this action!";
        if (!ctx?.user?.role) throw new Error(message);
        if (data.role && data.role !== ctx.user.role && ctx.user.role !== 'administrator') throw new Error(message);
        if (ctx.user.role === 'guest') throw new Error(message);

        const user = await this.repository.updateUser(id, data);
        serverFireAction('update_user', user);
        resetAllPagesCache();
        return user;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Boolean)
    async [deletePath](@Arg("id", () => Int) id: number): Promise<boolean> {
        const user = await this.repository.deleteUser(id);
        serverFireAction('delete_user', { id });
        resetAllPagesCache();
        return user;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Boolean)
    async [deleteManyFilteredPath](
        @Arg("input") input: DeleteManyInput,
        @Arg("filterParams", { nullable: true }) filterParams?: UserFilterInput,
    ): Promise<boolean | undefined> {
        const res = await this.repository.deleteManyFilteredUsers(input, filterParams);
        resetAllPagesCache();
        return res;
    }

    @Authorized<TAuthRole>("administrator", 'author', "guest")
    @Query(() => PagedUser)
    async [getFilteredPath](
        @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TUser>,
        @Arg("filterParams", { nullable: true }) filterParams?: UserFilterInput,
    ): Promise<TPagedList<TUser> | undefined> {
        return this.repository.getFilteredUsers(pagedParams, filterParams);
    }

    @FieldResolver(() => GraphQLJSONObject, { nullable: true })
    async customMeta(@Root() entity: User, @Arg("fields", () => [String]) fields: string[]): Promise<any> {
        return entityMetaRepository.getEntityMetaValuesByKeys(EDBEntity.User, entity.id, fields);
    }
}