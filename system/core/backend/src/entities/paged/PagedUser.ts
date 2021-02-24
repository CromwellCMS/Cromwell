import { TPagedList, TUser } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';

import { User } from '../User';
import { PagedMeta } from './PagedMeta';

@ObjectType()
export class PagedUser implements TPagedList<TUser> {
    @Field(() => PagedMeta, { nullable: true })
    pagedMeta?: PagedMeta;

    @Field(() => [User], { nullable: true })
    elements?: User[];
}