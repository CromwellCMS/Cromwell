import { InputType, Field, ID } from "type-graphql";
import { Product } from '../entities/Product';

@InputType({ description: "Update Product data" })
export class UpdateProduct implements Partial<Product> {

    @Field(() => String)
    pageTitle: string;

    @Field(() => String)
    name: string;

    @Field(() => String)
    price: string;

    @Field(() => String)
    mainImage: string;

    @Field(() => Boolean)
    isPublished: boolean;
}