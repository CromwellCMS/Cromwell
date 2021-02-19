import { TPost } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './User';
import { BasePageEntity } from './BasePageEntity';

@Entity()
@ObjectType()
export class Post extends BasePageEntity implements TPost {
  @Field()
  @Column({ type: "varchar" })
  title?: string;

  @Column()
  authorId: string;

  @Field()
  @Column()
  content?: string;

  @Field()
  @Column()
  delta?: string;
  
  @Field()
  @Column()
  mainImage?: string;

  @Field()
  @Column()
  isPublished?: boolean;
}