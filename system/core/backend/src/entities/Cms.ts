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

    @Column({ type: "varchar", nullable: true })
    favicon?: string;

    @Column({ type: "varchar", nullable: true })
    logo?: string;

    @Column({ type: "varchar", nullable: true })
    headerHtml?: string;

    @Column({ type: "varchar", nullable: true })
    footerHtml?: string;

    @Column({ type: "float", nullable: true })
    defaultShippingPrice?: number;

    public get currencies(): TCurrency[] | undefined {
        return this._currencies ? JSON.parse(this._currencies) : undefined;
    }
    public set currencies(data: TCurrency[] | undefined) {
        this._currencies = data ? JSON.stringify(data) : undefined;
    }
    @Column({ type: "varchar", nullable: true })
    private _currencies?: string;

    @Column({ type: "varchar", nullable: true })
    version?: string;

    @Column({ type: "varchar", nullable: true })
    versions?: string;

    @Column({ type: "boolean", nullable: true })
    installed?: boolean;

    @Column({ type: "boolean", nullable: true })
    beta?: boolean;

    @Column({ type: "varchar", nullable: true })
    smtpConnectionString?: string;

    @Column({ type: "varchar", nullable: true })
    sendFromEmail?: string;

}