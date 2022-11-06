import { TProductReviewFilter } from '@cromwell/core';
import { Field, InputType, Int } from 'type-graphql';

import { BaseFilterInput } from './base-filter.filter';

@InputType('ProductReviewFilter')
export class ProductReviewFilter extends BaseFilterInput implements TProductReviewFilter {
  @Field((type) => Int, { nullable: true })
  productId?: number;

  @Field((type) => String, { nullable: true })
  userName?: string;

  @Field((type) => Int, { nullable: true })
  userId?: number;

  @Field((type) => Boolean, { nullable: true })
  approved?: boolean;
}
