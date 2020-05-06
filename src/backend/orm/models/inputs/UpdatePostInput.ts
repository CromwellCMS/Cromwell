import { InputType, Field } from "type-graphql";
import { Post } from '../entities/Post';

@InputType()
export class UpdatePostInput implements Partial<Post>{
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  authorId?: string;

  @Field({ nullable: true })
  isPublished?: boolean;

  @Field()
  content?: string;
}