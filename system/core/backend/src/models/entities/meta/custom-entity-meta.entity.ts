import { Field, Int } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CustomEntity } from '../custom-entity.entity';
import { BaseEntityMeta } from './base-meta.entity';

@Entity()
export class CustomEntityMeta extends BaseEntityMeta {

    @Field(() => Int)
    @Column({ type: "int" })
    entityId: number;

    @ManyToOne(() => CustomEntity, entity => entity.metaRecords, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "entityId" })
    entity?: CustomEntity;
}