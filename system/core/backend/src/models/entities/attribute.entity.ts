import { TAttribute } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';

import { AttributeValue } from './attribute-value.entity';
import { BasePageEntity } from './base-page.entity';
import { AttributeMeta } from './meta/attribute-meta.entity';

@Entity()
@ObjectType()
export class Attribute extends BasePageEntity implements TAttribute {
  @Field((type) => String)
  @Column({ type: 'varchar', length: 255 })
  @Index()
  key?: string | null;

  @Field((type) => String, { nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string | null;

  @Field((type) => [AttributeValue])
  @OneToMany(() => AttributeValue, (value) => value.attribute, {
    cascade: true,
  })
  values?: AttributeValue[] | null;

  @Field((type) => String, { nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  type?: 'radio' | 'checkbox' | 'text_input' | null;

  @Field((type) => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 400 })
  icon?: string | null;

  @Field((type) => Boolean, { nullable: true })
  @Column({ type: 'boolean', nullable: true })
  required?: boolean | null;

  @OneToMany(() => AttributeMeta, (meta) => meta.entity, {
    cascade: true,
  })
  metaRecords?: AttributeMeta[] | null;
}
