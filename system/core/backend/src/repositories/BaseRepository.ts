import { TPagedList, TPagedParams, logFor } from '@cromwell/core';
import { Repository } from 'typeorm';

import { getPaged } from './BaseQueries';

export class BaseRepository<EntityType, EntityInputType = EntityType> extends Repository<EntityType> {

    constructor(
        private DBTableName: string,
        private EntityClass: new (...args: any[]) => EntityType
    ) {
        super();
    }

    async getPaged(params: TPagedParams<EntityType>): Promise<TPagedList<EntityType>> {
        logFor('all', 'BaseRepository::getPaged');
        const qb = this.createQueryBuilder(this.DBTableName);
        const paged = await getPaged(qb, this.DBTableName, params);
        return paged;
    }

    async getAll(): Promise<EntityType[]> {
        logFor('all', 'BaseRepository::getAll');
        return this.find()
    }

    async getById(id: string): Promise<EntityType | undefined> {
        logFor('all', 'BaseRepository::getById');
        const entity = await this.findOne({
            where: { id }
        });
        if (!entity) throw new Error(`${this.DBTableName} ${id} not found!`);
        return entity;
    }

    async getBySlug(slug: string): Promise<EntityType | undefined> {
        logFor('all', 'BaseRepository::getBySlug');
        const entity = await this.findOne({
            where: { slug }
        });
        if (!entity) throw new Error(`${this.DBTableName} ${slug} not found!`);
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
        if (!entity) throw new Error(`${this.DBTableName} ${id} not found!`);

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
            console.log(`BaseRepository::deleteEntity failed to find ${this.DBTableName} ${id} by id: ${id}`);
            return false;
        }
        const res = await this.delete(id);
        return true;
    }

}