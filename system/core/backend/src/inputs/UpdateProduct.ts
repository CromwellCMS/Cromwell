import { InputType, Field, ID } from "type-graphql";
import { TProductInput } from '@cromwell/core';
import { BasePageInput } from './BasePageInput';
import { AttributeInstance } from '../entities/AttributeInstance';

@InputType({ description: "Update Product data" })
export class UpdateProduct extends BasePageInput implements TProductInput {
    @Field(() => String, { nullable: true })
    name: string;

    @Field(() => [String], { nullable: true })
    categoryIds: string[];

    @Field(() => Number, { nullable: true })
    price: number;

    @Field(() => Number, { nullable: true })
    oldPrice: number;

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