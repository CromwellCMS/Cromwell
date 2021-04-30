import { TProductReviewInput } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';

@InputType("ProductReviewInput")
export class ProductReviewInput implements TProductReviewInput {

    @Field(type => String)
    productId: string;

    @Field(type => String, { nullable: true })
    title?: string;

    @Field(type => String, { nullable: true })
    description?: string;

    @Field(type => Number, { nullable: true })
    rating?: number;

    @Field(type => String, { nullable: true })
    userName?: string;

    @Field(type => String, { nullable: true })
    userId?: string;

    @Field(type => Boolean, { nullable: true })
    approved?: boolean;
}
