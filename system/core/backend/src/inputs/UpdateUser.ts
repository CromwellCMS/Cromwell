import { InputType, Field, Int } from "type-graphql";
import { TUserInput } from '@cromwell/core';
import { BasePageInput } from './BasePageInput';

@InputType()
export class UpdateUser extends BasePageInput implements TUserInput {

    @Field(() => String, { nullable: true })
    fullName: string;

    @Field(() => String, { nullable: true })
    email: string;

    @Field(() => String, { nullable: true })
    password: string;

    @Field(() => String, { nullable: true })
    avatar?: string;
    
}

