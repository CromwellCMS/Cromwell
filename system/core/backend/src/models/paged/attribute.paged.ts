import { TAttribute, TPagedList } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';

import { Attribute } from '../entities/attribute.entity';
import { PagedMeta } from './meta.paged';

@ObjectType()
export class PagedAttribute implements TPagedList<TAttribute> {
    @Field(() => PagedMeta, { nullable: true })
    pagedMeta?: PagedMeta;

    @Field(() => [Attribute], { nullable: true })
    elements?: Attribute[];
}