import { TCustomEntity } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BasePageEntity } from './base-page.entity';
import { CustomEntityMeta } from './meta/custom-entity-meta.entity';

@Entity()
@ObjectType()
export class CustomEntity extends BasePageEntity implements TCustomEntity {

    @Field(type => String)
    @Column({ type: "varchar", length: 255 })
    @Index()
    entityType: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    @Index()
    name?: string;

    @OneToMany(() => CustomEntityMeta, meta => meta.entity, {
        cascade: true,
    })
    metaRecords?: CustomEntityMeta[];
}