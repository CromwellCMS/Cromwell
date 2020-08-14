import { TAttribute, TAttributeValue } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { BasePageEntity } from './BasePageEntity';

@Entity()
@ObjectType("Attribute")
export class Attribute extends BasePageEntity implements TAttribute {
    @Field(type => String)
    @Column({ type: "varchar" })
    key: string;

    @Field(type => [AttributeValue])
    public get values(): AttributeValue[] {
        return JSON.parse(this.valuesJSON);
    }

    public set values(data: AttributeValue[]) {
        this.valuesJSON = JSON.stringify(data);
    }

    @Column({ type: "varchar", nullable: true })
    private valuesJSON: string;

    @Field(type => String)
    @Column({ type: "varchar" })
    type: 'radio' | 'checkbox';

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    icon?: string;

}

@ObjectType("AttributeValue")
export class AttributeValue implements TAttributeValue {
    @Field(type => String)
    value: string;

    @Field(type => String, { nullable: true })
    icon?: string;

}