import { InputType, Field, ID } from "type-graphql";
import { ProductType } from "@cromwell/core";

@InputType({ description: "New Product data" })
export class CreateProduct implements Omit<ProductType, 'id'>  {

    @Field(() => String)
    slug: string;

    @Field(() => String)
    pageTitle: string;

    @Field(() => String)
    name: string;

    @Field(() => String)
    price: string;

    @Field(() => String, { nullable: true })
    oldPrice?: string;

    @Field(() => String)
    mainImage: string;

    @Field(() => String)
    images: string;

    @Field(() => String)
    description: string;

    @Field(() => Boolean)
    isEnabled: boolean;
}

