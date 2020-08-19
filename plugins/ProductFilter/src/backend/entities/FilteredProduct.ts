import { Field, ObjectType, Float } from "type-graphql";
import {
    Product, PagedMeta
} from '@cromwell/core-backend';
import { TPagedList, TProduct } from "@cromwell/core";
import { TFilteredList, TFilterMeta } from '../../types'

@ObjectType('FilteredProduct')
export class FilteredProduct implements TFilteredList<TProduct> {
    @Field(() => PagedMeta, { nullable: true })
    pagedMeta?: PagedMeta;

    @Field(() => Product, { nullable: true })
    elements?: Product[];

    @Field(() => FilterMeta)
    filterMeta: TFilterMeta;
}

@ObjectType('FilterMeta')
export class FilterMeta implements TFilterMeta {
    @Field(() => Float, { nullable: true })
    minPrice?: number;

    @Field(() => Float, { nullable: true })
    maxPrice?: number;
}