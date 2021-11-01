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
    status?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    cart?: string;

    @Field(() => Number, { nullable: true })
    @Column({ type: "float", nullable: true })
    orderTotalPrice?: number;

    @Field(() => Number, { nullable: true })
    @Column({ type: "float", nullable: true })
    cartTotalPrice?: number;

    @Field(() => Number, { nullable: true })
    @Column({ type: "float", nullable: true })
    cartOldTotalPrice?: number;

    @Field(() => Number, { nullable: true })
    @Column({ type: "float", nullable: true })
    shippingPrice?: number;

    @Field(() => Number, { nullable: true })
    @Column({ type: "float", nullable: true })
    totalQnt?: number;

    @Field(() => Int, { nullable: true })
    @Column({ type: "int", nullable: true })
    @Index()
    userId?: number;

    @Field(() => String, { nullable: true })
    @Index()
    @Column({ type: "varchar", length: 255, nullable: true })
    customerName?: string;

    @Field(() => String, { nullable: true })
    @Index()
    @Column({ type: "varchar", length: 255, nullable: true })
    customerPhone?: string;

    @Field(() => String, { nullable: true })
    @Index()
    @Column({ type: "varchar", length: 255, nullable: true })
    customerEmail?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    customerAddress?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    shippingMethod?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    paymentMethod?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 3000, nullable: true })
    customerComment?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    currency?: string;

    @Field(() => Date)
    @Index()
    @CreateDateColumn()
    createDate: Date;

    @Field(() => Date)
    @Index()
    @UpdateDateColumn()
    updateDate: Date;

    @OneToMany(() => OrderMeta, meta => meta.entity, {
        cascade: true,
    })
    metaRecords?: OrderMeta[];
}