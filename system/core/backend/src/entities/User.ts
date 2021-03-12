import { TUser } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';

import { BasePageEntity } from './BasePageEntity';

@Entity()
@ObjectType()
export class User extends BasePageEntity implements TUser {

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    fullName: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true, unique: true })
    email: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    avatar?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    location?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    bio?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    role?: 'admin' | 'author' | 'customer';

    @Column()
    password: string;

    /**
     * Stringified array of Refresh tokens. We create one token per client during log-in
     * And then update them in this array on refresh Access token
     */
    @Column({ type: "varchar", nullable: true })
    refreshTokens?: string | null;
}