import { TCmsEntityInput } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';

import { BasePageInput } from './BasePageInput';

@InputType('CmsInput')
export class InputCmsEntity extends BasePageInput implements TCmsEntityInput {
    @Field(type => String, { nullable: true })
    themeName?: string;

    @Field(type => String, { nullable: true })
    protocol?: "http" | "https";

    @Field(type => Number, { nullable: true })
    defaultPageSize?: number;
}
