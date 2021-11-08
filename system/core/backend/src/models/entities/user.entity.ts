import { TUser, TUserRole } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BasePageEntity } from './base-page.entity';
import { UserMeta } from './meta/user-meta.entity';
import { Post } from './post.entity';

@Entity()
@ObjectType()
export class User extends BasePageEntity implements TUser {

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    @Index({ fulltext: true })
    fullName: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true, unique: true })
    @Index('IDX_user.entity_email', { fulltext: true })
    email: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    avatar?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    bio?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 50, nullable: true })
    @Index()
    role?: TUserRole;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true, length: 1000 })
    address?: string;

    @Field(() => String, { nullable: true })
    @Index({ fulltext: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    phone?: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    password: string;

    @Column({ type: "varchar", nullable: true, length: 5000 })
    refreshTokens?: string | null;

    // A secret code sent to user e-mail to reset his password
    @Column({ type: "varchar", length: 255, nullable: true })
    resetPasswordCode?: string | null;

    // A date when resetPasswordCode was generated
    @Column({ type: Date, nullable: true })
    resetPasswordDate?: Date | null;

    @OneToMany(() => Post, post => post.author, {
        cascade: ['update']
    })
    posts: Post[];

    @OneToMany(() => UserMeta, meta => meta.entity, {
        cascade: true,
    })
    metaRecords?: UserMeta[];
}
