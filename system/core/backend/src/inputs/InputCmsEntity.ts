import { TCmsEntityInput, TCurrency } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';

import { BasePageInput } from './BasePageInput';
import { CurrencySettings } from '../entities/Cms';

@InputType('CmsInput')
export class InputCmsEntity extends BasePageInput implements TCmsEntityInput {
    @Field(type => String, { nullable: true })
    themeName?: string;

    @Field(type => String, { nullable: true })
    protocol?: "http" | "https";

    @Field(type => Number, { nullable: true })
    defaultPageSize?: number;

    @Field(type => [CurrencySettings], { nullable: true })
    currencies?: TCurrency[];

    @Field(type => String, { nullable: true })
    versions?: string;

    @Field(type => Boolean, { nullable: true })
    installed?: boolean;
}
