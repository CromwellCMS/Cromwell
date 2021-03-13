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
    @Column({ type: "integer", nullable: true })
    defaultPageSize?: number;

    @Field(type => Number, { nullable: true })
    @Column({ type: "integer", nullable: true })
    timezone?: number;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    language?: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    favicon?: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    logo?: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    headerHtml?: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    footerHtml?: string;

    @Field(type => [CurrencySettings])
    public get currencies(): TCurrency[] | undefined {
        return this._currencies ? JSON.parse(this._currencies) : undefined;
    }
    public set currencies(data: TCurrency[] | undefined) {
        this._currencies = data ? JSON.stringify(data) : undefined;
    }
    @Column({ type: "varchar", nullable: true })
    private _currencies?: string;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    versions?: string;

    @Field(type => Boolean, { nullable: true })
    @Column({ type: "boolean", nullable: true })
    installed?: boolean;
}

