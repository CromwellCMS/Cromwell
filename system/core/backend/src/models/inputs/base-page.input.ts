import { TBasePageEntityInput, TBasePageMeta } from '@cromwell/core';
import { GraphQLJSONObject } from 'graphql-type-json';
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
    slug?: string | null;

    @Field(() => String, { nullable: true })
    pageTitle?: string | null;

    @Field(() => String, { nullable: true })
    pageDescription?: string | null;

    @Field(() => Boolean, { nullable: true })
    isEnabled?: boolean | null;

    @Field(() => BasePageMetaInput, { nullable: true })
    meta?: TBasePageMeta | null | undefined;

    @Field(() => GraphQLJSONObject, { nullable: true })
    customMeta?: Record<string, string | null> | null;
}