import { Entity, Column } from "typeorm";
import { Tree, TreeChildren, TreeParent, TreeLevelColumn, ManyToMany } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { TProductCategory, TProduct, TPagedList } from '@cromwell/core';
import { BasePageEntity } from './BasePageEntity';
import { Product } from './Product';

@Entity()
@Tree("closure-table")
@ObjectType()
/** @noInheritDoc */
export class ProductCategory extends BasePageEntity implements TProductCategory {
    @Field(() => String)
    @Column({ type: "varchar" })
    name: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true, length: 300 })
    mainImage?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    description?: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    descriptionDelta?: string;

    @TreeChildren()
    children?: ProductCategory[];

    @TreeParent()
    parent?: ProductCategory | null;

    @ManyToMany(type => Product, product => product.categories)
    products?: TPagedList<TProduct>;
}