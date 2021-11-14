import { EDBEntity } from '@cromwell/core';
import { Brackets, Repository, BaseEntity } from 'typeorm';

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
import { ProductReview } from '../models/entities/product-review.entity';
import { Product } from '../models/entities/product.entity';
import { Tag } from '../models/entities/tag.entity';
import { User } from '../models/entities/user.entity';
import { CustomEntity } from '../models/entities/custom-entity.entity';
import { CustomEntityMeta } from '../models/entities/meta/custom-entity-meta.entity';

type TEntityMetaModel = BaseEntityMeta & TEntityMeta;

class EntityMetaRepository {

    getMetaClass(entityType: EDBEntity): (new (...args: any[]) => TEntityMetaModel) & typeof BaseEntity | undefined {
        if (entityType === EDBEntity.Attribute) return AttributeMeta;
        if (entityType === EDBEntity.Order) return OrderMeta;
        if (entityType === EDBEntity.Post) return PostMeta;
        if (entityType === EDBEntity.ProductCategory) return ProductCategoryMeta;
        if (entityType === EDBEntity.Product) return ProductMeta;
        if (entityType === EDBEntity.Tag) return TagMeta;
        if (entityType === EDBEntity.User) return UserMeta;
        if (entityType === EDBEntity.CustomEntity) return CustomEntityMeta;
    }

    getEntityClass(entityType: EDBEntity): (new (...args: any[]) => TEntityMetaModel) & typeof BaseEntity | undefined {
        if (entityType === EDBEntity.Attribute) return Attribute;
        if (entityType === EDBEntity.Order) return Order;
        if (entityType === EDBEntity.Post) return Post;
        if (entityType === EDBEntity.ProductCategory) return ProductCategory;
        if (entityType === EDBEntity.Product) return Product;
        if (entityType === EDBEntity.ProductReview) return ProductReview;
        if (entityType === EDBEntity.Tag) return Tag;
        if (entityType === EDBEntity.User) return User;
        if (entityType === EDBEntity.CustomEntity) return CustomEntity;

    }

    getEntityType(entityClass: any): EDBEntity | undefined {
        if (entityClass instanceof Attribute || entityClass === Attribute) return EDBEntity.Attribute;
        if (entityClass instanceof Order || entityClass === Order) return EDBEntity.Order;
        if (entityClass instanceof Post || entityClass === Post) return EDBEntity.Post;
        if (entityClass instanceof ProductCategory || entityClass === ProductCategory) return EDBEntity.ProductCategory;
        if (entityClass instanceof Product || entityClass === Product) return EDBEntity.Product;
        if (entityClass instanceof ProductReview || entityClass === ProductReview) return EDBEntity.ProductReview;
        if (entityClass instanceof Tag || entityClass === Tag) return EDBEntity.Tag;
        if (entityClass instanceof User || entityClass === User) return EDBEntity.User;
        if (entityClass instanceof CustomEntity || entityClass === CustomEntity) return EDBEntity.CustomEntity;
    }

    async getEntityMetaByKey(type: EDBEntity, id: number, key: string): Promise<TEntityMetaModel | undefined | null> {
        return this.getMetaClass(type)?.getRepository()?.findOne({ entityId: id, key });
    }

    async getEntityMetaValueByKey(type: EDBEntity, id: number, key: string): Promise<string | undefined | null> {
        return (await this.getEntityMetaByKey(type, id, key))?.value;
    }

    async getEntityMetaByKeys(type: EDBEntity, id: number, keys?: string[]): Promise<Record<string, string> | undefined | null> {
        if (!keys?.length || !id) return;
        keys = keys.filter(Boolean);
        if (!keys.length) return;
        const repo = this.getMetaClass(type)?.getRepository();
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

        const meta = Object.assign({}, ...(metaRecords.map(record => {
            if (!record.key || !record.value) return {};
            return {
                [record.key]: record.value
            }
        })));
        if (!Object.keys(meta)?.length) return null;
        return meta;
    }

    async createEntityMeta(type: EDBEntity, entityId: number, key?: string, value?: string | null): Promise<TEntityMeta | undefined> {
        if (!value || value === '') return;
        if (!key || key === '') return;
        if (entityId === undefined || entityId === null) return;
        const EntityMetaClass = this.getMetaClass(type);
        if (!EntityMetaClass) return;

        const meta = new EntityMetaClass();
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
    async setEntityMeta(type?: EDBEntity, entityId?: number, key?: string, value?: string | null): Promise<TEntityMeta | undefined> {
        if (!type) return;
        if (!key || key === '') return;
        if (entityId === undefined || entityId === null) return;
        const repo = this.getMetaClass(type)?.getRepository();
        if (!repo) return;

        const meta = await this.getEntityMetaByKey(type, entityId, key).catch(() => null);
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

    async getAllEntityMetaKeys(type: EDBEntity): Promise<string[] | undefined> {
        const MetaClass = this.getMetaClass(type);
        if (!MetaClass) return;
        const repo = MetaClass.getRepository();
        const qb = repo.createQueryBuilder(repo.metadata.tablePath)
            .select(`${repo.metadata.tablePath}.key`, 'key')
            .distinct(true);
        const rawRes = await qb.getRawMany();
        return rawRes.map(raw => raw.key);
    }

}

export const entityMetaRepository = new EntityMetaRepository();