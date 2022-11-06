import { TProductVariantInput, TStockStatus } from '@cromwell/core';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Field, InputType, Int } from 'type-graphql';

import { BasePageInput } from './base-page.input';

@InputType()
export class ProductVariantInput extends BasePageInput implements TProductVariantInput {
  @Field((type) => Int, { nullable: true })
  id?: number | null;

  @Field((type) => String, { nullable: true })
  name?: string | null;

  @Field((type) => Number, { nullable: true })
  price?: number | null;

  @Field((type) => Number, { nullable: true })
  oldPrice?: number | null;

  @Field((type) => String, { nullable: true })
  sku?: string | null;

  @Field((type) => String, { nullable: true })
  mainImage?: string | null;

  @Field((type) => [String], { nullable: true })
  images?: string[] | null;

  @Field((type) => Int, { nullable: true })
  stockAmount?: number | null;

  @Field((type) => String, { nullable: true })
  stockStatus?: TStockStatus | null;

  @Field((type) => Boolean, { nullable: true })
  manageStock?: boolean | null;

  @Field((type) => String, { nullable: true })
  description?: string | null;

  @Field((type) => String, { nullable: true })
  descriptionDelta?: string | null;

  @Field(() => GraphQLJSONObject, { nullable: true })
  attributes: Record<string, string | number | 'any'> | undefined | null;
}
