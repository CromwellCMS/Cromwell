import { TPost } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { Author } from './Author';
import { BasePageEntity } from './BasePageEntity';

@Entity()
@ObjectType()
export class Post extends BasePageEntity implements TPost {
  @Field()
  @Column({ type: "varchar" })
  title: string;

  @Column()
  authorId: string;

  @Field()
  author: Author;

  @Field()
  @Column()
  content: string;

  @Field()
  @Column()
  mainImage: string;

  @Field()
  @Column()
  description: string;
  
}