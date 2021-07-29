
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { InputType, Field, ID } from "type-graphql";
import { TBasePageEntityInput } from '@cromwell/core';

@InputType()
export class BasePageInput implements TBasePageEntityInput {
    @Field(() => String, { nullable: true })
    slug?: string;

    @Field(() => String, { nullable: true })
    pageTitle?: string;

    @Field(() => String, { nullable: true })
    pageDescription?: string;

    @Field(() => Boolean, { nullable: true })
    isEnabled?: boolean;
}