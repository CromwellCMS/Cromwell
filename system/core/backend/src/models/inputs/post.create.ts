import { TPostInput } from '@cromwell/core';
import { Field, InputType, Int } from 'type-graphql';

import { BasePageInput } from './base-page.input';

@InputType({ description: "New Post data" })
export class CreatePost extends BasePageInput implements TPostInput {

  @Field(() => String, { nullable: true })
  title: string;

  @Field(type => Int)
  authorId: number;

  @Field(() => String, { nullable: true })
  mainImage?: string;

  @Field(type => String, { nullable: true })
  readTime?: string | null;

  @Field(type => [Number], { nullable: true })
  tagIds?: number[] | null;

  @Field(() => String, { nullable: true })
  content: string;

  @Field(() => String, { nullable: true })
  delta: string;

  @Field(type => String, { nullable: true })
  excerpt?: string | null;

  @Field(() => Boolean, { nullable: true })
  published: boolean;

  @Field(() => Boolean, { nullable: true })
  featured?: boolean;

  @Field(type => Date, { nullable: true })
  publishDate?: Date | null;
}