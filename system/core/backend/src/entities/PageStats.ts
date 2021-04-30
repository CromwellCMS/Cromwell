import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PageStats extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: "varchar" })
    pageRoute: string;

    @Column({ type: "integer", nullable: true })
    views: number;
}