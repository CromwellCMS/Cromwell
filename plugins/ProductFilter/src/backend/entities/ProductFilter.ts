import { InputType, Field, ID, Int, Float, ObjectType } from "type-graphql";
import { TPagedParams, TAttributeInstance, } from '@cromwell/core';
import { AttributeInput, AttributeInstance } from '@cromwell/core-backend';
import { TProductFilterAttribute, TProductFilter } from '../../types';
import ProductFilterAttributes from './ProductFilterAttributes'


@InputType("ProductFilterInput")
class ProductFilterInput implements TProductFilter {

    @Field(type => Float, { nullable: true })
    minPrice: number;

    @Field(type => Float, { nullable: true })
    maxPrice: number;

    @Field(type => [ProductFilterAttributes], { nullable: true })
    attributes: ProductFilterAttributes[];
}

export default ProductFilterInput;




