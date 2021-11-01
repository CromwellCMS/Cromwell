import { TCustomEntityFilter } from '@cromwell/core';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Field, InputType } from 'type-graphql';

@InputType("CustomEntityFilterInput")
export class CustomEntityFilterInput implements TCustomEntityFilter {

    @Field(type => String, { nullable: true })
    entityType?: string;

    @Field(type => String, { nullable: true })
    name?: string;

    @Field(() => GraphQLJSONObject, { nullable: true })
    customMeta?: Record<string, string>;
}
