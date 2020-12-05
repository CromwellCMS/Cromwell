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

    @Field()
    @Column()
    isInstalled: boolean;

}