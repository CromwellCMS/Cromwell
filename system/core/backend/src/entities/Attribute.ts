import { TAttribute } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';

import { BasePageEntity } from './BasePageEntity';

@Entity()
@ObjectType("Attribute")
export class Attribute extends BasePageEntity implements TAttribute {
    @Field(type => String)
    @Column({ type: "varchar" })
    key: string;

    @Field(type => [String])
    @Column({ type: "simple-array" })
    values: string[];

    @Field(type => String)
    @Column({ type: "varchar" })
    type: 'radio' | 'checkbox';

}