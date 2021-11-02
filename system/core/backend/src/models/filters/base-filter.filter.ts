import { TBaseFilter } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';

@InputType()
export class BaseFilterInput implements TBaseFilter {
    @Field(() => [PropertyFilter], { nullable: true })
    properties?: PropertyFilter[];
}

@InputType()
export class PropertyFilter {
    @Field(() => String, { nullable: true })
    key?: string;

    @Field(() => String, { nullable: true })
    value?: string;

    @Field(() => Boolean, { nullable: true })
    exact?: boolean;

    @Field(() => Boolean, { nullable: true })
    inMeta?: boolean;
}
