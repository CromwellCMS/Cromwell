import { InputType, Field, ID } from "type-graphql";
import { ProductInputType } from "@cromwell/core";
import { BasePageInput } from './BasePageInput';

@InputType({ description: "Update Product data" })
export class UpdateProduct extends BasePageInput implements ProductInputType {
    @Field(() => String, { nullable: true })
    name: string;

    @Field(() => [String], { nullable: true })
    categoryIds: string[];

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