import { InputType, Field } from "type-graphql";
import { TProductCategoryInput } from '@cromwell/core';
import { BasePageInput } from './BasePageInput';

@InputType({ description: "New Product Category data" })
export class CreateProductCategory extends BasePageInput implements TProductCategoryInput {
    @Field(() => String)
    name: string;

    @Field(() => String, { nullable: true })
    mainImage?: string;

    @Field(() => String, { nullable: true })
    description?: string;
    
    @Field(type => String, { nullable: true })
    descriptionDelta?: string;

    @Field(() => String, { nullable: true })
    parentId?: string;

    @Field(() => [String], { nullable: true })
    childIds?: string[];
}