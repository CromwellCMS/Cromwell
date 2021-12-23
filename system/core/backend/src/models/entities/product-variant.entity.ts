import { TProductVariant, TStockStatus } from '@cromwell/core';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Field, Int, ObjectType } from 'type-graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BasePageEntity } from './base-page.entity';
import { ProductVariantMeta } from './meta/product-variant-meta.entity';
import { Product } from './product.entity';

@Entity()
@ObjectType()
export class ProductVariant extends BasePageEntity implements TProductVariant {

    @Field(() => Int)
    @Column({ type: "int" })
    productId: number;

    @ManyToOne(() => Product, entity => entity.variants, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "productId" })
    product?: Product;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    @Index({ fulltext: true })
    name?: string | null;

    @Field(type => Number, { nullable: true })
    @Column({ type: "float", nullable: true })
    @Index()
    price?: number | null;

    @Field(type => Number, { nullable: true })
    @Column({ type: "float", nullable: true })
    @Index()
    oldPrice?: number | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    @Index({ fulltext: true })
    sku?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 400, nullable: true })
    mainImage?: string | null;

    @Field(type => [String], { nullable: true })
    @Column({ type: "simple-array", nullable: true })
    images?: string[] | null;

    @Field(type => Int, { nullable: true })
    @Column({ type: "int", nullable: true })
    @Index()
    stockAmount?: number | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    @Index()
    stockStatus?: TStockStatus | null;

    @Field(type => Boolean, { nullable: true })
    @Column({ type: "boolean", nullable: true })
    manageStock?: boolean | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    description?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    descriptionDelta?: string | null;

    @Column({ type: "text", nullable: true })
    attributesJson?: string | null;

    @Field(() => GraphQLJSONObject, { nullable: true })
    get attributes(): Record<string, string | number | 'any'> | undefined {
        if (this.attributesJson) return JSON.parse(this.attributesJson);
    }

    set attributes(attributes: Record<string, string | number | 'any'> | undefined | null) {
        if (attributes) this.attributesJson = JSON.stringify(attributes);
        else this.attributesJson = attributes;
    }

    @OneToMany(() => ProductVariantMeta, meta => meta.entity, {
        cascade: true,
    })
    metaRecords?: ProductVariantMeta[] | null;
}