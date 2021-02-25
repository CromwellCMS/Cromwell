import { TPostInput } from "@cromwell/core";
import { InputType, Field, ID } from "type-graphql";
import { BasePageInput } from './BasePageInput';

@InputType({ description: "New Post data" })
export class UpdatePost extends BasePageInput implements TPostInput {

    @Field(() => String, { nullable: true })
    title: string;

    @Field()
    authorId: string;

    @Field(() => String, { nullable: true })
    mainImage?: string;

    @Field(type => [String], { nullable: true })
    tags?: string[] | null;

    @Field(() => String, { nullable: true })
    content: string;

    @Field(() => String, { nullable: true })
    delta: string;

    @Field(() => Boolean, { nullable: true })
    isPublished: boolean;
}