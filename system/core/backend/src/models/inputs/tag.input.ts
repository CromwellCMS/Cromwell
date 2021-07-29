import { TTagInput } from '@cromwell/core';
import { InputType, Field, Int } from "type-graphql";
import { BasePageInput } from './base-page.input';

@InputType('InputTag')
export class InputTag extends BasePageInput implements TTagInput {
    @Field(type => String)
    name: string;

    @Field(type => String, { nullable: true })
    color?: string;

    @Field(type => String, { nullable: true })
    image?: string;

    @Field(type => String, { nullable: true })
    description?: string;
}