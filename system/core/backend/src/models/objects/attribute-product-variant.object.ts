import { TAttributeProductVariant } from '@cromwell/core';
import { Field, InputType, ObjectType } from 'type-graphql';

@ObjectType("AttributeProductVariantInput")
@InputType("AttributeProductVariantType")
export class AttributeProductVariant implements TAttributeProductVariant {
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
}
