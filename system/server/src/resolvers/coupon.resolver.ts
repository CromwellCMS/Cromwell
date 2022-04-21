import { EDBEntity, GraphQLPaths, TPermissionName, TCoupon, TPagedList } from '@cromwell/core';
import {
    BaseFilterInput,
    Coupon,
    CouponInput,
    CouponRepository,
    DeleteManyInput,
    entityMetaRepository,
    PagedCoupon,
    PagedParamsInput,
} from '@cromwell/core-backend';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Arg, Authorized, FieldResolver, Int, Mutation, Query, Resolver, Root } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

import { resetAllPagesCache } from '../helpers/reset-page';
import { serverFireAction } from '../helpers/server-fire-action';

const getOneByIdPath = GraphQLPaths.Coupon.getOneById;
const getManyPath = GraphQLPaths.Coupon.getMany;
const getFilteredPath = GraphQLPaths.Coupon.getFiltered;
const createPath = GraphQLPaths.Coupon.create;
const updatePath = GraphQLPaths.Coupon.update;
const deletePath = GraphQLPaths.Coupon.delete;
const deleteManyPath = GraphQLPaths.Coupon.deleteMany;
const deleteManyFilteredPath = GraphQLPaths.Coupon.deleteManyFiltered;
const getCouponsByCodesPath = GraphQLPaths.Coupon.getCouponsByCodes;

@Resolver(Coupon)
export class CouponResolver {

    private repository = getCustomRepository(CouponRepository);

    @Authorized<TPermissionName>('read_coupons')
    @Query(() => PagedCoupon)
    async [getManyPath](@Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TCoupon>):
        Promise<TPagedList<TCoupon>> {
        return this.repository.getCoupons(pagedParams);
    }

    @Authorized<TPermissionName>('read_coupons')
    @Query(() => Coupon)
    async [getOneByIdPath](@Arg("id", () => Int) id: number): Promise<TCoupon | undefined> {
        entityMetaRepository.getAllEntityMetaKeys(EDBEntity.CustomEntity);
        return this.repository.getCouponById(id);
    }

    @Authorized<TPermissionName>('create_coupon')
    @Mutation(() => Coupon)
    async [createPath](@Arg("data") data: CouponInput): Promise<TCoupon> {
        const coupon = await this.repository.createCoupon(data);
        serverFireAction('create_coupon', coupon);
        resetAllPagesCache();
        return coupon;
    }

    @Authorized<TPermissionName>('update_coupon')
    @Mutation(() => Coupon)
    async [updatePath](@Arg("id", () => Int) id: number, @Arg("data") data: CouponInput): Promise<TCoupon | undefined> {
        const coupon = await this.repository.updateCoupon(id, data);
        serverFireAction('update_coupon', coupon);
        resetAllPagesCache();
        return coupon;
    }

    @Authorized<TPermissionName>('delete_coupon')
    @Mutation(() => Boolean)
    async [deletePath](@Arg("id", () => Int) id: number): Promise<boolean> {
        const coupon = await this.repository.deleteCoupon(id);
        serverFireAction('delete_coupon', { id });
        resetAllPagesCache();
        return coupon;
    }

    @Authorized<TPermissionName>('delete_coupon')
    @Mutation(() => Boolean)
    async [deleteManyPath](@Arg("data") data: DeleteManyInput): Promise<boolean | undefined> {
        const res = await this.repository.deleteMany(data);
        resetAllPagesCache();
        return res;
    }

    @Authorized<TPermissionName>('delete_coupon')
    @Mutation(() => Boolean)
    async [deleteManyFilteredPath](
        @Arg("input") input: DeleteManyInput,
        @Arg("filterParams", () => BaseFilterInput, { nullable: true }) filterParams?: BaseFilterInput,
    ): Promise<boolean | undefined> {
        const res = await this.repository.deleteManyFilteredCoupons(input, filterParams);
        resetAllPagesCache();
        return res;
    }

    @Authorized<TPermissionName>('read_coupons')
    @Query(() => PagedCoupon)
    async [getFilteredPath](
        @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TCoupon>,
        @Arg("filterParams", () => BaseFilterInput, { nullable: true }) filterParams?: BaseFilterInput,
    ): Promise<TPagedList<TCoupon> | undefined> {
        return this.repository.getFilteredCoupons(pagedParams, filterParams);
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