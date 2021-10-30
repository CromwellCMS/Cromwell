import { Field, Int } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Attribute } from '../attribute.entity';
import { BaseEntityMeta } from './base-meta.entity';

@Entity()
export class AttributeMeta extends BaseEntityMeta {

    @Field(() => Int)
    @Column({ type: "int" })
    entityId: number;

    @ManyToOne(() => Attribute, entity => entity.metaRecords)
    @JoinColumn({ name: "entityId" })
    entity?: Attribute;
}