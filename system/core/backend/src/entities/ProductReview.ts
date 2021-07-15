import { TProductReview } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BasePageEntity } from './BasePageEntity';
import { Product } from './Product';

@Entity()
@ObjectType()
/** @noInheritDoc */
export class ProductReview extends BasePageEntity implements TProductReview {

    @Field(type => String, { nullable: true })
    @Index()
    @Column()
    productId: string;

    @ManyToOne(type => Product, product => product.reviews, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "productId" })
    product: Product;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    title?: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    description?: string;

    @Field(type => Number, { nullable: true })
    @Index()
    @Column({ type: "float", nullable: true })
    rating?: number;

    @Field(type => String, { nullable: true })
    @Index()
    @Column({ type: "varchar", nullable: true })
    userEmail?: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    userName?: string;

    @Field(type => String, { nullable: true })
    @Index()
    @Column({ type: "varchar", nullable: true })
    userId?: string;

    @Field(type => Boolean, { nullable: true })
    @Index()
    @Column({ type: "boolean", nullable: true })
    approved?: boolean;
}