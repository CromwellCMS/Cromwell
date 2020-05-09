import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { ProductType } from '@cromwell/core'

@Entity()
@ObjectType()
export class Product extends BaseEntity implements ProductType {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: string;

    @Field(() => String)
    @Column()
    slug: string;

    @Field(() => String)
    @Column()
    pageTitle: string;

    @Field(() => String)
    @Column()
    name: string;

    @Field(() => String)
    @Column()
    price: string;

    @Field(type => String, { nullable: true })
    @Column({ nullable: true })
    oldPrice?: string;

    @Field(() => String)
    @Column()
    mainImage: string;

    @Field(() => String)
    @Column()
    images: string;

    @Field(() => String)
    @Column()
    description: string;

    @Field(() => Boolean)
    @Column({ default: false })
    isEnabled: boolean;
}