import { TOrder } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Order extends BaseEntity implements TOrder {

    @Field(() => String, { nullable: true })
    @Index()
    @PrimaryGeneratedColumn()
    id: string;

    @Field(() => String, { nullable: true })
    @Index()
    @Column({ type: "varchar", nullable: true })
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

    @Field(() => String, { nullable: true })
    @Index()
    @Column({ type: "varchar", nullable: true })
    userId?: string;

    @Field(() => String, { nullable: true })
    @Index()
    @Column({ type: "varchar", nullable: true })
    customerName?: string;

    @Field(() => String, { nullable: true })
    @Index()
    @Column({ type: "varchar", nullable: true })
    customerPhone?: string;

    @Field(() => String, { nullable: true })
    @Index()
    @Column({ type: "varchar", nullable: true })
    customerEmail?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    customerAddress?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    shippingMethod?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    paymentMethod?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    customerComment?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    currency?: string;

    @Field(() => Date)
    @Index()
    @CreateDateColumn()
    createDate: Date;

    @Field(() => Date)
    @Index()
    @UpdateDateColumn()
    updateDate: Date;
}