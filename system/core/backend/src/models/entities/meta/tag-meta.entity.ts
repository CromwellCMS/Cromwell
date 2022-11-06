import { Field, Int } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Tag } from '../tag.entity';
import { BaseEntityMeta } from './base-meta.entity';

@Entity()
export class TagMeta extends BaseEntityMeta {
  @Field(() => Int)
  @Column({ type: 'int' })
  entityId: number;

  @ManyToOne(() => Tag, (entity) => entity.metaRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'entityId' })
  entity?: Tag;
}
