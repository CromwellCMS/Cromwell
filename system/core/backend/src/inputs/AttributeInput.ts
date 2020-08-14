import { TAttribute, TAttributeValue } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';

@InputType("AttributeInput")
export class AttributeInput implements TAttribute {
    @Field(type => String)
    key: string;

    @Field(type => [AttributeValueInput])
    values: AttributeValueInput[];

    @Field(type => String)
    type: 'radio' | 'checkbox';

}

@InputType("AttributeValueInput")
export class AttributeValueInput implements TAttributeValue {
    @Field(type => String)
    value: string;

    @Field(type => String, { nullable: true })
    icon?: string;

}