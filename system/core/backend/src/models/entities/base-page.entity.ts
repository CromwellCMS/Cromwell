import { TBasePageEntity, TBasePageMeta } from '@cromwell/core';
import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { CustomDateScalar } from '../objects/custom-date.scalar';

@ObjectType()
export class BasePageMeta implements TBasePageMeta {
    @Field(() => [String], { nullable: true })
    keywords?: string[];

    @Field(() => String, { nullable: true })
    socialImage?: string;
}

@Entity()
@ObjectType()
export class BasePageEntity extends BaseEntity implements TBasePageEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 255, unique: true, nullable: true })
    slug?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 2000, nullable: true })
    pageTitle?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 4000, nullable: true })
    pageDescription?: string;

    @Column({ type: "text", nullable: true })
    _meta?: string | null;

    @Field(() => BasePageMeta, { nullable: true })
    get meta(): TBasePageMeta | null | undefined {
        return this._meta ? JSON.parse(this._meta) : this._meta;
    }

    set meta(data) {
        if (data) this._meta = JSON.stringify(data);
    }

    @Field(() => CustomDateScalar, { nullable: true })
    @CreateDateColumn()
    @Index()
    createDate: Date;

    @Field(() => CustomDateScalar, { nullable: true })
    @UpdateDateColumn()
    @Index()
    updateDate: Date;

    @Field(() => Boolean, { nullable: true })
    @Column({ type: "boolean", default: true, nullable: true })
    isEnabled?: boolean;
}