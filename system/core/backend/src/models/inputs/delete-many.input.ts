import { TDeleteManyInput } from '@cromwell/core';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class DeleteManyInput implements TDeleteManyInput {

    @Field(() => [Int])
    ids: number[];

    @Field(() => Boolean)
    all?: boolean;
}