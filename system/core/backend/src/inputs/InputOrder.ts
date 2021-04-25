import { TOrder, TOrderInput } from '@cromwell/core';
import { InputType, Field, Int } from "type-graphql";
import { BasePageInput } from './BasePageInput';

@InputType('InputOrder')
export class InputOrder extends BasePageInput implements TOrderInput {

    @Field(() => String, { nullable: true })
    status?: string;

    @Field(() => String, { nullable: true })
    userId?: string;

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

    @Field(() => Number, { nullable: true })
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
    customerComment?: string;
}