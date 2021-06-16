import { TThemeEntity } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { BasePageEntity } from './BasePageEntity';

@Entity('theme')
@ObjectType('Theme')
export class ThemeEntity extends BasePageEntity implements TThemeEntity {

    @Field()
    @Column()
    name: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    version?: string;

    @Field()
    @Column()
    isInstalled: boolean;

    @Field(type => Boolean, { nullable: true })
    @Column({ type: "boolean", nullable: true })
    hasAdminBundle?: boolean;

    @Field(type => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    settings?: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    defaultSettings?: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    moduleInfo?: string;

    @Field(type => Boolean, { nullable: true })
    @Column({ type: "boolean", nullable: true })
    isUpdating?: boolean = false;
}