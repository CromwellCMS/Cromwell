import { TTag } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BasePageEntity } from './base-page.entity';
import { TagMeta } from './meta/tag-meta.entity';

@Entity()
@ObjectType()
export class Tag extends BasePageEntity implements TTag {

    @Field(type => String)
    @Column({ type: "varchar", length: 255, nullable: true })
    @Index({ fulltext: true })
    name: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    color?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    image?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    description?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    descriptionDelta?: string | null;

    @OneToMany(() => TagMeta, meta => meta.entity)
    metaRecords?: TagMeta[];
}