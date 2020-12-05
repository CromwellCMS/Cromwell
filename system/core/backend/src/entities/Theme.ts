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

    @Field()
    @Column()
    isInstalled: boolean;

}