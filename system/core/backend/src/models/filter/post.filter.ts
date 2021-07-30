import { TPostFilter } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';

@InputType("PostFilterInput")
export class PostFilterInput implements TPostFilter {

    @Field(type => String, { nullable: true })
    authorId: string;

    @Field(type => String, { nullable: true })
    titleSearch: string;

    @Field(type => [String], { nullable: true })
    tagIds?: string[];

    @Field(type => Boolean, { nullable: true })
    published: boolean;

    @Field(type => Boolean, { nullable: true })
    featured: boolean;
}
