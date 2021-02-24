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
    @Column({ type: "varchar", nullable: true })
    email: string;

    @Column()
    password: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    avatar?: string;
}