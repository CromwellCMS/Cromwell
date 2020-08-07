
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { InputType, Field, ID } from "type-graphql";
import { BasePageEntityInputType } from '@cromwell/core';

@InputType()
export class BasePageInput implements BasePageEntityInputType {
    @Field(() => String, { nullable: true })
    slug?: string;

    @Field(() => String, { nullable: true })
    pageTitle?: string;

    @Field(() => Boolean, { nullable: true })
    isEnabled?: boolean;
}