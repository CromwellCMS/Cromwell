import { TProductReviewFilter } from '@cromwell/core';
import { Field, InputType, Int } from 'type-graphql';

@InputType("ProductReviewFilter")
export class ProductReviewFilter implements TProductReviewFilter {

    @Field(type => Int, { nullable: true })
    productId?: number;

    @Field(type => String, { nullable: true })
    userName?: string;

    @Field(type => Int, { nullable: true })
    userId?: number;

    @Field(type => Boolean, { nullable: true })
    approved?: boolean;
}


