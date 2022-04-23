import { InputType, Field, Int } from "type-graphql";
import { TUpdateUser } from '@cromwell/core';
import { BasePageInput } from './base-page.input';

@InputType()
export class UpdateUser extends BasePageInput implements TUpdateUser {

    @Field(() => String, { nullable: true })
    fullName: string;

    @Field(() => String, { nullable: true })
    email: string;

    @Field(() => String, { nullable: true })
    avatar?: string;

    @Field(() => String, { nullable: true })
    address?: string;

    @Field(() => String, { nullable: true })
    phone?: string;

    @Field(() => String, { nullable: true })
    bio?: string;

    @Field(() => [String], { nullable: true })
    roles?: string[];
}

