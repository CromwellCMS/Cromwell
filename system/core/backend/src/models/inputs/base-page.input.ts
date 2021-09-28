import { TBasePageEntityInput, TBasePageMeta } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';

@InputType()
export class BasePageMetaInput implements TBasePageMeta {
    @Field(() => [String], { nullable: true })
    keywords?: string[];

    @Field(() => String, { nullable: true })
    socialImage?: string;
}

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

    @Field(() => BasePageMetaInput, { nullable: true })
    meta?: TBasePageMeta | null | undefined;
}