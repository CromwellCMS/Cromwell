import { TFilteredProductList, TProductFilterMeta } from '@cromwell/core';
import { Field, Float, ObjectType } from 'type-graphql';
import { PagedMeta } from '../paged/PagedMeta';
import { Product } from '../Product';

@ObjectType('ProductFilterMeta')
export class ProductFilterMeta implements TProductFilterMeta {
    @Field(() => Float, { nullable: true })
    minPrice?: number;

    @Field(() => Float, { nullable: true })
    maxPrice?: number;
}

@ObjectType('FilteredProduct')
export class FilteredProduct implements TFilteredProductList {
    @Field(() => PagedMeta, { nullable: true })
    pagedMeta?: PagedMeta;

    @Field(() => [Product], { nullable: true })
    elements?: Product[];

    @Field(() => ProductFilterMeta)
    filterMeta: TProductFilterMeta;
}
