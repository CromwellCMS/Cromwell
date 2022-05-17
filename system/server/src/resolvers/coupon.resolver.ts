import { EDBEntity, GraphQLPaths, TCoupon, TPagedList, TPermissionName } from '@cromwell/core';
import {
    BaseFilterInput,
    Coupon,
    CouponInput,
    CouponRepository,
    DeleteManyInput,
    entityMetaRepository,
    PagedCoupon,
    PagedParamsInput,
    TGraphQLContext,
} from '@cromwell/core-backend';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Arg, Authorized, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

import {
    createWithFilters,
    deleteManyWithFilters,
    deleteWithFilters,
    getByIdWithFilters,
    getManyWithFilters,
    updateWithFilters,
} from '../helpers/data-filters';

const getOneByIdPath = GraphQLPaths.Coupon.getOneById;
const getManyPath = GraphQLPaths.Coupon.getMany;
const createPath = GraphQLPaths.Coupon.create;
const updatePath = GraphQLPaths.Coupon.update;
const deletePath = GraphQLPaths.Coupon.delete;
const deleteManyPath = GraphQLPaths.Coupon.deleteMany;
const getCouponsByCodesPath = GraphQLPaths.Coupon.getCouponsByCodes;


@Resolver(Coupon)
export class CouponResolver {

    private repository = getCustomRepository(CouponRepository);

    @Authorized<TPermissionName>('read_coupons')
    @Query(() => Coupon)
    async [getOneByIdPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("id", () => Int) id: number,
    ): Promise<TCoupon | undefined> {
        return getByIdWithFilters('Coupon', ctx, ['read_coupons'], id,
            (...args) => this.repository.getCouponById(...args));
    }

    @Authorized<TPermissionName>('read_coupons')
    @Query(() => PagedCoupon)
    async [getManyPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TCoupon>,
        @Arg("filterParams", () => BaseFilterInput, { nullable: true }) filterParams?: BaseFilterInput,
    ): Promise<TPagedList<TCoupon> | undefined> {
        return getManyWithFilters('Coupon', ctx, ['read_coupons'], pagedParams, filterParams,
            (...args) => this.repository.getFilteredCoupons(...args));
    }

    @Authorized<TPermissionName>('create_coupon')
    @Mutation(() => Coupon)
    async [createPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("data") data: CouponInput
    ): Promise<TCoupon> {
        return createWithFilters('Coupon', ctx, ['create_coupon'], data,
            (...args) => this.repository.createCoupon(...args));
    }

    @Authorized<TPermissionName>('update_coupon')
    @Mutation(() => Coupon)
    async [updatePath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("id", () => Int) id: number,
        @Arg("data") data: CouponInput
    ): Promise<TCoupon | undefined> {
        return updateWithFilters('Coupon', ctx, ['update_coupon'], data, id,
            (...args) => this.repository.updateCoupon(...args));
    }

    @Authorized<TPermissionName>('delete_coupon')
    @Mutation(() => Boolean)
    async [deletePath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("id", () => Int) id: number
    ): Promise<boolean> {
        return deleteWithFilters('Coupon', ctx, ['delete_coupon'], id,
            (...args) => this.repository.deleteCoupon(...args));
    }

    @Authorized<TPermissionName>('delete_coupon')
    @Mutation(() => Boolean)
    async [deleteManyPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("input") input: DeleteManyInput,
        @Arg("filterParams", () => BaseFilterInput, { nullable: true }) filterParams?: BaseFilterInput,
    ): Promise<boolean | undefined> {
        return deleteManyWithFilters('Coupon', ctx, ['delete_coupon'], input, filterParams,
            (...args) => this.repository.deleteManyFilteredCoupons(...args));
    }

    @FieldResolver(() => GraphQLJSONObject, { nullable: true })
    async customMeta(@Root() entity: Coupon, @Arg("keys", () => [String]) fields: string[]): Promise<any> {
        return entityMetaRepository.getEntityMetaByKeys(EDBEntity.Coupon, entity.id, fields);
    }

    @Authorized<TPermissionName>('read_coupons')
    @Query(() => [Coupon])
    async [getCouponsByCodesPath](@Arg("codes", () => [String]) codes: string[]):
        Promise<TCoupon[] | undefined> {
        return this.repository.getCouponsByCodes(codes);
    }
}