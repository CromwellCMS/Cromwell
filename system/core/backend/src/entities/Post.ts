import { TPost, TPostComment } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import { BasePageEntity } from './BasePageEntity';
import { PostComment } from './PostComment';
import { Tag } from './Tag';

@Entity()
@ObjectType()
export class Post extends BasePageEntity implements TPost {

    @Field(type => String, { nullable: true })
    @Index()
    @Column({ type: "varchar", nullable: true })
    title?: string | null;

    @Index()
    @Column()
    authorId: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    content?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    delta?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true, length: 5000 })
    excerpt?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true, length: 300 })
    mainImage?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    readTime?: string | null;

    @Field(type => [Tag], { nullable: true })
    @JoinTable()
    @ManyToMany(type => Tag)
    tags?: Tag[] | null;

    @Field(type => Boolean, { nullable: true })
    @Index()
    @Column({ type: "boolean", nullable: true })
    published?: boolean | null;

    @Field(type => Date, { nullable: true })
    @Column({ type: "datetime", nullable: true })
    publishDate?: Date | null;

    @OneToMany(type => PostComment, comment => comment.post, {
        onDelete: "CASCADE"
    })
    comments?: TPostComment[];
}