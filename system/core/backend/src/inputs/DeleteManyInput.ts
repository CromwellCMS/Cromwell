import { TDeleteManyInput } from "@cromwell/core";
import { InputType, Field, ID } from "type-graphql";

@InputType()
export class DeleteManyInput implements TDeleteManyInput {

    @Field(() => [String])
    ids: string[];

    @Field(() => Boolean)
    all?: boolean;
}