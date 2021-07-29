import { TFilteredProductList, TProductFilter, TProductFilterAttribute, TProductFilterMeta } from '@cromwell/core';
import { Field, Float, InputType, ObjectType } from 'type-graphql';

import { PagedMeta } from '../paged/meta.paged';
import { Product } from '../entities/product.entity';

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


@InputType("ProductFilterAttributesInput")
export class ProductFilterAttributes implements TProductFilterAttribute {

    @Field(type => String)
    key: string;

    @Field(type => [String])
    values: string[];
}

@InputType("ProductFilterInput")
export class ProductFilterInput implements TProductFilter {

    @Field(type => Float, { nullable: true })
    minPrice?: number;

    @Field(type => Float, { nullable: true })
    maxPrice?: number;

    @Field(type => [ProductFilterAttributes], { nullable: true })
    attributes?: ProductFilterAttributes[];

    @Field(type => String, { nullable: true })
    nameSearch?: string;
}
