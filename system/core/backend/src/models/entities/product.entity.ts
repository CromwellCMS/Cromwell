import { TProduct, TProductCategory, TProductRating, TProductReview } from '@cromwell/core';
import { Field, Int, ObjectType } from 'type-graphql';
import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import { AttributeToProduct } from './attribute-product.entity';
import { BasePageEntity } from './base-page.entity';
import { ProductMeta } from './meta/product-meta.entity';
import { ProductCategory } from './product-category.entity';
import { ProductReview } from './product-review.entity';

@Entity()
@ObjectType()
export class Product extends BasePageEntity implements TProduct {

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    @Index({ fulltext: true })
    name?: string;

    @ManyToMany(type => ProductCategory, category => category.products)
    @JoinTable()
    categories?: TProductCategory[];

    @Field(type => Int, { nullable: true })
    @Column({ type: "int", nullable: true })
    @Index()
    mainCategoryId?: number;

    @Field(type => Number, { nullable: true })
    @Column({ type: "float", nullable: true })
    @Index()
    price?: number;

    @Field(type => Number, { nullable: true })
    @Column({ type: "float", nullable: true })
    @Index()
    oldPrice?: number;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    @Index({ fulltext: true })
    sku?: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 400, nullable: true })
    mainImage?: string;

    @Field(type => [String], { nullable: true })
    @Column({ type: "simple-array", nullable: true })
    images?: string[];

    @Field(type => Int, { nullable: true })
    @Column({ type: "int", nullable: true })
    @Index()
    stockAmount?: number;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    @Index()
    stockStatus?: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    description?: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    descriptionDelta?: string;

    @OneToMany(type => ProductReview, review => review.product, {
        cascade: true,
    })
    reviews?: TProductReview[];

    @OneToMany(() => AttributeToProduct, attribute => attribute.product, {
        cascade: true,
    })
    attributeValues?: AttributeToProduct[];

    views?: number;

    /** 
     * ! Not real columns, workaround to make SELECT count reviews:
     * https://github.com/CromwellCMS/Cromwell/blob/9eb541b1be060f792abbf4f7133071099a8633f2/system/core/backend/src/repositories/ProductRepository.ts#L39-L45
     */
    @Column({ type: "decimal", nullable: true, select: false, insert: false, readonly: true })
    averageRating?: number;

    @Column({ type: "int", nullable: true, select: false, insert: false, readonly: true })
    reviewsCount?: number;

    @OneToMany(() => ProductMeta, meta => meta.entity, {
        cascade: true,
    })
    metaRecords?: ProductMeta[];
}

@ObjectType()
export class ProductRating implements TProductRating {
    @Field(type => Number, { nullable: true })
    average?: number;

    @Field(type => Int, { nullable: true })
    reviewsNumber?: number;
}