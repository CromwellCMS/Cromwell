import { Field, ObjectType } from "type-graphql";
import { PagedMeta } from './PagedMeta';
import { ProductReview } from '../ProductReview';
import { TPagedList, TProductReview } from "@cromwell/core";

@ObjectType()
export class PagedProductReview implements TPagedList<TProductReview> {
    @Field(() => PagedMeta, { nullable: true })
    pagedMeta?: PagedMeta;

    @Field(() => ProductReview, { nullable: true })
    elements?: ProductReview[];
}