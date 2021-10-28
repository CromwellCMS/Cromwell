import { TProductInput } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';

import { AttributeInstance } from '../entities/attribute-instance.entity';
import { BasePageInput } from './base-page.input';

@InputType({ description: "Update Product data" })
export class UpdateProduct extends BasePageInput implements TProductInput {
    @Field(() => String, { nullable: true })
    name: string;

    @Field(() => [String], { nullable: true })
    categoryIds: string[];

    @Field(() => String, { nullable: true })
    mainCategoryId: string;

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
}