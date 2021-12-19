import { TProductVariant, TStockStatus } from '@cromwell/core';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Field, InputType, Int, ObjectType } from 'type-graphql';

@ObjectType('ProductVariant')
@InputType('ProductVariantInput')
export class ProductVariant implements TProductVariant {
    @Field(() => String, { nullable: true })
    id?: string;

    @Field(() => String, { nullable: true })
    name?: string;

    @Field(() => Number, { nullable: true })
    price?: number;

    @Field(() => Number, { nullable: true })
    oldPrice?: number;

    @Field(() => String, { nullable: true })
    sku?: string;

    @Field(() => String, { nullable: true })
    mainImage?: string;

    @Field(() => [String], { nullable: true })
    images?: string[];

    @Field(() => String, { nullable: true })
    description?: string;

    @Field(() => String, { nullable: true })
    descriptionDelta?: string;

    @Field(type => Int, { nullable: true })
    stockAmount?: number;

    @Field(type => String, { nullable: true })
    stockStatus?: TStockStatus;

    @Field(type => Boolean, { nullable: true })
    manageStock?: boolean;

    @Field(() => GraphQLJSONObject, { nullable: true })
    attributes?: Record<string, string | number | 'any'>;
}
