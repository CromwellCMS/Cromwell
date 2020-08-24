import { InputType, Field, ID, Int, Float, ObjectType } from "type-graphql";
import { TPagedParams, TAttributeInstance, } from '@cromwell/core';
import { AttributeInput, AttributeInstance } from '@cromwell/core-backend';
import { TProductFilterAttribute, TProductFilter } from '../../types';


@InputType("ProductFilterInput")
export class ProductFilterInput implements TProductFilter {

    @Field(type => Float, { nullable: true })
    minPrice: number;

    @Field(type => Float, { nullable: true })
    maxPrice: number;

    @Field(type => [ProductFilterAttributes], { nullable: true })
    attributes: ProductFilterAttributes[];
}

@InputType("ProductFilterAttributesInput")
export class ProductFilterAttributes implements TProductFilterAttribute {

    @Field(type => String)
    key: string;

    @Field(type => [String])
    values: string[];
}



