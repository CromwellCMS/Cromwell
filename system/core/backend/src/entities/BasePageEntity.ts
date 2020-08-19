import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { TBasePageEntity } from '@cromwell/core';

@Entity()
@ObjectType()
export class BasePageEntity extends BaseEntity implements TBasePageEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: string;

    @Field(() => String)
    @Column({ type: "varchar", unique: true, nullable: true })
    slug?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    pageTitle?: string;

    @Field(() => Date)
    @CreateDateColumn()
    createDate: Date;

    @Field(() => Date)
    @UpdateDateColumn()
    updateDate: Date;

    @Field(() => Boolean)
    @Column({ type: "boolean", default: true })
    isEnabled?: boolean;
}