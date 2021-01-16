import { TUser } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, OneToMany } from 'typeorm';

import { BasePageEntity } from './BasePageEntity';
import { Post } from './Post';

@Entity()
@ObjectType()
export class User extends BasePageEntity implements TUser {

    @Field(() => String)
    @Column()
    fullName: string;

    @Field()
    @Column()
    email: string;

    @Column()
    password: string;

    @Field()
    @Column({ type: "varchar", nullable: true })
    avatar?: string;
}