import { TAttributeInstance, TAttributeInstanceValue } from '@cromwell/core';
import { Field, InputType, ObjectType } from 'type-graphql';

import { AttributeProductVariant } from './attribute-product-variant.object';

@ObjectType('AttributeInstanceValue')
@InputType('AttributeInstanceValueInput')
export class AttributeInstanceValue implements TAttributeInstanceValue {
    @Field(type => String, { nullable: false })
    value: string;

    @Field(type => AttributeProductVariant, { nullable: true })
    productVariant?: AttributeProductVariant;
}

@ObjectType('AttributeInstance')
@InputType('AttributeInstanceInput')
export class AttributeInstance implements TAttributeInstance {
    @Field(type => String, { nullable: false })
    key: string;

    @Field(type => [AttributeInstanceValue], { nullable: false })
    values: AttributeInstanceValue[];
}