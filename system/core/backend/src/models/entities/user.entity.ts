import { TUser, TUserRole } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, Index } from 'typeorm';

import { BasePageEntity } from './base-page.entity';

@Entity()
@ObjectType()
/** @noInheritDoc */
export class User extends BasePageEntity implements TUser {

    @Field(() => String, { nullable: true })
    @Index()
    @Column({ type: "varchar", nullable: true })
    fullName: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true, unique: true })
    email: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    avatar?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true, length: 6000 })
    bio?: string;

    @Field(() => String, { nullable: true })
    @Index()
    @Column({ type: "varchar", nullable: true })
    role?: TUserRole;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true, length: 1000 })
    address?: string;

    @Field(() => String, { nullable: true })
    @Index()
    @Column({ type: "varchar", nullable: true })
    phone?: string;

    @Column({ type: "varchar", nullable: false })
    password: string;

    /**
     * Stringified array of Refresh tokens. We create one token per client during log-in
     * And then update them in this array on refresh Access token
     */
    @Column({ type: "varchar", nullable: true, length: 500 })
    refreshToken?: string | null;

    // A secret code sent to user e-mail to reset his password
    @Column({ type: "varchar", nullable: true })
    resetPasswordCode?: string | null;

    // A date when resetPasswordCode was generated
    @Column({ type: "datetime", nullable: true })
    resetPasswordDate?: Date | null;
}
