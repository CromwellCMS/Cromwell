


import { EntityRepository } from 'typeorm';
import { TEntityMeta } from '@cromwell/core';

import { EntityMeta } from '../models/entities/entity-meta.entity';
import { BaseRepository } from './base.repository';

@EntityRepository(EntityMeta)
export class EntityMetaRepository extends BaseRepository<EntityMeta> {

    constructor() {
        super(EntityMeta)
    }

    async getEntityMetaByKey(entityMetaId: string, key: string): Promise<EntityMeta | undefined | null> {
        return this.findOne({ entityMetaId, key });
    }

    async getEntityMetaValueByKey(entityMetaId: string, key: string): Promise<string | undefined | null> {
        return (await this.getEntityMetaByKey(entityMetaId, key))?.value;
    }

    async getEntityMetaValuesByKeys(entityMetaId?: string, keys?: string[]): Promise<Record<string, string> | undefined> {
        if (!keys?.length || !entityMetaId) return;
        return Object.assign({}, ...(await Promise.all(keys.map(async field => {
            return {
                [field]: await this.getEntityMetaValueByKey(entityMetaId, field)
            }
        }))));
    }

    async createEntityMeta(entityMetaId: string, key: string, value: string): Promise<TEntityMeta> {
        const meta = new EntityMeta();
        meta.entityMetaId = entityMetaId;
        meta.key = key;
        meta.value = value;
        await meta.save();
        return meta;
    }

    async setEntityMeta(entityMetaId: string, key: string, value: string): Promise<TEntityMeta | undefined> {
        if (!entityMetaId || entityMetaId === '') return;
        if (!key || key === '') return;

        const meta = await this.getEntityMetaByKey(entityMetaId, key).catch();
        if (meta) {
            if (!value || value === '') {
                await this.deleteEntity(meta.id);
                return;
            } else {
                meta.value = value;
                await meta.save();
                return meta;
            }
        } else {
            if (value && value !== '') {
                return this.createEntityMeta(entityMetaId, key, value);
            }
        }
    }
}
