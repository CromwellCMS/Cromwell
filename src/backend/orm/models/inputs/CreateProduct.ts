import { InputType, Field, ID } from "type-graphql";
import { ProductInputType } from "@cromwell/core";
import { BasePageInput } from './BasePageInput';

@InputType({ description: "New Product data" })
export class CreateProduct extends BasePageInput implements ProductInputType {
    @Field(() => String)
    name: string;

    @Field(() => String, { nullable: true })
    price: string;

    @Field(() => String, { nullable: true })
    oldPrice?: string;

    @Field(() => String, { nullable: true })
    mainImage: string;

    @Field(() => [String], { nullable: true })
    images: string[];

    @Field(() => String, { nullable: true })
    description: string;
}

