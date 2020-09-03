import { Field, ObjectType, Float } from "type-graphql";
import {
    Product, PagedMeta
} from '@cromwell/core-backend';
import { TPagedList, TProduct } from "@cromwell/core";
import { TFilteredList, TFilterMeta } from '../../types';
import FilterMeta from './FilterMeta'

@ObjectType('FilteredProduct')
class FilteredProduct implements TFilteredList<TProduct> {
    @Field(() => PagedMeta, { nullable: true })
    pagedMeta?: PagedMeta;

    @Field(() => Product, { nullable: true })
    elements?: Product[];

    @Field(() => FilterMeta)
    filterMeta: TFilterMeta;
}

export default FilteredProduct;

