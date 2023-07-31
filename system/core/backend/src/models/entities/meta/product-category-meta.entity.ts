import { Field, Int } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ProductCategory } from '../product-category.entity';
import { BaseEntityMeta } from './base-meta.entity';

@Entity()
export class ProductCategoryMeta extends BaseEntityMeta {
  @Field(() => Int)
  @Column({ type: 'int' })
  entityId: number;

  @ManyToOne(() => ProductCategory, (entity) => entity.metaRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'entityId' })
  entity?: ProductCategory;
}
