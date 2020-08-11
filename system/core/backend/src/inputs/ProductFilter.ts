import { InputType, Field, ID, Int, Float, ObjectType } from "type-graphql";
import { TPagedParams, TProductFilter, TAttributeInstance } from '@cromwell/core';
import { AttributeInstance } from '../entities/AttributeInstance';

@InputType({ description: "Product filter options" })
export class ProductFilter implements TProductFilter {

    @Field(type => Float, { nullable: true })
    minPrice: number;

    @Field(type => Float, { nullable: true })
    maxPrice: number;

    @Field(type => [AttributeInstance], { nullable: true })
    attributes: AttributeInstance[];
}

