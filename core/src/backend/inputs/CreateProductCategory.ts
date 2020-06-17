import { InputType, Field } from "type-graphql";
import { ProductCategoryInputType } from '../../types';
import { BasePageInput } from './BasePageInput';

@InputType({ description: "New Product Category data" })
export class CreateProductCategory extends BasePageInput implements ProductCategoryInputType {
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