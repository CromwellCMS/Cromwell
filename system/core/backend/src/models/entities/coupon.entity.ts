import { TCoupon } from '@cromwell/core';
import { Field, Int, ObjectType } from 'type-graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';

import { CustomDateScalar } from '../objects/custom-date.scalar';
import { BasePageEntity } from './base-page.entity';
import { CouponMeta } from './meta/coupon-meta.entity';

@Entity()
@ObjectType()
export class Coupon extends BasePageEntity implements TCoupon {

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255 })
    @Index()
    discountType?: 'fixed' | 'percentage' | null;

    @Field(type => Number, { nullable: true })
    @Column({ type: "float", nullable: true })
    value?: number | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255 })
    code?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 3000, nullable: true })
    description?: string | null;

    @Field(type => Boolean, { nullable: true })
    @Column({ type: "boolean", nullable: true })
    allowFreeShipping?: boolean | null;

    @Field(type => Number, { nullable: true })
    @Column({ type: "float", nullable: true })
    minimumSpend?: number | null;

    @Field(type => Number, { nullable: true })
    @Column({ type: "float", nullable: true })
    maximumSpend?: number | null;

    @Field(type => [Number], { nullable: true })
    @Column({ type: "simple-array", nullable: true })
    categoryIds?: number[] | null;

    @Field(type => [Number], { nullable: true })
    @Column({ type: "simple-array", nullable: true })
    productIds?: number[] | null;

    @Field(type => CustomDateScalar, { nullable: true })
    @Column({ type: Date, nullable: true })
    expiryDate?: Date | null;

    @Field(type => Int, { nullable: true })
    @Column({ type: "int", nullable: true })
    usageLimit?: number | null;

    @Field(type => Int, { nullable: true })
    @Column({ type: "int", nullable: true })
    usedTimes?: number | null;

    @OneToMany(() => CouponMeta, meta => meta.entity, {
        cascade: true,
    })
    metaRecords?: CouponMeta[] | null;
}