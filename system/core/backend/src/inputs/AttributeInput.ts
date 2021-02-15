import { TAttributeInput, TAttributeValue } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';
import { BasePageInput } from './BasePageInput';

@InputType("AttributeInput")
export class AttributeInput extends BasePageInput implements TAttributeInput {
    @Field(type => String)
    key: string;

    @Field(type => [AttributeValueInput])
    values: AttributeValueInput[];

    @Field(type => String)
    type: 'radio' | 'checkbox';

    @Field(type => String, { nullable: true })
    icon?: string;

}

@InputType("AttributeValueInput")
export class AttributeValueInput implements TAttributeValue {
    @Field(type => String)
    value: string;

    @Field(type => String, { nullable: true })
    icon?: string;

}