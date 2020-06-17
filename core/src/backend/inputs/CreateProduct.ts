import { InputType, Field, Int } from "type-graphql";
import { ProductInputType } from '../../types';
import { BasePageInput } from './BasePageInput';

@InputType({ description: "New Product data" })
export class CreateProduct extends BasePageInput implements ProductInputType {
    @Field(() => String)
    name: string;

    @Field(type  => [String], { nullable: true })
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

