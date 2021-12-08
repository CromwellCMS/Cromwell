import { TOrderInput, TOrderStatus } from '@cromwell/core';
import { Field, InputType, Int } from 'type-graphql';

import { BasePageInput } from './base-page.input';

@InputType('OrderInput')
export class OrderInput extends BasePageInput implements TOrderInput {

    @Field(() => String, { nullable: true })
    status?: TOrderStatus;

    @Field(() => Int, { nullable: true })
    userId?: number;

    @Field(() => String, { nullable: true })
    cart?: string;

    @Field(() => Number, { nullable: true })
    orderTotalPrice?: number;

    @Field(() => Number, { nullable: true })
    cartTotalPrice?: number;

    @Field(() => Number, { nullable: true })
    cartOldTotalPrice?: number;

    @Field(() => Number, { nullable: true })
    shippingPrice?: number;

    @Field(() => Int, { nullable: true })
    totalQnt: number;

    @Field(() => String, { nullable: true })
    customerName?: string;

    @Field(() => String, { nullable: true })
    customerPhone?: string;

    @Field(() => String, { nullable: true })
    customerEmail?: string;

    @Field(() => String, { nullable: true })
    customerAddress?: string;

    @Field(() => String, { nullable: true })
    shippingMethod?: string;

    @Field(() => String, { nullable: true })
    paymentMethod?: string;

    @Field(() => String, { nullable: true })
    customerComment?: string;

    @Field(() => String, { nullable: true })
    currency?: string;

    @Field(type => [String], { nullable: true })
    couponCodes?: string[] | null;
}
