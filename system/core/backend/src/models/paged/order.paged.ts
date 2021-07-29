import { Field, ObjectType } from "type-graphql";
import { PagedMeta } from './meta.paged';
import { Order } from '../entities/order.entity';
import { TPagedList, TOrder } from "@cromwell/core";

@ObjectType()
export class PagedOrder implements TPagedList<TOrder> {
    @Field(() => PagedMeta, { nullable: true })
    pagedMeta?: PagedMeta;

    @Field(() => [Order], { nullable: true })
    elements?: Order[];
}