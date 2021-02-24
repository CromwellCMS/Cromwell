import { TPagedList, TPagedParams, logFor } from '@cromwell/core';
import { Repository } from 'typeorm';

import { getPaged } from './BaseQueries';

export class BaseRepository<EntityType, EntityInputType = EntityType> extends Repository<EntityType> {

    constructor(
        private EntityClass: new (...args: any[]) => EntityType
    ) {
        super();
    }

    async getPaged(params?: TPagedParams<EntityType>): Promise<TPagedList<EntityType>> {
        logFor('all', 'BaseRepository::getPaged');
        const qb = this.createQueryBuilder(this.metadata.tablePath);
        const paged = await getPaged(qb, this.metadata.tablePath, params);
        return paged;
    }

    async getAll(): Promise<EntityType[]> {
        logFor('all', 'BaseRepository::getAll');
        return this.find()
    }

    async getById(id: string, relations?: string[]): Promise<EntityType | undefined> {
        logFor('all', 'BaseRepository::getById');
        const entity = await this.findOne({
            where: { id },
            relations
        });
        if (!entity) throw new Error(`${this.metadata.tablePath} ${id} not found!`);
        return entity;
    }

    async getBySlug(slug: string, relations?: string[]): Promise<EntityType | undefined> {
        logFor('all', 'BaseRepository::getBySlug');
        const entity = await this.findOne({
            where: { slug },
            relations
        });
        if (!entity) throw new Error(`${this.metadata.tablePath} ${slug} not found!`);
        return entity;
    }

    async createEntity(input: EntityInputType): Promise<EntityType> {
        logFor('all', 'BaseRepository::createEntity');
        let entity = new this.EntityClass();
        for (const key of Object.keys(input)) {
            entity[key] = input[key];
        };
        entity = await this.save<EntityType>(entity);
        return entity;
    }

    async updateEntity(id: string, input: EntityInputType): Promise<EntityType> {
        logFor('all', 'BaseRepository::updateEntity');
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
        logFor('all', 'BaseRepository::deleteEntity');
        const entity = await this.getById(id);
        if (!entity) {
            console.log(`BaseRepository::deleteEntity failed to find ${this.metadata.tablePath} ${id} by id: ${id}`);
            return false;
        }
        const res = await this.delete(id);
        return true;
    }

}