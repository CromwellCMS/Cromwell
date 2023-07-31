import { TProductReviewInput } from '@cromwell/core';
import { Field, InputType, Int } from 'type-graphql';

@InputType('ProductReviewInput')
export class ProductReviewInput implements TProductReviewInput {
  @Field((type) => Int)
  productId: number;

  @Field((type) => String, { nullable: true })
  title?: string;

  @Field((type) => String, { nullable: true })
  description?: string;

  @Field((type) => Number, { nullable: true })
  rating?: number;

  @Field((type) => String, { nullable: true })
  userName?: string;

  @Field((type) => String, { nullable: true })
  userId?: number;

  @Field((type) => Boolean, { nullable: true })
  approved?: boolean;
}
