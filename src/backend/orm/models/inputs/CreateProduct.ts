import { InputType, Field, ID } from "type-graphql";
import { Product } from '../entities/Product';

@InputType({ description: "New Product data" })
export class CreateProduct implements Partial<Product>  {

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