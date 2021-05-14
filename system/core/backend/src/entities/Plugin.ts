import { TPluginEntity } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { BasePageEntity } from './BasePageEntity';

@Entity('plugin')
@ObjectType('Plugin')
export class PluginEntity extends BasePageEntity implements TPluginEntity {

    @Field()
    @Column()
    name: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    title?: string;

    @Field()
    @Column()
    isInstalled: boolean;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar" })
    version: string;

    @Field(type => Boolean, { nullable: true })
    @Column({ type: "boolean", nullable: true })
    hasAdminBundle?: boolean;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    settings?: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    defaultSettings?: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    moduleInfo?: string;
}