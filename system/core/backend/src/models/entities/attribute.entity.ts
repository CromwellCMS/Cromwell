import { TAttribute } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';

import { AttributeValue } from './attribute-value.entity';
import { BasePageEntity } from './base-page.entity';
import { AttributeMeta } from './meta/attribute-meta.entity';

@Entity()
@ObjectType()
export class Attribute extends BasePageEntity implements TAttribute {

    @Field(type => String)
    @Column({ type: "varchar", length: 255 })
    @Index()
    key: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    title?: string;

    @Field(type => [AttributeValue])
    @OneToMany(() => AttributeValue, value => value.attribute, {
        onDelete: "CASCADE"
    })
    values: AttributeValue[];

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    type: 'radio' | 'checkbox';

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true, length: 400 })
    icon?: string;

    @Field(type => Boolean, { nullable: true })
    @Column({ type: "boolean", nullable: true })
    required?: boolean;

    @OneToMany(() => AttributeMeta, meta => meta.entity, {
        onDelete: "CASCADE"
    })
    metaRecords?: AttributeMeta[];
}