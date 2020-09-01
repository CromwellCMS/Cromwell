import { Entity, ManyToMany, JoinTable, Column, OneToMany, ConnectionOptions } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { TProduct, TProductCategory, TProductReview, getStoreItem, TProductRating } from '@cromwell/core';
import { BasePageEntity } from './BasePageEntity';
import { ProductCategory } from './ProductCategory';
import { ProductReview } from './ProductReview';
import { AttributeInstance } from './AttributeInstance';

@Entity()
@ObjectType()
export class Product extends BasePageEntity implements TProduct {
    @Field(type => String)
    @Column({ type: "varchar" })
    name: string;

    @ManyToMany(type => ProductCategory, category => category.products)
    @JoinTable()
    categories: TProductCategory[];

    @Field(type => Number, { nullable: true })
    @Column({ type: "float", nullable: true })
    price?: number;

    @Field(type => Number, { nullable: true })
    @Column({ type: "float", nullable: true })
    oldPrice?: number;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    mainImage?: string;

    @Field(type => [String], { nullable: true })
    @Column({ type: "simple-array", nullable: true })
    images?: string[];

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    description?: string;

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

    @Column({ type: "varchar", nullable: true })
    private attributesJSON?: string;

    @Field(type => Number, { nullable: true })
    @Column({ type: "bigint", nullable: true })
    views?: number;
}

@ObjectType()
export class ProductRating implements TProductRating {
    @Field(type => Number, { nullable: true })
    average?: number;

    @Field(type => Number, { nullable: true })
    reviewsNumber?: number;
}