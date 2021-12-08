import { TCoupon, TPagedList } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';

import { Coupon } from '../entities/coupon.entity';
import { PagedMeta } from './meta.paged';

@ObjectType()
export class PagedCoupon implements TPagedList<TCoupon> {
    @Field(() => PagedMeta, { nullable: true })
    pagedMeta?: PagedMeta;

    @Field(() => [Coupon], { nullable: true })
    elements?: Coupon[];
}