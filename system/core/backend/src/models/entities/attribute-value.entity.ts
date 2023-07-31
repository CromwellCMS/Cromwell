import { TAttributeValue } from '@cromwell/core';
import { Field, Int, ObjectType } from 'type-graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Attribute } from './attribute.entity';
import { BasePageEntity } from './base-page.entity';
import { AttributeToProduct } from './attribute-product.entity';

@Entity()
@ObjectType()
export class AttributeValue extends BasePageEntity implements TAttributeValue {
  @Field(() => Int)
  @Column({ type: 'int' })
  @Index()
  attributeId: number;

  @ManyToOne(() => Attribute, (attribute) => attribute.values, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attributeId' })
  attribute?: Attribute;

  @Field((type) => String)
  @Column({ type: 'varchar', length: 255 })
  @Index()
  key: string;

  @Field((type) => String)
  @Column({ type: 'varchar', length: 255, nullable: true })
  value: string;

  @Field((type) => String, { nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string;

  @Field((type) => String, { nullable: true })
  @Column({ type: 'varchar', length: 400, nullable: true })
  icon?: string;

  @OneToMany(() => AttributeToProduct, (attribute) => attribute.attributeValue, {
    cascade: true,
  })
  attributeToProduct?: AttributeToProduct[];
}
