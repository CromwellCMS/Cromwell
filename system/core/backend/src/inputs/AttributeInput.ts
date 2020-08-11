import { TAttribute } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';

@InputType("AttributeInput")
export class AttributeInput implements TAttribute {
    @Field(type => String)
    key: string;

    @Field(type => [String])
    values: string[];

    @Field(type => String)
    type: 'radio' | 'checkbox';

}