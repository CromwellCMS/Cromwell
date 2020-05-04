import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ObjectType, Field, ID, Int } from "type-graphql";
import { Author } from './Author';

@Entity()
@ObjectType()
export class Post extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column()
  title: string;

  @Column()
  authorId: string;

  @Field()
  author: Author;

  @Field()
  @Column()
  content: string;

  @Field()
  @Column({ default: false })
  isPublished: boolean;

}