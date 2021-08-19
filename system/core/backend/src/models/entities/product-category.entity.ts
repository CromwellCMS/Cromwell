import { TPagedList, TProduct, TProductCategory } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index, ManyToMany, Tree, TreeChildren, TreeParent } from 'typeorm';

import { BasePageEntity } from './base-page.entity';
import { Product } from './product.entity';

@Entity()
@Tree("closure-table")
@ObjectType()
export class ProductCategory extends BasePageEntity implements TProductCategory {
    @Field(() => String)
    @Column({ type: "varchar" })
    @Index()
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