import { Entity, ManyToMany, JoinTable, Column } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { TProduct, TProductCategory } from '@cromwell/core';
import { BasePageEntity } from './BasePageEntity';
import { ProductCategory } from './ProductCategory';

@Entity()
@ObjectType()
export class Product extends BasePageEntity implements TProduct {
    @Field(() => String)
    @Column({ type: "varchar" })
    name: string = 'privprivvvfff';

    @ManyToMany(type => ProductCategory, category => category.products)
    @JoinTable()
    categories: TProductCategory[];

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    price: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    oldPrice: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    mainImage: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "simple-array", nullable: true })
    images: string[];

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    description: string;

    @Field(() => Number, { nullable: true })
    @Column({ type: "float", nullable: true })
    rating: number;
}