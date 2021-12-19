import { TProductInput, TStockStatus } from '@cromwell/core';
import { Field, InputType, Int } from 'type-graphql';

import { AttributeInstance } from '../objects/attribute-instance.object';
import { ProductVariant } from '../objects/product-variant.object';
import { BasePageInput } from './base-page.input';

@InputType({ description: "Update Product data" })
export class UpdateProduct extends BasePageInput implements TProductInput {
    @Field(() => String, { nullable: true })
    name: string;

    @Field(() => [Int], { nullable: true })
    categoryIds: number[];

    @Field(() => Int, { nullable: true })
    mainCategoryId: number;

    @Field(() => Number, { nullable: true })
    price: number;

    @Field(() => Number, { nullable: true })
    oldPrice: number;

    @Field(type => String, { nullable: true })
    sku?: string;

    @Field(() => String, { nullable: true })
    mainImage: string;

    @Field(() => [String], { nullable: true })
    images: string[];

    @Field(() => String, { nullable: true })
    description: string;

    @Field(type => String, { nullable: true })
    descriptionDelta?: string;

    @Field(() => [AttributeInstance], { nullable: true })
    attributes?: AttributeInstance[];

    @Field(type => Int, { nullable: true })
    stockAmount?: number;

    @Field(type => String, { nullable: true })
    stockStatus?: TStockStatus;

    @Field(type => Boolean, { nullable: true })
    manageStock?: boolean;

    @Field(type => [ProductVariant], { nullable: true })
    variants?: ProductVariant[];
}