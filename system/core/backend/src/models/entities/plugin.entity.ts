import { TPluginEntity } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { BasePageEntity } from './base-page.entity';

@Entity('plugin')
@ObjectType('Plugin')
export class PluginEntity extends BasePageEntity implements TPluginEntity {

    @Field(type => String)
    @Column({ type: "varchar", length: 255 })
    name?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    version?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    title?: string | null;

    @Field(type => Boolean, { nullable: true })
    @Column({ type: "boolean" })
    isInstalled?: boolean | null;

    @Field(type => Boolean, { nullable: true })
    @Column({ type: "boolean", nullable: true })
    hasAdminBundle?: boolean | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    settings?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    defaultSettings?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    moduleInfo?: string | null;

    @Field(type => Boolean, { nullable: true })
    @Column({ type: "boolean", nullable: true })
    isUpdating?: boolean | null = false;
}