import { TProductReviewFilter } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';

@InputType("ProductReviewFilter")
export class ProductReviewFilter implements TProductReviewFilter {

    @Field(type => String, { nullable: true })
    productId?: string;

    @Field(type => String, { nullable: true })
    userName?: string;

    @Field(type => String, { nullable: true })
    userId?: string;

    @Field(type => Boolean, { nullable: true })
    approved?: boolean;
}


