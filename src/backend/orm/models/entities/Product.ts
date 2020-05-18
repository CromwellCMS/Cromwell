import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { ProductType } from '@cromwell/core';
import { BasePageEntity } from './BasePageEntity';

@Entity()
@ObjectType()
export class Product extends BasePageEntity implements ProductType {
    @Field(() => String)
    @Column({ type: "varchar" })
    name: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar" })
    price: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    oldPrice?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar" })
    mainImage: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "simple-array" })
    images: string[];

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar" })
    description: string;
}