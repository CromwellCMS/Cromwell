import { TProductCategoryFilter } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';

@InputType("ProductCategoryFilterInput")
export class ProductCategoryFilterInput implements TProductCategoryFilter {

    @Field(type => String, { nullable: true })
    nameSearch: string;
}
