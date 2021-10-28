import { TEntityMeta } from '@cromwell/core';
import { Field } from 'type-graphql';
import { BaseEntity, Entity, Index, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class EntityMeta extends BaseEntity implements TEntityMeta {

    @Field(() => String)
    @Index()
    @PrimaryGeneratedColumn()
    id: string;

    @Field(() => String)
    @Column({ type: "varchar" })
    @Index()
    entityMetaId: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    @Index()
    key?: string | null;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true, length: 15000 })
    @Index()
    value?: string | null;
}
