import { InputType, Field, ID } from "type-graphql";
import { PagedParamsType } from "@cromwell/core";

@InputType({ description: "Paged data" })
export class PagedParamsInput<T> implements PagedParamsType<T> {

    @Field(() => Number, { nullable: true })
    pageNumber: number;

    @Field(() => Number, { nullable: true })
    pageSize: number;

    @Field(() => String, { nullable: true })
    orderBy: keyof T;

    @Field(() => String, { nullable: true })
    order: 'ASC' | 'DESC';

}

