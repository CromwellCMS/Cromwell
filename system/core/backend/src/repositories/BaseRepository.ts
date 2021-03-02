import { TPagedList, TPagedParams, logFor } from '@cromwell/core';
import { Repository } from 'typeorm';

import { getPaged } from './BaseQueries';
import { getLogger } from '../helpers/constants';

const logger = getLogger('detailed');

export class BaseRepository<EntityType, EntityInputType = EntityType> extends Repository<EntityType> {

    constructor(
        private EntityClass: new (...args: any[]) => EntityType
    ) {
        super();
    }

    async getPaged(params?: TPagedParams<EntityType>): Promise<TPagedList<EntityType>> {
        logger.log('BaseRepository::getPaged');
        const qb = this.createQueryBuilder(this.metadata.tablePath);
        const paged = await getPaged(qb, this.metadata.tablePath, params);
        return paged;
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

    async createEntity(input: EntityInputType): Promise<EntityType> {
        logger.log('BaseRepository::createEntity');
        let entity = new this.EntityClass();
        for (const key of Object.keys(input)) {
            entity[key] = input[key];
        };
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
        };
        entity = await this.save(entity);

        return entity;
    }

    async deleteEntity(id: string): Promise<boolean> {
        logger.log('BaseRepository::deleteEntity');
        const entity = await this.getById(id);
        if (!entity) {
            console.log(`BaseRepository::deleteEntity failed to find ${this.metadata.tablePath} ${id} by id: ${id}`);
            return false;
        }
        const res = await this.delete(id);
        return true;
    }

}