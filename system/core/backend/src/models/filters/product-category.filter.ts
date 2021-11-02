import { TProductCategoryFilter } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';

import { BaseFilterInput } from './base-filter.filter';

@InputType("ProductCategoryFilterInput")
export class ProductCategoryFilterInput extends BaseFilterInput implements TProductCategoryFilter {

    @Field(type => String, { nullable: true })
    nameSearch: string;
}
