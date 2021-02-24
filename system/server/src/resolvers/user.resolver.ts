import { TUser, GraphQLPaths, TPagedList } from '@cromwell/core';
import { User, CreateUser, UpdateUser, UserRepository, PagedUser, PagedParamsInput } from '@cromwell/core-backend';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

const getOneByIdPath = GraphQLPaths.User.getOneById;
const getManyPath = GraphQLPaths.User.getMany;
const createPath = GraphQLPaths.User.create;
const updatePath = GraphQLPaths.User.update;
const deletePath = GraphQLPaths.User.delete;

@Resolver(User)
export class UserResolver {

    private repository = getCustomRepository(UserRepository)

    @Query(() => PagedUser)
    async [getManyPath](@Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<User>):
        Promise<TPagedList<TUser>> {
        return this.repository.getUsers(pagedParams);
    }

    @Query(() => User)
    async [getOneByIdPath](@Arg("id") id: string): Promise<User | undefined> {
        return this.repository.getUserById(id);
    }

    @Mutation(() => User)
    async [createPath](@Arg("data") data: CreateUser): Promise<TUser> {
        return await this.repository.createUser(data);
    }

    @Mutation(() => User)
    async [updatePath](@Arg("id") id: string, @Arg("data") data: UpdateUser): Promise<User> {
        return await this.repository.updateUser(id, data);
    }

    @Mutation(() => Boolean)
    async [deletePath](@Arg("id") id: string): Promise<boolean> {
        return await this.repository.deleteUser(id);
    }

}