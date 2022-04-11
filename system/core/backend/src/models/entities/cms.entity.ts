import { TCmsAdminSettings, TCmsEntity, TCmsInternalSettings, TCmsPublicSettings, TCmsEnabledModules } from '@cromwell/core';
import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('cms')
export class CmsEntity extends BaseEntity implements TCmsEntity {

    @Index()
    @PrimaryGeneratedColumn()
    id: number;

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


    public get modules(): TCmsEnabledModules | undefined {
        return this._modules ? JSON.parse(this._modules) : undefined;
    }
    public set modules(data: TCmsEnabledModules | undefined) {
        this._modules = data ? JSON.stringify(data) : undefined;
    }
    @Column({ type: "text", nullable: true, default: '{"ecommerce": true,"blog":true}' })
    private _modules?: string;


    public get internalSettings(): TCmsInternalSettings | undefined {
        return this._internalSettings ? JSON.parse(this._internalSettings) : undefined;
    }
    public set internalSettings(data: TCmsInternalSettings | undefined) {
        this._internalSettings = data ? JSON.stringify(data) : undefined;
    }
    @Column({ type: "text", nullable: true })
    private _internalSettings?: string;

    @Index()
    @CreateDateColumn()
    createDate: Date;

    @Index()
    @UpdateDateColumn()
    updateDate: Date;
}
