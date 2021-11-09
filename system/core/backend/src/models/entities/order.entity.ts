import { TOrder } from '@cromwell/core';
import { Field, Int, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { OrderMeta } from './meta/order-meta.entity';
import { CustomDateScalar } from '../objects/custom-date.scalar';

@Entity()
@ObjectType()
export class Order extends BaseEntity implements TOrder {

    @Field(() => Int, { nullable: true })
    @Index()
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String, { nullable: true })
    @Index()
    @Column({ type: "varchar", length: 255, nullable: true })
    status?: string | null;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    cart?: string | null;

    @Field(() => Number, { nullable: true })
    @Column({ type: "float", nullable: true })
    orderTotalPrice?: number | null;

    @Field(() => Number, { nullable: true })
    @Column({ type: "float", nullable: true })
    cartTotalPrice?: number | null;

    @Field(() => Number, { nullable: true })
    @Column({ type: "float", nullable: true })
    cartOldTotalPrice?: number | null;

    @Field(() => Number, { nullable: true })
    @Column({ type: "float", nullable: true })
    shippingPrice?: number | null;

    @Field(() => Number, { nullable: true })
    @Column({ type: "float", nullable: true })
    totalQnt?: number | null;

    @Field(() => Int, { nullable: true })
    @Column({ type: "int", nullable: true })
    @Index()
    userId?: number | null;

    @Field(() => String, { nullable: true })
    @Index()
    @Column({ type: "varchar", length: 255, nullable: true })
    customerName?: string | null;

    @Field(() => String, { nullable: true })
    @Index()
    @Column({ type: "varchar", length: 255, nullable: true })
    customerPhone?: string | null;

    @Field(() => String, { nullable: true })
    @Index()
    @Column({ type: "varchar", length: 255, nullable: true })
    customerEmail?: string | null;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    customerAddress?: string | null;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    shippingMethod?: string | null;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    paymentMethod?: string | null;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 3000, nullable: true })
    customerComment?: string | null;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    currency?: string | null;

    @Field(() => CustomDateScalar, { nullable: true })
    @Index()
    @CreateDateColumn()
    createDate?: Date | null;

    @Field(() => CustomDateScalar, { nullable: true })
    @Index()
    @UpdateDateColumn()
    updateDate?: Date | null;

    @OneToMany(() => OrderMeta, meta => meta.entity, {
        cascade: true,
    })
    metaRecords?: OrderMeta[] | null;
}