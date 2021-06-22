import { TCmsEntity, TCurrency } from '@cromwell/core';
import { Column, Entity } from 'typeorm';

import { BasePageEntity } from './BasePageEntity';

@Entity('cms')
export class CmsEntity extends BasePageEntity implements TCmsEntity {

    @Column()
    themeName?: string;

    @Column({ type: "varchar", nullable: true })
    protocol?: "http" | "https";

    @Column({ type: "integer", nullable: true })
    defaultPageSize?: number;

    @Column({ type: "integer", nullable: true })
    timezone?: number;

    @Column({ type: "varchar", nullable: true })
    language?: string;

    @Column({ type: "varchar", nullable: true, length: 300 })
    favicon?: string;

    @Column({ type: "varchar", nullable: true, length: 300 })
    logo?: string;

    @Column({ type: 'text', nullable: true })
    headHtml?: string;

    @Column({ type: 'text', nullable: true })
    footerHtml?: string;

    @Column({ type: "float", nullable: true })
    defaultShippingPrice?: number;

    public get currencies(): TCurrency[] | undefined {
        return this._currencies ? JSON.parse(this._currencies) : undefined;
    }
    public set currencies(data: TCurrency[] | undefined) {
        this._currencies = data ? JSON.stringify(data) : undefined;
    }
    @Column({ type: "text", nullable: true })
    private _currencies?: string;

    @Column({ type: "varchar", nullable: true })
    version?: string;

    @Column({ type: "varchar", nullable: true, length: 2000 })
    versions?: string;

    @Column({ type: "boolean", nullable: true })
    installed?: boolean;

    @Column({ type: "boolean", nullable: true })
    beta?: boolean;

    @Column({ type: "varchar", nullable: true, length: 400 })
    smtpConnectionString?: string;

    @Column({ type: "varchar", nullable: true })
    sendFromEmail?: string;

    @Column({ type: "boolean", nullable: true })
    isUpdating?: boolean = false;
}