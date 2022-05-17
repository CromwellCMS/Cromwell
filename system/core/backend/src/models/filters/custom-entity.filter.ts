import { TCustomEntityFilter } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';

import { BaseFilterInput } from './base-filter.filter';

@InputType("CustomEntityFilterInput")
export class CustomEntityFilterInput extends BaseFilterInput implements TCustomEntityFilter {

    @Field(type => String, { nullable: true })
    entityType: string;

    @Field(type => String, { nullable: true })
    name?: string;
}
