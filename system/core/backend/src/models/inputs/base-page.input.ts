import { TBasePageEntityInput } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';

@InputType()
export class BasePageInput implements TBasePageEntityInput {
    @Field(() => String, { nullable: true })
    slug?: string;

    @Field(() => String, { nullable: true })
    pageTitle?: string;

    @Field(() => String, { nullable: true })
    pageDescription?: string;

    @Field(() => Boolean, { nullable: true })
    isEnabled?: boolean;
}