import {
    TAttributeInstance,
    TProduct,
    TProductCategory,
    TProductRating,
    TProductReview,
    TStockStatus,
} from '@cromwell/core';
import { Field, Int, ObjectType } from 'type-graphql';
import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import { AttributeToProduct } from './attribute-product.entity';
import { BasePageEntity } from './base-page.entity';
import { ProductMeta } from './meta/product-meta.entity';
import { ProductCategory } from './product-category.entity';
import { ProductReview } from './product-review.entity';
import { ProductVariant } from './product-variant.entity';

@Entity()
@ObjectType()
export class Product extends BasePageEntity implements TProduct {

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    @Index({ fulltext: true })
    name?: string | null;

    @ManyToMany(type => ProductCategory, category => category.products)
    @JoinTable()
    categories?: TProductCategory[] | null;

    @Field(type => Int, { nullable: true })
    @Column({ type: "int", nullable: true })
    @Index()
    mainCategoryId?: number | null;

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

    @OneToMany(type => ProductReview, review => review.product, {
        cascade: true,
    })
    reviews?: TProductReview[] | null;

    @OneToMany(() => AttributeToProduct, attribute => attribute.product, {
        cascade: true,
    })
    attributeValues?: AttributeToProduct[] | null;

    /**
     * DB Records from `attributeValues` relation converted for frontend representation 
     */
    attributes?: TAttributeInstance[] | null;

    @OneToMany(() => ProductVariant, meta => meta.product, {
        cascade: true,
    })
    variants?: ProductVariant[] | null;

    views?: number | null;

    /** 
     * ! Not real columns, workaround to make SELECT count reviews:
     * https://github.com/CromwellCMS/Cromwell/blob/9eb541b1be060f792abbf4f7133071099a8633f2/system/core/backend/src/repositories/ProductRepository.ts#L39-L45
     */
    @Column({ type: "decimal", nullable: true, select: false, insert: false, readonly: true })
    averageRating?: number | null;

    @Column({ type: "int", nullable: true, select: false, insert: false, readonly: true })
    reviewsCount?: number | null;

    @OneToMany(() => ProductMeta, meta => meta.entity, {
        cascade: true,
    })
    metaRecords?: ProductMeta[] | null;
}

@ObjectType()
export class ProductRating implements TProductRating {
    @Field(type => Number, { nullable: true })
    average?: number;

    @Field(type => Int, { nullable: true })
    reviewsNumber?: number;
}
