import { TPermissionName, TUserFilter } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';

import { BaseFilterInput } from './base-filter.filter';

@InputType("UserFilterInput")
export class UserFilterInput extends BaseFilterInput implements TUserFilter {

    @Field(type => String, { nullable: true })
    fullName?: string;

    @Field(type => String, { nullable: true })
    email?: string;

    @Field(type => String, { nullable: true })
    phone?: string;

    @Field(type => String, { nullable: true })
    address?: string;

    @Field(() => [String], { nullable: true })
    roles?: string[];

    @Field(type => [String], { nullable: true })
    permissions?: TPermissionName[];
}
