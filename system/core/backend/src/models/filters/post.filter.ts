import { TPostFilter } from '@cromwell/core';
import { Field, InputType, Int } from 'type-graphql';

import { BaseFilterInput } from './base-filter.filter';

@InputType("PostFilterInput")
export class PostFilterInput extends BaseFilterInput implements TPostFilter {

    @Field(type => Int, { nullable: true })
    authorId?: number;

    @Field(type => String, { nullable: true })
    titleSearch?: string;

    @Field(type => [Int], { nullable: true })
    tagIds?: number[];

    @Field(type => Boolean, { nullable: true })
    published?: boolean;

    @Field(type => Boolean, { nullable: true })
    featured?: boolean;
}
