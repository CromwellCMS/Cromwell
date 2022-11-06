import { EDBEntity, GraphQLPaths, matchPermissions, TOrder, TPagedList, TPermissionName } from '@cromwell/core';
import {
  Coupon,
  DeleteManyInput,
  entityMetaRepository,
  Order,
  OrderFilterInput,
  OrderInput,
  OrderRepository,
  PagedOrder,
  PagedParamsInput,
  TGraphQLContext,
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

const getOneBySlugPath = GraphQLPaths.Order.getOneBySlug;
const getOneByIdPath = GraphQLPaths.Order.getOneById;
const getManyPath = GraphQLPaths.Order.getMany;
const createPath = GraphQLPaths.Order.create;
const updatePath = GraphQLPaths.Order.update;
const deletePath = GraphQLPaths.Order.delete;
const deleteManyPath = GraphQLPaths.Order.deleteMany;
const getOrdersOfUser = GraphQLPaths.Order.getOrdersOfUser;
const couponsKey: keyof TOrder = 'coupons';

@Resolver(Order)
export class OrderResolver {
  private repository = getCustomRepository(OrderRepository);

  private checkUserAccess(@Ctx() ctx: TGraphQLContext, userId?: number | null) {
    if (!ctx?.user?.id || !ctx?.user?.roles?.length) throw new HttpException('Access denied.', HttpStatus.UNAUTHORIZED);
    let hasAccess = false;

    if (matchPermissions(ctx?.user, ['read_orders'])) {
      hasAccess = true;
    } else if (matchPermissions(ctx?.user, ['read_my_orders'])) {
      if (ctx.user.id + '' === userId + '') {
        hasAccess = true;
      }
    }
    if (!hasAccess) throw new HttpException('Access denied.', HttpStatus.FORBIDDEN);
  }

  @Authorized<TPermissionName>('read_orders', 'read_my_orders')
  @Query(() => Order)
  async [getOneByIdPath](@Ctx() ctx: TGraphQLContext, @Arg('id', () => Int) id: number): Promise<TOrder> {
    if (!ctx?.user?.roles?.length) throw new HttpException('Access denied.', HttpStatus.UNAUTHORIZED);
    const order = await getByIdWithFilters(
      'Order',
      ctx,
      ['read_orders', 'read_my_orders'],
      ['read_orders'],
      id,
      (...args) => this.repository.getOrderById(...args),
    );

    this.checkUserAccess(ctx, order?.userId);
    return order;
  }

  @Authorized<TPermissionName>('read_orders')
  @Query(() => Order)
  async [getOneBySlugPath](@Ctx() ctx: TGraphQLContext, @Arg('slug') slug: string): Promise<TOrder | undefined> {
    return getBySlugWithFilters('Order', ctx, ['read_orders'], ['read_orders'], slug, (...args) =>
      this.repository.getOrderBySlug(...args),
    );
  }

  @Authorized<TPermissionName>('read_orders')
  @Query(() => PagedOrder)
  async [getManyPath](
    @Ctx() ctx: TGraphQLContext,
    @Arg('pagedParams', { nullable: true }) pagedParams?: PagedParamsInput<TOrder>,
    @Arg('filterParams', { nullable: true }) filterParams?: OrderFilterInput,
  ): Promise<TPagedList<TOrder> | undefined> {
    return getManyWithFilters('Order', ctx, ['read_orders'], ['read_orders'], pagedParams, filterParams, (...args) =>
      this.repository.getFilteredOrders(...args),
    );
  }

  @Authorized<TPermissionName>('read_orders', 'read_my_orders')
  @Query(() => PagedOrder)
  async [getOrdersOfUser](
    @Ctx() ctx: TGraphQLContext,
    @Arg('userId', () => Int) userId: number,
    @Arg('pagedParams', { nullable: true }) pagedParams?: PagedParamsInput<TOrder>,
  ): Promise<TPagedList<TOrder> | undefined> {
    this.checkUserAccess(ctx, userId);
    return getManyWithFilters(
      'Order',
      ctx,
      ['read_orders', 'read_my_orders'],
      ['read_orders'],
      pagedParams,
      { userId },
      (...args) => this.repository.getFilteredOrders(...args),
    );
  }

  @Authorized<TPermissionName>('update_order')
  @Mutation(() => Order)
  async [createPath](@Ctx() ctx: TGraphQLContext, @Arg('data') data: OrderInput): Promise<TOrder> {
    return createWithFilters('Order', ctx, ['update_order'], data, (...args) => this.repository.createOrder(...args));
  }

  @Authorized<TPermissionName>('create_order')
  @Mutation(() => Order)
  async [updatePath](
    @Ctx() ctx: TGraphQLContext,
    @Arg('id', () => Int) id: number,
    @Arg('data') data: OrderInput,
  ): Promise<TOrder> {
    return updateWithFilters('Order', ctx, ['create_order'], data, id, (...args) =>
      this.repository.updateOrder(...args),
    );
  }

  @Authorized<TPermissionName>('delete_order')
  @Mutation(() => Boolean)
  async [deletePath](@Ctx() ctx: TGraphQLContext, @Arg('id', () => Int) id: number): Promise<boolean> {
    return deleteWithFilters('Order', ctx, ['delete_order'], id, (...args) => this.repository.deleteOrder(...args));
  }

  @Authorized<TPermissionName>('delete_order')
  @Mutation(() => Boolean)
  async [deleteManyPath](
    @Ctx() ctx: TGraphQLContext,
    @Arg('input') input: DeleteManyInput,
    @Arg('filterParams', { nullable: true }) filterParams?: OrderFilterInput,
  ): Promise<boolean | undefined> {
    return deleteManyWithFilters('Order', ctx, ['delete_order'], input, filterParams, (...args) =>
      this.repository.deleteManyFilteredOrders(...args),
    );
  }

  @FieldResolver(() => GraphQLJSONObject, { nullable: true })
  async customMeta(@Root() entity: Order, @Arg('keys', () => [String]) fields: string[]): Promise<any> {
    return entityMetaRepository.getEntityMetaByKeys(EDBEntity.Order, entity.id, fields);
  }

  @FieldResolver(() => [Coupon], { nullable: true })
  async [couponsKey](@Root() post: Order): Promise<Coupon[] | undefined | null> {
    return this.repository.getCouponsOfOrder(post.id);
  }
}
