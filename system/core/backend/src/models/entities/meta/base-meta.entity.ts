import { Field, Int } from 'type-graphql';
import { BaseEntity, Entity, Index, PrimaryGeneratedColumn, Column } from 'typeorm';

export type TEntityMeta = {
  id: number;
  entityId?: number;
  key?: string | null;
  value?: string | null;
};

@Entity()
export class BaseEntityMeta extends BaseEntity implements TEntityMeta {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  @Index()
  key?: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  value?: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  @Index({ fulltext: true })
  shortValue?: string | null;
}
