import { GraphQLPaths, TAuthRole, TOrder, TPagedList } from '@cromwell/core';
import {
    DeleteManyInput,
    InputOrder,
    Order,
    OrderFilterInput,
    OrderRepository,
    PagedOrder,
    PagedParamsInput,
} from '@cromwell/core-backend';
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

const getOneBySlugPath = GraphQLPaths.Order.getOneBySlug;
const getOneByIdPath = GraphQLPaths.Order.getOneById;
const getManyPath = GraphQLPaths.Order.getMany;
const createPath = GraphQLPaths.Order.create;
const updatePath = GraphQLPaths.Order.update;
const deletePath = GraphQLPaths.Order.delete;
const deleteManyPath = GraphQLPaths.Order.deleteMany;
const deleteManyFilteredPath = GraphQLPaths.Order.deleteManyFiltered;
const getFilteredPath = GraphQLPaths.Order.getFiltered;

@Resolver(Order)
export class OrderResolver {

    private repository = getCustomRepository(OrderRepository);

    @Authorized<TAuthRole>("administrator", "guest")
    @Query(() => PagedOrder)
    async [getManyPath](@Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TOrder>):
        Promise<TPagedList<TOrder>> {
        return this.repository.getOrders(pagedParams);
    }

    @Authorized<TAuthRole>("administrator", "guest")
    @Query(() => Order)
    async [getOneBySlugPath](@Arg("slug") slug: string): Promise<TOrder | undefined> {
        return this.repository.getOrderBySlug(slug);
    }

    @Authorized<TAuthRole>("administrator", "guest")
    @Query(() => Order)
    async [getOneByIdPath](@Arg("id") id: string): Promise<Order | undefined> {
        return this.repository.getOrderById(id);
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Order)
    async [createPath](@Arg("data") data: InputOrder): Promise<Order> {
        return this.repository.createOrder(data);
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Order)
    async [updatePath](@Arg("id") id: string, @Arg("data") data: InputOrder): Promise<Order | undefined> {
        return this.repository.updateOrder(id, data);
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Boolean)
    async [deletePath](@Arg("id") id: string): Promise<boolean> {
        return this.repository.deleteOrder(id);
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Boolean)
    async [deleteManyPath](@Arg("data") data: DeleteManyInput): Promise<boolean | undefined> {
        return this.repository.deleteMany(data);
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Boolean)
    async [deleteManyFilteredPath](
        @Arg("input") input: DeleteManyInput,
        @Arg("filterParams", { nullable: true }) filterParams?: OrderFilterInput,
    ): Promise<boolean | undefined> {
        return this.repository.deleteManyFilteredOrders(input, filterParams);
    }

    @Authorized<TAuthRole>("administrator", "guest")
    @Query(() => PagedOrder)
    async [getFilteredPath](
        @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TOrder>,
        @Arg("filterParams", { nullable: true }) filterParams?: OrderFilterInput,
    ): Promise<TPagedList<TOrder> | undefined> {
        return this.repository.getFilteredOrders(pagedParams, filterParams);
    }
}
