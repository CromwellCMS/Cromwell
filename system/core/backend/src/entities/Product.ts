import { Entity, ManyToMany, JoinTable, Column, OneToMany, ConnectionOptions, ViewColumn } from "typeorm";
import { ObjectType, Field, ID, Float } from "type-graphql";
import { TProduct, TProductCategory, TProductReview, getStoreItem, TProductRating } from '@cromwell/core';
import { BasePageEntity } from './BasePageEntity';
import { ProductCategory } from './ProductCategory';
import { ProductReview } from './ProductReview';
import { AttributeInstance } from './AttributeInstance';

@Entity()
@ObjectType()
export class Product extends BasePageEntity implements TProduct {
    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    name?: string;

    @ManyToMany(type => ProductCategory, category => category.products)
    @JoinTable()
    categories?: TProductCategory[];

    @Field(type => Number, { nullable: true })
    @Column({ type: "float", nullable: true })
    price?: number;

    @Field(type => Number, { nullable: true })
    @Column({ type: "float", nullable: true })
    oldPrice?: number;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true, length: 300 })
    mainImage?: string;

    @Field(type => [String], { nullable: true })
    @Column({ type: "simple-array", nullable: true })
    images?: string[];

    @Field(type => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    description?: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    descriptionDelta?: string;

    @OneToMany(type => ProductReview, review => review.product, {
        onDelete: "CASCADE"
    })
    reviews?: TProductReview[];

    @Field(type => [AttributeInstance], { nullable: true })
    public get attributes(): AttributeInstance[] | undefined {
        if (this.attributesJSON) return JSON.parse(this.attributesJSON);
    }

    public set attributes(data: AttributeInstance[] | undefined) {
        if (data) this.attributesJSON = JSON.stringify(data);
    }

    @Column({ type: 'text', nullable: true })
    private attributesJSON?: string;

    @Field(type => Number, { nullable: true })
    views?: number;

    /** 
     * ! Not real columns (not used at least), workaround to make SELECT count reviews:
     * https://github.com/CromwellCMS/Cromwell/blob/9eb541b1be060f792abbf4f7133071099a8633f2/system/core/backend/src/repositories/ProductRepository.ts#L39-L45
     */
    @Column({ type: "decimal", nullable: true, select: false, insert: false, readonly: true })
    averageRating?: number;

    @Column({ type: "int", nullable: true, select: false, insert: false, readonly: true })
    reviewsCount?: number;
}

@ObjectType()
export class ProductRating implements TProductRating {
    @Field(type => Number, { nullable: true })
    average?: number;

    @Field(type => Number, { nullable: true })
    reviewsNumber?: number;
}