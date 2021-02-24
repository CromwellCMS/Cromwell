import { TProductFilter, TProductFilterAttribute } from '@cromwell/core';
import { Field, Float, InputType } from 'type-graphql';

@InputType("ProductFilterAttributesInput")
export class ProductFilterAttributes implements TProductFilterAttribute {

    @Field(type => String)
    key: string;

    @Field(type => [String])
    values: string[];
}

@InputType("ProductFilterInput")
export class ProductFilterInput implements TProductFilter {

    @Field(type => Float, { nullable: true })
    minPrice: number;

    @Field(type => Float, { nullable: true })
    maxPrice: number;

    @Field(type => [ProductFilterAttributes], { nullable: true })
    attributes: ProductFilterAttributes[];

    @Field(type => String, { nullable: true })
    nameSearch: string;
}
