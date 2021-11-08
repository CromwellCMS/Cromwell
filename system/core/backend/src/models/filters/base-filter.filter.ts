import { TBaseFilter } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';
import { PrimitiveValueScalar } from '../objects/primitive-value.scalar';

@InputType()
export class BaseFilterInput implements TBaseFilter {
    @Field(() => [PropertySearch], { nullable: true })
    filters?: PropertySearch[];

    @Field(() => [SortByOptions], { nullable: true })
    sorts?: SortByOptions[];
}

@InputType()
export class PropertySearch {
    @Field(() => String, { nullable: true })
    key?: string;

    @Field(() => PrimitiveValueScalar, { nullable: true })
    value?: string | number | boolean | null;

    @Field(() => Boolean, { nullable: true })
    exact?: boolean;

    @Field(() => Boolean, { nullable: true })
    inMeta?: boolean;
}

@InputType()
export class SortByOptions {
    @Field(() => String, { nullable: true })
    key?: string;

    @Field(() => String, { nullable: true })
    sort?: 'ASC' | 'DESC';

    @Field(() => Boolean, { nullable: true })
    inMeta?: boolean;
}