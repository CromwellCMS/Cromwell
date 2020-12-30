import { TCmsEntity, TCurrency } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { BasePageEntity } from './BasePageEntity';

@ObjectType('CurrencySettings')
export class CurrencySettings implements TCurrency {

    @Field(type => String)
    tag: string;

    @Field(type => String, { nullable: true })
    title?: string;

    @Field(type => String, { nullable: true })
    symbol?: string;

    @Field(type => Number, { nullable: true })
    ratio?: number;

}

@Entity('cms')
@ObjectType('CMS', {
    description: 'Main CMS settings'
})
export class CmsEntity extends BasePageEntity implements TCmsEntity {

    @Field(type => String, { nullable: true })
    @Column()
    themeName?: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    protocol?: "http" | "https";

    @Field(type => Number, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    defaultPageSize?: number;


    @Field(type => [CurrencySettings])
    public get currencies(): TCurrency[] {
        return JSON.parse(this._currencies);
    }
    public set currencies(data: TCurrency[]) {
        this._currencies = JSON.stringify(data);
    }
    @Column({ type: "varchar", nullable: true })
    private _currencies: string;

}

