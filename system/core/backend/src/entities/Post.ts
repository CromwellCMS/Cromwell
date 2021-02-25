import { TPost } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './User';
import { BasePageEntity } from './BasePageEntity';

@Entity()
@ObjectType()
export class Post extends BasePageEntity implements TPost {
  @Field(type => String, { nullable: true })
  @Column({ type: "varchar", nullable: true })
  title?: string | null;

  @Column()
  authorId: string;

  @Field(type => String, { nullable: true })
  @Column({ type: "varchar", nullable: true })
  content?: string | null;

  @Field(type => String, { nullable: true })
  @Column({ type: "varchar", nullable: true })
  delta?: string | null;

  @Field(type => String, { nullable: true })
  @Column({ type: "varchar", nullable: true })
  mainImage?: string | null;

  @Field(type => [String], { nullable: true })
  @Column({ type: "simple-array", nullable: true })
  tags?: string[] | null;

  @Field(type => Boolean, { nullable: true })
  @Column({ type: "boolean", nullable: true })
  isPublished?: boolean | null;
}