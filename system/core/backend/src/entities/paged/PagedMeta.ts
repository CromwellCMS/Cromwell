import { Field, ObjectType } from "type-graphql";
import { TPagedMeta } from "@cromwell/core";

@ObjectType()
export class PagedMeta implements TPagedMeta {
    @Field(() => Number, { nullable: true })
    pageNumber?: number;

    @Field(() => Number, { nullable: true })
    pageSize?: number;

    @Field(() => Number, { nullable: true })
    totalPages?: number;

    @Field(() => Number, { nullable: true })
    totalElements?: number;
}