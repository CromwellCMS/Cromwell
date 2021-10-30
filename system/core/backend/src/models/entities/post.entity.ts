import { TPost, TPostComment } from '@cromwell/core';
import { Field, Int, ObjectType } from 'type-graphql';
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

import { BasePageEntity } from './base-page.entity';
import { PostMeta } from './meta/post-meta.entity';
import { PostComment } from './post-comment.entity';
import { Tag } from './tag.entity';
import { User } from './user.entity';

@Entity()
@ObjectType()
export class Post extends BasePageEntity implements TPost {

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    @Index({ fulltext: true })
    title?: string | null;

    @ManyToOne(() => User, user => user.posts)
    @JoinColumn({ name: "authorId" })
    author?: User;

    @Field(type => Int, { nullable: true })
    @Column("int", { nullable: true })
    @Index()
    authorId: number;

    @Field(type => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    content?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    delta?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 5000, nullable: true })
    excerpt?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 400, nullable: true })
    mainImage?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    readTime?: string | null;

    @Field(type => [Tag], { nullable: true })
    @JoinTable()
    @ManyToMany(type => Tag)
    tags?: Tag[] | null;

    @Field(type => Boolean, { nullable: true })
    @Column({ type: "boolean", nullable: true })
    @Index()
    published?: boolean | null;

    @Field(type => Date, { nullable: true })
    @Column({ type: Date, nullable: true })
    publishDate?: Date | null;

    @OneToMany(type => PostComment, comment => comment.post, {
        onDelete: "CASCADE"
    })
    comments?: TPostComment[];

    @Field(type => Boolean, { nullable: true })
    @Column({ type: "boolean", nullable: true })
    @Index()
    featured?: boolean | null;

    @OneToMany(() => PostMeta, meta => meta.entity)
    metaRecords?: PostMeta[];
}