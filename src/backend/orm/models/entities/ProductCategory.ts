import { Entity, Column } from "typeorm";
import { Tree, TreeChildren, TreeParent, TreeLevelColumn } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { ProductCategoryType } from '@cromwell/core'
import { BasePageEntity } from './BasePageEntity';

@Entity()
@Tree("closure-table")
@ObjectType()
export class ProductCategory extends BasePageEntity implements ProductCategoryType {
    @Field(() => String)
    @Column({ type: "varchar" })
    name: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar" })
    mainImage: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar" })
    description: string;

    @Field(() => [ProductCategory], { nullable: true })
    @TreeChildren()
    children: ProductCategory[];

    @Field(() => ProductCategory, { nullable: true })
    @TreeParent()
    parent: ProductCategory;

    @Field(() => Number)
    @TreeLevelColumn()
    level: number;
}