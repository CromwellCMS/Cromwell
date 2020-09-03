import { Field, ObjectType, Float } from "type-graphql";
import {
    Product, PagedMeta
} from '@cromwell/core-backend';
import { TPagedList, TProduct } from "@cromwell/core";
import { TFilteredList, TFilterMeta } from '../../types'


@ObjectType('FilterMeta')
class FilterMeta implements TFilterMeta {
    @Field(() => Float, { nullable: true })
    minPrice?: number;

    @Field(() => Float, { nullable: true })
    maxPrice?: number;
}

export default FilterMeta;