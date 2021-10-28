import { GraphQLPaths, TAuthRole, TOrder, TPagedList } from '@cromwell/core';
import {
    DeleteManyInput,
    EntityMetaRepository,
    Order,
    OrderFilterInput,
    OrderInput,
    OrderRepository,
    PagedOrder,
    PagedParamsInput,
    TGraphQLContext,
} from '@cromwell/core-backend';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

import { serverFireAction } from '../helpers/server-fire-action';

const getOneBySlugPath = GraphQLPaths.Order.getOneBySlug;
const getOneByIdPath = GraphQLPaths.Order.getOneById;
const getManyPath = GraphQLPaths.Order.getMany;
const createPath = GraphQLPaths.Order.create;
const updatePath = GraphQLPaths.Order.update;
const deletePath = GraphQLPaths.Order.delete;
const deleteManyPath = GraphQLPaths.Order.deleteMany;
const deleteManyFilteredPath = GraphQLPaths.Order.deleteManyFiltered;
const getFilteredPath = GraphQLPaths.Order.getFiltered;
const getOrdersOfUser = GraphQLPaths.Order.getOrdersOfUser;

@Resolver(Order)
export class OrderResolver {

    private repository = getCustomRepository(OrderRepository);

    @Authorized<TAuthRole>("administrator", "guest")
    @Query(() => PagedOrder)
    async [getManyPath](
        @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TOrder>
    ): Promise<TPagedList<TOrder>> {
        return this.repository.getOrders(pagedParams);
    }

    @Authorized<TAuthRole>("all")
    @Query(() => PagedOrder)
    async [getOrdersOfUser](
        @Ctx() ctx: TGraphQLContext,
        @Arg("userId") userId: string,
        @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TOrder>
    ): Promise<TPagedList<TOrder> | undefined> {
        if (!ctx?.user?.role) throw new Error('Access denied.');

        if (ctx.user.role === 'guest' || ctx.user.role === 'administrator' ||
            ctx.user.id + '' === userId + '') {
            const orders = await this.repository.getOrdersOfUser(userId, pagedParams);
            return orders;
        }
        throw new Error('Access denied.');
    }

    @Authorized<TAuthRole>("administrator", "guest")
    @Query(() => Order)
    async [getOneBySlugPath](@Arg("slug") slug: string): Promise<TOrder | undefined> {
        return this.repository.getOrderBySlug(slug);
    }

    @Authorized<TAuthRole>("all")
    @Query(() => Order)
    async [getOneByIdPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("id") id: string
    ): Promise<Order | undefined> {
        if (!ctx?.user?.role) throw new Error('Access denied.');

        const order = await this.repository.getOrderById(id);
        if (ctx.user.role === 'guest' || ctx.user.role === 'administrator' ||
            (order?.userId && ctx.user.id + '' === order.userId + ''))
            return order;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Order)
    async [createPath](@Arg("data") data: OrderInput): Promise<Order> {
        const order = await this.repository.createOrder(data);
        serverFireAction('create_order', order);
        return order;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Order)
    async [updatePath](@Arg("id") id: string, @Arg("data") data: OrderInput): Promise<Order | undefined> {
        const order = await this.repository.updateOrder(id, data);
        serverFireAction('create_order', order);
        return order;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Boolean)
    async [deletePath](@Arg("id") id: string): Promise<boolean> {
        const order = await this.repository.deleteOrder(id);
        serverFireAction('delete_order', { id });
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

    @FieldResolver(() => GraphQLJSONObject, { nullable: true })
    async customMeta(@Root() entity: Order, @Arg("fields", () => [String]) fields: string[]): Promise<any> {
        return getCustomRepository(EntityMetaRepository).getEntityMetaValuesByKeys(entity.metaId, fields);
    }
}
