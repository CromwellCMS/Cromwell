import { Field, ObjectType } from "type-graphql";
import { PagedMeta } from './meta.paged';
import { Post } from '../entities/post.entity';
import { TPagedList, TPost } from "@cromwell/core";

@ObjectType()
export class PagedPost implements TPagedList<TPost> {
    @Field(() => PagedMeta, { nullable: true })
    pagedMeta?: PagedMeta;

    @Field(() => [Post], { nullable: true })
    elements?: Post[];
}