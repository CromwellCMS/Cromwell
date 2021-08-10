import { Entity, BaseEntity, Index, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { TBasePageEntity } from '@cromwell/core';

@Entity()
@ObjectType()
export class BasePageEntity extends BaseEntity implements TBasePageEntity {

    @Field(() => ID)
    @Index()
    @PrimaryGeneratedColumn()
    id: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", unique: true, nullable: true })
    slug?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    pageTitle?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    pageDescription?: string;

    @Field(() => Date)
    @Index()
    @CreateDateColumn()
    createDate: Date;

    @Field(() => Date)
    @Index()
    @UpdateDateColumn()
    updateDate: Date;

    @Field(() => Boolean, { nullable: true })
    @Column({ type: "boolean", default: true, nullable: true })
    isEnabled?: boolean;
}