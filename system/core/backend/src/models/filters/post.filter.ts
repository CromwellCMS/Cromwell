import { TPostFilter } from '@cromwell/core';
import { Field, InputType, Int } from 'type-graphql';

@InputType("PostFilterInput")
export class PostFilterInput implements TPostFilter {

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
