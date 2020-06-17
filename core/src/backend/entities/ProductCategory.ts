import { Entity, Column } from "typeorm";
import { Tree, TreeChildren, TreeParent, TreeLevelColumn, ManyToMany } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { ProductCategoryType, ProductType } from '../../types';
import { BasePageEntity } from './BasePageEntity';
import { Product } from './Product';

@Entity()
@Tree("closure-table")
@ObjectType()
export class ProductCategory extends BasePageEntity implements ProductCategoryType {
    @Field(() => String)
    @Column({ type: "varchar" })
    name: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    mainImage: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    description: string;

    @Field(() => [ProductCategory], { nullable: true })
    @TreeChildren()
    children: ProductCategory[];

    @Field(() => ProductCategory, { nullable: true })
    @TreeParent()
    parent: ProductCategory;

    // @Field(() => Number)
    // @TreeLevelColumn()
    // level: number;

    @ManyToMany(type => Product, question => question.categories)
    products: ProductType[];
}