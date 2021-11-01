import { TCustomEntity, TPagedList, TPagedParams } from '@cromwell/core';
import { EntityRepository } from 'typeorm';

import { checkEntitySlug, handleBaseInput } from '../helpers/base-queries';
import { getLogger } from '../helpers/logger';
import { CustomEntity } from '../models/entities/custom-entity.entity';
import { BaseRepository } from './base.repository';

const logger = getLogger();

@EntityRepository(CustomEntity)
export class CustomEntityRepository extends BaseRepository<CustomEntity> {

    constructor() {
        super(CustomEntity);
    }

    async getCustomEntities(params?: TPagedParams<TCustomEntity>): Promise<TPagedList<CustomEntity>> {
        logger.log('CustomEntityRepository::getCustomEntities');
        return this.getPaged(params)
    }

    async getCustomEntityById(id: number): Promise<CustomEntity | undefined> {
        logger.log('CustomEntityRepository::getCustomEntityById id: ' + id);
        return this.getById(id);
    }

    async getCustomEntitiesByIds(ids: number[]): Promise<CustomEntity[]> {
        logger.log('CustomEntityRepository::getCustomEntitiesByIds ids: ' + ids.join(', '));
        return this.findByIds(ids);
    }

    async getCustomEntityBySlug(slug: string): Promise<CustomEntity | undefined> {
        logger.log('CustomEntityRepository::getCustomEntityBySlug slug: ' + slug);
        return this.getBySlug(slug);
    }

    private async handleBaseCustomEntityInput(customEntity: CustomEntity, input: TCustomEntity) {
        await handleBaseInput(customEntity, input);

        customEntity.name = input.name;
        customEntity.entityType = input.entityType;
    }

    async createCustomEntity(inputData: TCustomEntity, id?: number): Promise<CustomEntity> {
        logger.log('CustomEntityRepository::createCustomEntity');
        let customEntity = new CustomEntity();
        if (id) customEntity.id = id;

        await this.handleBaseCustomEntityInput(customEntity, inputData);
        customEntity = await this.save(customEntity);
        await checkEntitySlug(customEntity, CustomEntity);

        return customEntity;
    }

    async updateCustomEntity(id: number, inputData: TCustomEntity): Promise<CustomEntity> {
        logger.log('CustomEntityRepository::updateCustomEntity id: ' + id);

        let customEntity = await this.findOne({
            where: { id }
        });
        if (!customEntity) throw new Error(`CustomEntity ${id} not found!`);

        await this.handleBaseCustomEntityInput(customEntity, inputData);
        customEntity = await this.save(customEntity);
        await checkEntitySlug(customEntity, CustomEntity);

        return customEntity;
    }

    async deleteCustomEntity(id: number): Promise<boolean> {
        logger.log('CustomEntityRepository::deleteCustomEntity; id: ' + id);

        const customEntity = await this.getCustomEntityById(id);
        if (!customEntity) {
            logger.error('CustomEntityRepository::deleteCustomEntity failed to find CustomEntity by id');
            return false;
        }
        const res = await this.delete(id);
        return true;
    }

}