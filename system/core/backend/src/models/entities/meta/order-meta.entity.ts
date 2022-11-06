import { Field, Int } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Order } from '../order.entity';
import { BaseEntityMeta } from './base-meta.entity';

@Entity()
export class OrderMeta extends BaseEntityMeta {
  @Field(() => Int)
  @Column({ type: 'int' })
  entityId: number;

  @ManyToOne(() => Order, (entity) => entity.metaRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'entityId' })
  entity?: Order;
}
