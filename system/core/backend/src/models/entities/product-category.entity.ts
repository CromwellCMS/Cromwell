import { TPagedList, TProduct, TProductCategory } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index, ManyToMany, OneToMany, Tree, TreeChildren, TreeParent } from 'typeorm';

import { BasePageEntity } from './base-page.entity';
import { ProductCategoryMeta } from './meta/product-category-meta.entity';
import { Product } from './product.entity';

@Entity()
@Tree('closure-table')
@ObjectType()
export class ProductCategory extends BasePageEntity implements TProductCategory {
  @Field(() => String)
  @Column({ type: 'varchar', length: 255, nullable: true })
  @Index({ fulltext: true })
  name?: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 400 })
  mainImage?: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Field((type) => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  descriptionDelta?: string | null;

  @TreeChildren()
  children?: ProductCategory[] | null;

  @TreeParent()
  parent?: ProductCategory | null;

  @ManyToMany((type) => Product, (product) => product.categories)
  products?: TPagedList<TProduct> | null;

  @OneToMany((type) => Product, (product) => product.mainCategory, {
    cascade: ['update'],
  })
  mainProducts?: Product[];

  @OneToMany(() => ProductCategoryMeta, (meta) => meta.entity, {
    cascade: true,
  })
  metaRecords?: ProductCategoryMeta[] | null;
}
