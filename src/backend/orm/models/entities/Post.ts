import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ObjectType, Field, ID, Int } from "type-graphql";
import { Author } from './Author';
import { BasePageEntity } from './BasePageEntity';
import { PostType } from "@cromwell/core";

@Entity()
@ObjectType()
export class Post extends BasePageEntity implements PostType {
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