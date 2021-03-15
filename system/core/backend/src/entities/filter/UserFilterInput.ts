import { TUserFilter, TUserRole } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';

@InputType("UserFilterInput")
export class UserFilterInput implements TUserFilter {

    @Field(type => String, { nullable: true })
    fullName?: string;

    @Field(type => String, { nullable: true })
    email?: string;

    @Field(type => String, { nullable: true })
    phone?: string;

    @Field(type => String, { nullable: true })
    address?: string;

    @Field(type => String, { nullable: true })
    role?: TUserRole;
}
