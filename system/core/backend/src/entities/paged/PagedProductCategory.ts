import { Field, ObjectType } from "type-graphql";
import { PagedMeta } from './PagedMeta';
import { ProductCategory } from '../ProductCategory';
import { TPagedList, TProductCategory } from "@cromwell/core";

@ObjectType()
export class PagedProductCategory implements TPagedList<TProductCategory> {
    @Field(() => PagedMeta, { nullable: true })
    pagedMeta?: PagedMeta;

    @Field(() => [ProductCategory], { nullable: true })
    elements?: TProductCategory[];
}