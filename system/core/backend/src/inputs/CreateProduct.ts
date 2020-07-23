import { InputType, Field, Int } from "type-graphql";
import { TProductInput } from '@cromwell/core';
import { BasePageInput } from './BasePageInput';

@InputType({ description: "New Product data" })
export class CreateProduct extends BasePageInput implements TProductInput {
    @Field(() => String)
    name: string;

    @Field(type => [String], { nullable: true })
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
}

