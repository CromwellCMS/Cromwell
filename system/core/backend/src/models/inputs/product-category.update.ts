import { TProductCategoryInput } from '@cromwell/core';
import { Field, InputType, Int } from 'type-graphql';

import { BasePageInput } from './base-page.input';

@InputType({ description: "Update Product Category data" })
export class UpdateProductCategory extends BasePageInput implements TProductCategoryInput {
    @Field(() => String)
    name?: string | null;

    @Field(() => String, { nullable: true })
    mainImage?: string | null;

    @Field(() => String, { nullable: true })
    description?: string | null;

    @Field(type => String, { nullable: true })
    descriptionDelta?: string | null;

    @Field(() => Int, { nullable: true })
    parentId?: number | null;
}