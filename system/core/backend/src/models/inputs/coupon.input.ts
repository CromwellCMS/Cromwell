import { TCouponInput } from '@cromwell/core';
import { Field, InputType, Int } from 'type-graphql';

import { CustomDateScalar } from '../objects/custom-date.scalar';
import { BasePageInput } from './base-page.input';

@InputType('CouponInput')
export class CouponInput extends BasePageInput implements TCouponInput {

    @Field(type => String, { nullable: true })
    discountType?: 'fixed' | 'percentage';

    @Field(type => Number, { nullable: true })
    value?: number;

    @Field(type => String, { nullable: true })
    code?: string;

    @Field(type => String, { nullable: true })
    description?: string;

    @Field(type => Boolean, { nullable: true })
    allowFreeShipping?: boolean;

    @Field(type => Number, { nullable: true })
    minimumSpend?: number;

    @Field(type => Number, { nullable: true })
    maximumSpend?: number;

    @Field(type => [Number], { nullable: true })
    categoryIds?: number[] | null;

    @Field(type => [Number], { nullable: true })
    productIds?: number[] | null;

    @Field(type => CustomDateScalar, { nullable: true })
    expiryDate?: Date | null;

    @Field(type => Int, { nullable: true })
    usageLimit?: number | null;

    usedTimes?: number | null;
}