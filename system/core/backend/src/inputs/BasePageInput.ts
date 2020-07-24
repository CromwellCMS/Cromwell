
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { BasePageEntityInputType } from '@cromwell/core';

export class BasePageInput implements BasePageEntityInputType {
    @Field(() => String, { nullable: true })
    slug?: string;

    @Field(() => String, { nullable: true })
    pageTitle?: string;

    @Field(() => Boolean, { nullable: true })
    isEnabled?: boolean;
}