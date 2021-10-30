import { Field, Int } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Post } from '../post.entity';
import { BaseEntityMeta } from './base-meta.entity';

@Entity()
export class PostMeta extends BaseEntityMeta {

    @Field(() => Int)
    @Column({ type: "int" })
    entityId: number;

    @ManyToOne(() => Post, entity => entity.metaRecords)
    @JoinColumn({ name: "entityId" })
    entity?: Post;
}