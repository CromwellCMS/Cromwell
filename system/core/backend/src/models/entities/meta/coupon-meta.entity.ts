import { Field, Int } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Coupon } from '../coupon.entity';
import { BaseEntityMeta } from './base-meta.entity';

@Entity()
export class CouponMeta extends BaseEntityMeta {
  @Field(() => Int)
  @Column({ type: 'int' })
  entityId: number;

  @ManyToOne(() => Coupon, (entity) => entity.metaRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'entityId' })
  entity?: Coupon;
}
