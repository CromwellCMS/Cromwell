import { Field, ObjectType } from "type-graphql";
import { PagedMeta } from './PagedMeta';
import { Tag } from '../Tag';
import { TPagedList, TTag } from "@cromwell/core";

@ObjectType()
export class PagedTag implements TPagedList<TTag> {
    @Field(() => PagedMeta, { nullable: true })
    pagedMeta?: PagedMeta;

    @Field(() => [Tag], { nullable: true })
    elements?: Tag[];
}