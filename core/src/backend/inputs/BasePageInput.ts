
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { BasePageEntityInputType } from '../../types';

export class BasePageInput implements BasePageEntityInputType {
    @Field(() => String)
    slug: string;

    @Field(() => String, { nullable: true })
    pageTitle: string;

    @Field(() => Boolean)
    isEnabled: boolean;
}