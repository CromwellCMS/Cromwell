import { TPost } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './User';
import { BasePageEntity } from './BasePageEntity';

@Entity()
@ObjectType()
export class Post extends BasePageEntity implements TPost {
  @Field()
  @Column({ type: "varchar" })
  title: string;

  @Column()
  authorId: string;

  @Field(type => User, { nullable: true })
  @OneToOne(() => User)
  @JoinColumn()
  author: User;

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