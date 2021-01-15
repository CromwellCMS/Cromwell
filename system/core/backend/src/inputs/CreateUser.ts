import { InputType, Field, Int } from "type-graphql";
import { TUserInput } from '@cromwell/core';
import { BasePageInput } from './BasePageInput';
import { AttributeInstance } from '../entities/AttributeInstance';

@InputType()
export class CreateUser extends BasePageInput implements TUserInput {

    @Field(() => String)
    fullName: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field(() => String, { nullable: true })
    avatar?: string;

}

