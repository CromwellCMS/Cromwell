import { EDBEntity, GraphQLPaths, TAuthRole, TOrder, TPagedList } from '@cromwell/core';
import {
    DeleteManyInput,
    entityMetaRepository,
    Order,
    OrderFilterInput,
    OrderInput,
    OrderRepository,
    PagedOrder,
    Coupon,
    PagedParamsInput,
    TGraphQLContext,
} from '@cromwell/core-backend';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Arg, Authorized, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root } from 'type-graphql';
import { getCustomRepository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

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
const couponsKey: keyof TOrder = 'coupons';

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
        @Arg("userId", () => Int) userId: number,
        @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TOrder>
    ): Promise<TPagedList<TOrder> | undefined> {
        if (!ctx?.user?.role) throw new HttpException('Access denied.', HttpStatus.UNAUTHORIZED);

        if (!(ctx.user.role === 'guest' || ctx.user.role === 'administrator' ||
            ctx.user.id + '' === userId + '')) {
            throw new HttpException('Access denied.', HttpStatus.FORBIDDEN);
        }
        const orders = await this.repository.getOrdersOfUser(userId, pagedParams);
        return orders;
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
        @Arg("id", () => Int) id: number
    ): Promise<Order | undefined> {
        if (!ctx?.user?.role) throw new HttpException('Access denied.', HttpStatus.UNAUTHORIZED);

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
    async [updatePath](@Arg("id", () => Int) id: number, @Arg("data") data: OrderInput): Promise<Order | undefined> {
        const order = await this.repository.updateOrder(id, data);
        serverFireAction('create_order', order);
        return order;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Boolean)
    async [deletePath](@Arg("id", () => Int) id: number): Promise<boolean> {
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
    async customMeta(@Root() entity: Order, @Arg("keys", () => [String]) fields: string[]): Promise<any> {
        return entityMetaRepository.getEntityMetaByKeys(EDBEntity.Order, entity.id, fields);
    }

    @FieldResolver(() => [Coupon], { nullable: true })
    async [couponsKey](@Root() post: Order): Promise<Coupon[] | undefined | null> {
        return this.repository.getCouponsOfOrder(post.id);
    }
}