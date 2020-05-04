import { InputType, Field, ID } from "type-graphql";
import { Author } from '../entities/Author';

@InputType({ description: "New Author data" })
export class CreateAuthorInput implements Partial<Author> {
    @Field()
    name: string;
}