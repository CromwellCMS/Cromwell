import { TPagedList, TPagedParams, TDeleteManyInput } from '@cromwell/core';
import { DeleteQueryBuilder, Repository, SelectQueryBuilder } from 'typeorm';

import { getPaged } from '../helpers/base-queries';
import { getLogger } from '../helpers/logger';

const logger = getLogger();

export class BaseRepository<EntityType, EntityInputType = EntityType> extends Repository<EntityType> {

    constructor(
        private EntityClass: new (...args: any[]) => EntityType & { id?: string }
    ) {
        super();
    }

    async getPaged(params?: TPagedParams<EntityType>): Promise<TPagedList<EntityType>> {
        logger.log('BaseRepository::getPaged');
        const qb = this.createQueryBuilder(this.metadata.tablePath);
        return await getPaged(qb, this.metadata.tablePath, params);
    }

    async getAll(): Promise<EntityType[]> {
        logger.log('BaseRepository::getAll');
        return this.find()
    }

    async getById(id: string, relations?: string[]): Promise<EntityType | undefined> {
        logger.log('BaseRepository::getById');
        const entity = await this.findOne({
            where: { id },
            relations
        });
        if (!entity) throw new Error(`${this.metadata.tablePath} ${id} not found!`);
        return entity;
    }

    async getBySlug(slug: string, relations?: string[]): Promise<EntityType | undefined> {
        logger.log('BaseRepository::getBySlug');
        const entity = await this.findOne({
            where: { slug },
            relations
        });
        if (!entity) throw new Error(`${this.metadata.tablePath} ${slug} not found!`);
        return entity;
    }

    async createEntity(input: EntityInputType, id?: string): Promise<EntityType> {
        logger.log('BaseRepository::createEntity');
        let entity = new this.EntityClass();
        if (id) entity.id = id;

        for (const key of Object.keys(input)) {
            entity[key] = input[key];
        }
        entity = await this.save<EntityType>(entity);
        return entity;
    }

    async updateEntity(id: string, input: EntityInputType): Promise<EntityType> {
        logger.log('BaseRepository::updateEntity');
        let entity = await this.findOne({
            where: { id }
        });
        if (!entity) throw new Error(`${this.metadata.tablePath} ${id} not found!`);

        for (const key of Object.keys(input)) {
            entity[key] = input[key];
        }
        entity = await this.save(entity);

        return entity;
    }

    async deleteEntity(id: string): Promise<boolean> {
        logger.log('BaseRepository::deleteEntity ' + this.metadata.tablePath);
        const entity = await this.getById(id);
        if (!entity) {
            logger.error(`BaseRepository::deleteEntity failed to find ${this.metadata.tablePath} ${id} by id: ${id}`);
            return false;
        }
        const res = await this.delete(id);
        return true;
    }

    async applyDeleteMany(qb: SelectQueryBuilder<EntityType> | DeleteQueryBuilder<EntityType>, input: TDeleteManyInput) {
        if (input.all) {
            if (input.ids && input.ids.length > 0) {
                qb.andWhere(`${this.metadata.tablePath}.id NOT IN (:...ids)`, { ids: input.ids ?? [] })
            }
        } else {
            qb.andWhere(`${this.metadata.tablePath}.id IN (:...ids)`, { ids: input.ids ?? [] })
        }
    }

    async deleteMany(input: TDeleteManyInput) {
        logger.log('BaseRepository::deleteMany ' + this.metadata.tablePath, input);
        const qb = this.createQueryBuilder().delete().from<EntityType>(this.metadata.tablePath);
        this.applyDeleteMany(qb, input);
        await qb.execute();
        return true;
    }

}