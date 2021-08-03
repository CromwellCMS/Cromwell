import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TPageStats } from '@cromwell/core';

@Entity()
export class PageStats extends BaseEntity implements TPageStats {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: "varchar" })
    pageRoute: string;

    @Column({ type: "varchar", nullable: true })
    pageName?: string;

    @Column({ type: "varchar", nullable: true })
    pageId?: string;

    @Column({ type: "integer", nullable: true })
    views: number;
}



