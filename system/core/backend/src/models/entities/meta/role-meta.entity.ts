import { Field, Int } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Role } from '../role.entity';
import { BaseEntityMeta } from './base-meta.entity';

@Entity()
export class RoleMeta extends BaseEntityMeta {

    @Field(() => Int)
    @Column({ type: "int" })
    entityId: number;

    @ManyToOne(() => Role, entity => entity.metaRecords, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "entityId" })
    entity?: Role;
}