import { TBasePageEntity, TBasePageMeta } from '@cromwell/core';
import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

    @Column({ type: "varchar", nullable: true, length: 5000 })
    _meta?: string | null;

    @Field(() => BasePageMeta, { nullable: true })
    get meta(): TBasePageMeta | null | undefined {
        return this._meta ? JSON.parse(this._meta) : this._meta;
    }

    set meta(data) {
        if (data) this._meta = JSON.stringify(data);
    }

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