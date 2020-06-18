import { InputType, Field } from "type-graphql";
import { ProductCategoryInputType } from '@cromwell/core';
import { BasePageInput } from './BasePageInput';

@InputType({ description: "Update Product Category data" })
export class UpdateProductCategory extends BasePageInput implements ProductCategoryInputType {
    @Field(() => String)
    name: string;

    @Field(() => String, { nullable: true })
    mainImage: string;

    @Field(() => String, { nullable: true })
    description: string;

    @Field(() => String, { nullable: true })
    parentId: string;

    @Field(() => [String], { nullable: true })
    childIds: string[];
}