import { Field, ObjectType } from "type-graphql";
import { PagedMeta } from './meta.paged';
import { ProductCategory } from '../entities/product-category.entity';
import { TPagedList, TProductCategory } from "@cromwell/core";

@ObjectType()
export class PagedProductCategory implements TPagedList<TProductCategory> {
    @Field(() => PagedMeta, { nullable: true })
    pagedMeta?: PagedMeta;

    @Field(() => [ProductCategory], { nullable: true })
    elements?: TProductCategory[];
}