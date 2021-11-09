import { TProductReview } from '@cromwell/core';
import { Field, Int, ObjectType } from 'type-graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BasePageEntity } from './base-page.entity';
import { Product } from './product.entity';

@Entity()
@ObjectType()
export class ProductReview extends BasePageEntity implements TProductReview {

    @Field(type => Int, { nullable: true })
    @Column("int", { nullable: true })
    @Index()
    productId?: number | null;

    @ManyToOne(type => Product, product => product.reviews, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "productId" })
    product?: Product | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    @Index()
    title?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    description?: string | null;

    @Field(type => Number, { nullable: true })
    @Index()
    @Column({ type: "float", nullable: true })
    rating?: number | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    @Index()
    userEmail?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    userName?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    @Index()
    userId?: number | null;

    @Field(type => Boolean, { nullable: true })
    @Column({ type: "boolean", nullable: true })
    @Index()
    approved?: boolean | null;
}