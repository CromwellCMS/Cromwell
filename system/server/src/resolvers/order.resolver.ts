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

import { mainFireAction } from '../helpers/mainFireAction';

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
        const order = await this.repository.createOrder(data);
        mainFireAction('create_order', order);
        return order;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Order)
    async [updatePath](@Arg("id") id: string, @Arg("data") data: InputOrder): Promise<Order | undefined> {
        const order = await this.repository.updateOrder(id, data);
        mainFireAction('create_order', order);
        return order;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Boolean)
    async [deletePath](@Arg("id") id: string): Promise<boolean> {
        const order = await this.repository.deleteOrder(id);
        mainFireAction('delete_order', { id });
        return order;
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
