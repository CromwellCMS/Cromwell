import { TOrder } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';

import { BasePageEntity } from './BasePageEntity';

@Entity()
@ObjectType()
export class Order extends BasePageEntity implements TOrder {
    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    status?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
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
    @Column({ type: "varchar", nullable: true })
    userId?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    customerName?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    customerPhone?: string;

    @Field(() => String, { nullable: true })
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
    customerComment?: string;

}