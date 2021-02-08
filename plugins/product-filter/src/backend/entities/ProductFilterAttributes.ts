import { InputType, Field, ID, Int, Float, ObjectType } from "type-graphql";
import { TPagedParams, TAttributeInstance, } from '@cromwell/core';
import { AttributeInput, AttributeInstance } from '@cromwell/core-backend';
import { TProductFilterAttribute, TProductFilter } from '../../types';


@InputType("ProductFilterAttributesInput")
class ProductFilterAttributes implements TProductFilterAttribute {

    @Field(type => String)
    key: string;

    @Field(type => [String])
    values: string[];
}

export default ProductFilterAttributes;