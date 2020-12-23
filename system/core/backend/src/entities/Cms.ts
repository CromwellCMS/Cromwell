import { TCmsEntity } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { BasePageEntity } from './BasePageEntity';

@Entity('cms')
@ObjectType('CMS', {
    description: 'Main CMS settings'
})
export class CmsEntity extends BasePageEntity implements TCmsEntity {

    @Field()
    @Column()
    themeName: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    protocol?: "http" | "https";

    @Field(type => Number, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    defaultPageSize?: number;
}