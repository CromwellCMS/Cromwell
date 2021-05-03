import { TPost, TPostComment } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import { BasePageEntity } from './BasePageEntity';
import { PostComment } from './PostComment';
import { Tag } from './Tag';

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
    excerpt?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    mainImage?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    readTime?: string | null;

    @Field(type => [Tag], { nullable: true })
    @JoinTable()
    @ManyToMany(type => Tag)
    tags?: Tag[] | null;

    @Field(type => Boolean, { nullable: true })
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