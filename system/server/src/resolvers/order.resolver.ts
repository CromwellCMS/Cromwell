import { GraphQLPaths, TOrder, TPagedList, TProduct, TStoreListItem } from '@cromwell/core';
import {
    getLogger,
    InputOrder,
    Order,
    OrderRepository,
    PagedOrder,
    PagedParamsInput,
    Product,
    ProductRepository,
    DeleteManyInput,
} from '@cromwell/core-backend';
import { Arg, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

const getOneBySlugPath = GraphQLPaths.Order.getOneBySlug;
const getOneByIdPath = GraphQLPaths.Order.getOneById;
const getManyPath = GraphQLPaths.Order.getMany;
const createPath = GraphQLPaths.Order.create;
const updatePath = GraphQLPaths.Order.update;
const deletePath = GraphQLPaths.Order.delete;
const deleteManyPath = GraphQLPaths.Order.deleteMany;

const logger = getLogger('detailed');

@Resolver(Order)
export class OrderResolver {

    private repository = getCustomRepository(OrderRepository);
    private productRepository = getCustomRepository(ProductRepository);

    @Query(() => PagedOrder)
    async [getManyPath](@Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TOrder>):
        Promise<TPagedList<TOrder>> {
        return this.repository.getOrders(pagedParams);
    }

    @Query(() => Order)
    async [getOneBySlugPath](@Arg("slug") slug: string): Promise<TOrder | undefined> {
        return this.repository.getOrderBySlug(slug);
    }

    @Query(() => Order)
    async [getOneByIdPath](@Arg("id") id: string): Promise<Order | undefined> {
        return this.repository.getOrderById(id);
    }

    @Mutation(() => Order)
    async [createPath](@Arg("data") data: InputOrder): Promise<Order> {
        return this.repository.createOrder(data);
    }

    @Mutation(() => Order)
    async [updatePath](@Arg("id") id: string, @Arg("data") data: InputOrder): Promise<Order | undefined> {
        return this.repository.updateOrder(id, data);
    }

    @Mutation(() => Boolean)
    async [deletePath](@Arg("id") id: string): Promise<boolean> {
        return this.repository.deleteOrder(id);
    }

    @Mutation(() => Boolean)
    async [deleteManyPath](@Arg("data") data: DeleteManyInput): Promise<boolean | undefined> {
        return this.repository.deleteMany(data, 'id');
    }

}