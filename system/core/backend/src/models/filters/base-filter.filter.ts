import { TBaseFilter } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';

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

    @Field(() => String, { nullable: true })
    value?: string;

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
