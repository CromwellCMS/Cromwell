import { TCreateUser } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';

import { BasePageInput } from './BasePageInput';

@InputType()
export class CreateUser extends BasePageInput implements TCreateUser {

    @Field(() => String)
    fullName: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field(() => String, { nullable: true })
    avatar?: string;

    @Field(() => String, { nullable: true })
    location?: string;

    @Field(() => String, { nullable: true })
    bio?: string;

    @Field(() => String, { nullable: true })
    role?: 'admin' | 'author' | 'customer';
}

