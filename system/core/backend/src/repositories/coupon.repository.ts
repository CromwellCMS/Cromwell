import { TCoupon, TCouponInput, TDeleteManyInput, TPagedList, TPagedParams } from '@cromwell/core';
import { EntityRepository, SelectQueryBuilder } from 'typeorm';

import { checkEntitySlug, getPaged, handleBaseInput, handleCustomMetaInput } from '../helpers/base-queries';
import { getLogger } from '../helpers/logger';
import { Coupon } from '../models/entities/coupon.entity';
import { BaseFilterInput } from '../models/filters/base-filter.filter';
import { PagedParamsInput } from '../models/inputs/paged-params.input';
import { BaseRepository } from './base.repository';

const logger = getLogger();

@EntityRepository(Coupon)
export class CouponRepository extends BaseRepository<Coupon> {

    constructor() {
        super(Coupon);
    }

    async getCoupons(params?: TPagedParams<TCoupon>): Promise<TPagedList<Coupon>> {
        logger.log('CouponRepository::getCoupons');
        return this.getPaged(params)
    }

    async getCouponById(id: number): Promise<Coupon | undefined> {
        logger.log('CouponRepository::getCouponById id: ' + id);
        return this.getById(id);
    }

    async getCouponsByIds(ids: number[]): Promise<Coupon[]> {
        logger.log('CouponRepository::getCouponsByIds ids: ' + ids.join(', '));
        return this.findByIds(ids);
    }

    async getCouponsByCodes(codes: string[]): Promise<Coupon[] | undefined> {
        logger.log('CouponRepository::getCouponsByCodes');
        if (!codes?.length) return [];
        const qb = this.createQueryBuilder(this.metadata.tablePath);

        codes.forEach((code, index) => {
            if (!code) return;
            qb.orWhere(`${this.metadata.tablePath}.code = :code_${index}`,
                { [`code_${index}`]: code });

        });
        return qb.getMany();
    }

    private async handleBaseCouponInput(coupon: Coupon, input: TCouponInput, action: 'update' | 'create') {
        await handleBaseInput(coupon, input);

        coupon.discountType = input.discountType;
        coupon.value = input.value;
        coupon.code = input.code;
        coupon.description = input.description;
        coupon.allowFreeShipping = input.allowFreeShipping;
        coupon.minimumSpend = input.minimumSpend;
        coupon.maximumSpend = input.maximumSpend;
        coupon.categoryIds = input.categoryIds;
        coupon.productIds = input.productIds;
        coupon.expiryDate = input.expiryDate;
        coupon.usageLimit = input.usageLimit;
        coupon.usedTimes = input.usedTimes;

        if (action === 'create') await coupon.save();
        await checkEntitySlug(coupon, Coupon);
        await handleCustomMetaInput(coupon, input);
    }

    async createCoupon(inputData: TCouponInput, id?: number | null): Promise<Coupon> {
        logger.log('CouponRepository::createCoupon');
        const coupon = new Coupon();
        if (id) coupon.id = id;

        await this.handleBaseCouponInput(coupon, inputData, 'create');
        await this.save(coupon);
        return coupon;
    }

    async updateCoupon(id: number, inputData: TCouponInput): Promise<Coupon> {
        logger.log('CouponRepository::updateCoupon id: ' + id);
        const coupon = await this.getById(id);
        if (!coupon) throw new Error(`Coupon ${id} not found!`);

        await this.handleBaseCouponInput(coupon, inputData, 'update');
        await this.save(coupon);
        return coupon;
    }

    async deleteCoupon(id: number): Promise<boolean> {
        logger.log('CouponRepository::deleteCoupon; id: ' + id);

        const coupon = await this.getCouponById(id);
        if (!coupon) {
            logger.error('CouponRepository::deleteCoupon failed to find Coupon by id');
            return false;
        }
        const res = await this.delete(id);
        return true;
    }

    applyCouponFilter(qb: SelectQueryBuilder<Coupon>, filterParams?: BaseFilterInput) {
        this.applyBaseFilter(qb, filterParams)
        return qb;
    }

    async getFilteredCoupons(pagedParams?: PagedParamsInput<Coupon>, filterParams?: BaseFilterInput): Promise<TPagedList<Coupon>> {
        const qb = this.createQueryBuilder(this.metadata.tablePath);
        qb.select();
        this.applyCouponFilter(qb, filterParams);
        return await getPaged<Coupon>(qb, this.metadata.tablePath, pagedParams);
    }

    async deleteManyFilteredCoupons(input: TDeleteManyInput, filterParams?: BaseFilterInput): Promise<boolean | undefined> {
        const qbSelect = this.createQueryBuilder(this.metadata.tablePath).select([`${this.metadata.tablePath}.id`]);
        this.applyCouponFilter(qbSelect, filterParams);
        this.applyDeleteMany(qbSelect, input);

        const qbDelete = this.createQueryBuilder(this.metadata.tablePath).delete()
            .where(`${this.metadata.tablePath}.id IN (${qbSelect.getQuery()})`)
            .setParameters(qbSelect.getParameters());

        await qbDelete.execute();
        return true;
    }
}
