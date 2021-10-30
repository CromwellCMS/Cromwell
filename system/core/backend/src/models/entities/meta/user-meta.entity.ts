import { Field, Int } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { User } from '../user.entity';
import { BaseEntityMeta } from './base-meta.entity';

@Entity()
export class UserMeta extends BaseEntityMeta {

    @Field(() => Int)
    @Column({ type: "int" })
    entityId: number;

    @ManyToOne(() => User, entity => entity.metaRecords)
    @JoinColumn({ name: "entityId" })
    entity?: User;
}