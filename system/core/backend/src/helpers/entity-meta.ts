import { EDBEntity } from '@cromwell/core';
import { Brackets, Repository } from 'typeorm';

import { Attribute } from '../models/entities/attribute.entity';
import { BasePageEntity } from '../models/entities/base-page.entity';
import { AttributeMeta } from '../models/entities/meta/attribute-meta.entity';
import { BaseEntityMeta, TEntityMeta } from '../models/entities/meta/base-meta.entity';
import { OrderMeta } from '../models/entities/meta/order-meta.entity';
import { PostMeta } from '../models/entities/meta/post-meta.entity';
import { ProductCategoryMeta } from '../models/entities/meta/product-category-meta.entity';
import { ProductMeta } from '../models/entities/meta/product-meta.entity';
import { TagMeta } from '../models/entities/meta/tag-meta.entity';
import { UserMeta } from '../models/entities/meta/user-meta.entity';
import { Order } from '../models/entities/order.entity';
import { Post } from '../models/entities/post.entity';
import { ProductCategory } from '../models/entities/product-category.entity';
import { Product } from '../models/entities/product.entity';
import { Tag } from '../models/entities/tag.entity';
import { User } from '../models/entities/user.entity';
import { CustomEntity } from '../models/entities/custom-entity.entity';
import { CustomEntityMeta } from '../models/entities/meta/custom-entity-meta.entity';

type TEntityMetaModel = BaseEntityMeta & TEntityMeta;

class EntityMetaRepository {

    getRepository(entityType: EDBEntity): Repository<TEntityMetaModel> | undefined {
        if (entityType === EDBEntity.Attribute) return AttributeMeta.getRepository();
        if (entityType === EDBEntity.Order) return OrderMeta.getRepository();
        if (entityType === EDBEntity.Post) return PostMeta.getRepository();
        if (entityType === EDBEntity.ProductCategory) return ProductCategoryMeta.getRepository();
        if (entityType === EDBEntity.Product) return ProductMeta.getRepository();
        if (entityType === EDBEntity.Tag) return TagMeta.getRepository();
        if (entityType === EDBEntity.User) return UserMeta.getRepository();
        if (entityType === EDBEntity.Custom) return CustomEntityMeta.getRepository();
    }

    getClass(entityType: EDBEntity): (new (...args: any[]) => TEntityMetaModel) | undefined {
        if (entityType === EDBEntity.Attribute) return AttributeMeta;
        if (entityType === EDBEntity.Order) return OrderMeta;
        if (entityType === EDBEntity.Post) return PostMeta;
        if (entityType === EDBEntity.ProductCategory) return ProductCategoryMeta;
        if (entityType === EDBEntity.Product) return ProductMeta;
        if (entityType === EDBEntity.Tag) return TagMeta;
        if (entityType === EDBEntity.User) return UserMeta;
        if (entityType === EDBEntity.Custom) return CustomEntityMeta;
    }

    getEntityType(entityType: BasePageEntity): EDBEntity | undefined {
        if (entityType instanceof Attribute) return EDBEntity.Attribute;
        if (entityType instanceof Order) return EDBEntity.Order;
        if (entityType instanceof Post) return EDBEntity.Post;
        if (entityType instanceof ProductCategory) return EDBEntity.ProductCategory;
        if (entityType instanceof Product) return EDBEntity.Product;
        if (entityType instanceof Tag) return EDBEntity.Tag;
        if (entityType instanceof User) return EDBEntity.User;
        if (entityType instanceof CustomEntity) return EDBEntity.Custom;
    }

    async getEntityMetaByKey(type: EDBEntity, id: number, key: string): Promise<TEntityMetaModel | undefined | null> {
        return this.getRepository(type)?.findOne({ entityId: id, key });
    }

    async getEntityMetaValueByKey(type: EDBEntity, id: number, key: string): Promise<string | undefined | null> {
        return (await this.getEntityMetaByKey(type, id, key))?.value;
    }

    async getEntityMetaValuesByKeys(type: EDBEntity, id: number, keys?: string[]): Promise<Record<string, string> | undefined> {
        if (!keys?.length || !id) return;
        const repo = this.getRepository(type);
        if (!repo) return;

        const qb = repo.createQueryBuilder().select();
        keys.forEach(key => {
            if (!key || key === '') return;
            const brackets = new Brackets(subQb => {
                subQb.where({ entityId: id });
                subQb.andWhere({ key });
            });
            qb.orWhere(brackets);
        })
        const metaRecords = await qb.getMany();

        return Object.assign({}, ...(metaRecords.map(record => {
            if (!record.key || !record.value) return {};
            return {
                [record.key]: record.value
            }
        })));
    }

    async createEntityMeta(type: EDBEntity, entityId: number, key?: string, value?: string): Promise<TEntityMeta | undefined> {
        if (!value || value === '') return;
        if (!key || key === '') return;
        if (entityId === undefined || entityId === null) return;
        const EntityClass = this.getClass(type);
        if (!EntityClass) return;

        const meta = new EntityClass();
        meta.entityId = entityId;
        meta.key = key;
        meta.value = value;
        await meta.save();
        return meta;
    }

    /**
     * Set (create or update) meta record for provided entity or entity meta id
     * @param entity ORM Entity or entityMetaId 
     * @param key Meta key
     * @param value Meta value
     * @returns Meta DB record
     */
    async setEntityMeta(type?: EDBEntity, entityId?: number, key?: string, value?: string): Promise<TEntityMeta | undefined> {
        if (!type) return;
        if (!key || key === '') return;
        if (entityId === undefined || entityId === null) return;
        const repo = this.getRepository(type);
        if (!repo) return;

        const meta = await this.getEntityMetaByKey(type, entityId, key).catch();
        if (meta) {
            if (!value || value === '') {
                await repo.delete(meta.id);
                return;
            } else {
                meta.value = value;
                await meta.save();
                return meta;
            }
        } else {
            return this.createEntityMeta(type, entityId, key, value);
        }
    }
}

export const entityMetaRepository = new EntityMetaRepository();