import { InputType, Field } from "type-graphql";

@InputType()
export class UpdatePostInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  authorId?: string;

  @Field({ nullable: true })
  isPublished?: boolean;

  @Field()
  content?: string;
}