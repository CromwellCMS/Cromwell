import { TAttribute, TAttributeValue } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { BasePageEntity } from './BasePageEntity';

@ObjectType("AttributeValue")
export class AttributeValue implements TAttributeValue {
    @Field(type => String)
    value: string;

    @Field(type => String, { nullable: true })
    title?: string;

    @Field(type => String, { nullable: true })
    icon?: string;
}

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

    @Column({ type: 'text', nullable: true })
    private valuesJSON: string;

    @Field(type => String)
    @Column({ type: "varchar" })
    type: 'radio' | 'checkbox';

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true, length: 300 })
    icon?: string;

    @Field(type => Boolean, { nullable: true })
    @Column({ type: "boolean", nullable: true })
    required?: boolean;
}