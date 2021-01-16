import { Field, ObjectType } from "type-graphql";
import { PagedMeta } from './PagedMeta';
import { Post } from '../Post';
import { TPagedList, TPost } from "@cromwell/core";

@ObjectType()
export class PagedPost implements TPagedList<TPost> {
    @Field(() => PagedMeta, { nullable: true })
    pagedMeta?: PagedMeta;

    @Field(() => [Post], { nullable: true })
    elements?: Post[];
}