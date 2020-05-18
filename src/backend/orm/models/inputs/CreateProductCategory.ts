import { InputType, Field, ID } from "type-graphql";
import { ProductCategoryInputType } from "@cromwell/core";
import { BasePageInput } from './BasePageInput';
import { ProductCategory } from '../entities/ProductCategory';

@InputType({ description: "New Product Category data" })
export class CreateProductCategory extends BasePageInput implements ProductCategoryInputType {
    @Field(() => String)
    name: string;

    @Field(() => String, { nullable: true })
    mainImage: string;

    @Field(() => String, { nullable: true })
    description: string;

    @Field(() => [ProductCategory], { nullable: true })
    children: ProductCategory[];

    @Field(() => ProductCategory, { nullable: true })
    parent: ProductCategory;

}