import { TThemeEntity } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { BasePageEntity } from './base-page.entity';

@Entity('theme')
@ObjectType('Theme')
export class ThemeEntity extends BasePageEntity implements TThemeEntity {

    @Field()
    @Column()
    name?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    version?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    title?: string | null;

    @Field()
    @Column()
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