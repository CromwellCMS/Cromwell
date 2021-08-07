import { TCmsAdminSettings, TCmsEntity, TCmsInternalSettings, TCmsPublicSettings } from '@cromwell/core';
import { Column, Entity } from 'typeorm';

import { BasePageEntity } from './base-page.entity';

@Entity('cms')
export class CmsEntity extends BasePageEntity implements TCmsEntity {

    public get publicSettings(): TCmsPublicSettings | undefined {
        return this._publicSettings ? JSON.parse(this._publicSettings) : undefined;
    }
    public set publicSettings(data: TCmsPublicSettings | undefined) {
        this._publicSettings = data ? JSON.stringify(data) : undefined;
    }
    @Column({ type: "text", nullable: true })
    private _publicSettings?: string;


    public get adminSettings(): TCmsAdminSettings | undefined {
        return this._adminSettings ? JSON.parse(this._adminSettings) : undefined;
    }
    public set adminSettings(data: TCmsAdminSettings | undefined) {
        this._adminSettings = data ? JSON.stringify(data) : undefined;
    }
    @Column({ type: "text", nullable: true })
    private _adminSettings?: string;


    public get internalSettings(): TCmsInternalSettings | undefined {
        return this._internalSettings ? JSON.parse(this._internalSettings) : undefined;
    }
    public set internalSettings(data: TCmsInternalSettings | undefined) {
        this._internalSettings = data ? JSON.stringify(data) : undefined;
    }
    @Column({ type: "text", nullable: true })
    private _internalSettings?: string;
}
