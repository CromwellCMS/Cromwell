import { TProductInput } from '@cromwell/core';
import { Field, InputType, Int } from 'type-graphql';

import { AttributeInstance } from '../objects/attribute-instance.object';
import { BasePageInput } from './base-page.input';

@InputType({ description: "New Product data" })
export class CreateProduct extends BasePageInput implements TProductInput {
    @Field(() => String)
    name: string;

    @Field(type => [Int], { nullable: true })
    categoryIds: number[];

    @Field(() => Int, { nullable: true })
    mainCategoryId: number;

    @Field(() => Number, { nullable: true })
    price: number;

    @Field(() => Number, { nullable: true })
    oldPrice?: number;

    @Field(type => String, { nullable: true })
    sku?: string;

    @Field(() => String, { nullable: true })
    mainImage: string;

    @Field(() => [String], { nullable: true })
    images: string[];

    @Field(() => String, { nullable: true })
    description?: string;

    @Field(type => String, { nullable: true })
    descriptionDelta?: string;

    @Field(() => [AttributeInstance], { nullable: true })
    attributes?: AttributeInstance[];

    @Field(type => Int, { nullable: true })
    stockAmount?: number;

    @Field(type => Boolean, { nullable: true })
    inStock?: boolean;
}

