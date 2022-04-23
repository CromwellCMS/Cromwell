import { TPermissionName, TRoleInput } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';

import { BasePageInput } from './base-page.input';

@InputType('RoleInput')
export class RoleInput extends BasePageInput implements TRoleInput {
    @Field(type => String)
    name?: string | null;

    @Field(type => String, { nullable: true })
    title?: string | null;

    @Field(type => [String], { nullable: true })
    permissions: TPermissionName[] | null;
}