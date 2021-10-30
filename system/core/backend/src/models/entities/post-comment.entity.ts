import { TPostComment } from '@cromwell/core';
import { Field, Int, ObjectType } from 'type-graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BasePageEntity } from './base-page.entity';
import { Post } from './post.entity';

@Entity()
@ObjectType()
export class PostComment extends BasePageEntity implements TPostComment {

    @Field(type => Int, { nullable: true })
    @Column({ type: "int", nullable: true })
    @Index()
    postId: number;

    @ManyToOne(type => Post, post => post.comments, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "postId" })
    post: Post;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 400, nullable: true })
    title?: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    comment?: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    @Index()
    userEmail?: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    userName?: string;

    @Field(type => Int, { nullable: true })
    @Column({ type: "int", nullable: true })
    @Index()
    userId?: number;

    @Field(type => Boolean, { nullable: true })
    @Column({ type: "boolean", nullable: true })
    approved?: boolean;
}