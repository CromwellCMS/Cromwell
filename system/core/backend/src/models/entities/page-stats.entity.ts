import { TPageStats, EDBEntity } from '@cromwell/core';
import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PageStats extends BaseEntity implements TPageStats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  pageRoute: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pageName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pageId?: string;

  @Column({ type: 'integer', nullable: true })
  views: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Index()
  slug?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Index()
  entityType?: EDBEntity | string;
}
