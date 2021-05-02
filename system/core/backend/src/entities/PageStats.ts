import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TPageStats } from '@cromwell/core';

@Entity()
export class PageStats extends BaseEntity implements TPageStats {

    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: "varchar" })
    pageRoute: string;

    @Column({ type: "integer", nullable: true })
    views: number;

    @Column({ type: "varchar", nullable: true })
    productSlug?: string;

    @Column({ type: "varchar", nullable: true })
    categorySlug?: string;

    @Column({ type: "varchar", nullable: true })
    postSlug?: string;

    @Column({ type: "varchar", nullable: true })
    tagSlug?: string;
}



