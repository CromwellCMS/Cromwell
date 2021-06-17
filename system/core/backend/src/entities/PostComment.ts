import { TPostComment } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BasePageEntity } from './BasePageEntity';
import { Post } from './Post';

@Entity()
@ObjectType()
export class PostComment extends BasePageEntity implements TPostComment {

    @Field(type => String, { nullable: true })
    @Index()
    @Column()
    postId: string;

    @ManyToOne(type => Post, post => post.comments, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "postId" })
    post: Post;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    title?: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    comment?: string;

    @Field(type => String, { nullable: true })
    @Index()
    @Column({ type: "varchar", nullable: true })
    userEmail?: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    userName?: string;

    @Field(type => String, { nullable: true })
    @Index()
    @Column({ type: "varchar", nullable: true })
    userId?: string;

    @Field(type => Boolean, { nullable: true })
    @Column({ type: "boolean", nullable: true })
    approved?: boolean;
}