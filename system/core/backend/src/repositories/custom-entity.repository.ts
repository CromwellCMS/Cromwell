import {
    TCustomEntity,
    TCustomEntityFilter,
    TCustomEntityInput,
    TDeleteManyInput,
    TPagedList,
    TPagedParams,
} from '@cromwell/core';
import { EntityRepository, SelectQueryBuilder } from 'typeorm';

import { checkEntitySlug, getPaged, handleBaseInput, handleCustomMetaInput } from '../helpers/base-queries';
import { getLogger } from '../helpers/logger';
import { CustomEntity } from '../models/entities/custom-entity.entity';
import { PagedParamsInput } from '../models/inputs/paged-params.input';
import { BaseRepository } from './base.repository';

const logger = getLogger();

@EntityRepository(CustomEntity)
export class CustomEntityRepository extends BaseRepository<CustomEntity> {

    constructor() {
        super(CustomEntity);
    }

    async getCustomEntities(params?: TPagedParams<TCustomEntity>): Promise<TPagedList<CustomEntity>> {
        logger.log('CustomEntityRepository::getCustomEntities');
        return this.getPaged(params);
    }

    async getCustomEntityById(id: number): Promise<CustomEntity> {
        logger.log('CustomEntityRepository::getCustomEntityById id: ' + id);
        return this.getById(id);
    }

    async getCustomEntitiesByIds(ids: number[]): Promise<CustomEntity[]> {
        logger.log('CustomEntityRepository::getCustomEntitiesByIds ids: ' + ids.join(', '));
        return this.findByIds(ids);
    }

    async getCustomEntityBySlug(slug: string): Promise<CustomEntity> {
        logger.log('CustomEntityRepository::getCustomEntityBySlug slug: ' + slug);
        return this.getBySlug(slug);
    }

    private async handleBaseCustomEntityInput(customEntity: CustomEntity, input: TCustomEntityInput, action: 'update' | 'create') {
        await handleBaseInput(customEntity, input);

        customEntity.name = input.name;
        customEntity.entityType = input.entityType;

        if (action === 'create') await customEntity.save();
        await checkEntitySlug(customEntity, CustomEntity);
        await handleCustomMetaInput(customEntity, input);
    }

    async createCustomEntity(inputData: TCustomEntityInput, id?: number | null): Promise<CustomEntity> {
        logger.log('CustomEntityRepository::createCustomEntity');
        const customEntity = new CustomEntity();
        if (id) customEntity.id = id;

        await this.handleBaseCustomEntityInput(customEntity, inputData, 'create');
        await this.save(customEntity);
        return customEntity;
    }

    async updateCustomEntity(id: number, inputData: TCustomEntityInput): Promise<CustomEntity> {
        logger.log('CustomEntityRepository::updateCustomEntity id: ' + id);
        const customEntity = await this.getById(id);

        await this.handleBaseCustomEntityInput(customEntity, inputData, 'update');
        await this.save(customEntity);
        return customEntity;
    }

    async deleteCustomEntity(id: number): Promise<boolean> {
        logger.log('CustomEntityRepository::deleteCustomEntity; id: ' + id);

        const customEntity = await this.getCustomEntityById(id);
        if (!customEntity) {
            logger.error('CustomEntityRepository::deleteCustomEntity failed to find CustomEntity by id');
            return false;
        }
        await this.delete(id);
        return true;
    }

    applyCustomEntityFilter(qb: SelectQueryBuilder<TCustomEntity>, filterParams?: TCustomEntityFilter) {
        if (!filterParams) return;

        this.applyBaseFilter(qb, filterParams);

        const entityType = filterParams.entityType;
        if (entityType) {
            const query = `${this.metadata.tablePath}.${this.quote('entityType')} = :entityType`;
            qb.andWhere(query, { entityType });
        }

        const entityName = filterParams.name;
        if (entityName) {
            const query = `${this.metadata.tablePath}.${this.quote('name')} = :entityName`;
            qb.andWhere(query, { entityName });
        }
    }

    async getFilteredCustomEntities(pagedParams?: TPagedParams<TCustomEntity>,
        filterParams?: TCustomEntityFilter): Promise<TPagedList<TCustomEntity>> {

        const qb = this.createQueryBuilder(this.metadata.tablePath);
        qb.select();
        this.applyCustomEntityFilter(qb, filterParams);
        return await getPaged(qb, this.metadata.tablePath, pagedParams);
    }

    async deleteManyFilteredCustomEntities(input: TDeleteManyInput, filterParams?: TCustomEntityFilter): Promise<boolean> {
        if (!filterParams) return this.deleteMany(input);

        const qbSelect = this.createQueryBuilder(this.metadata.tablePath).select([`${this.metadata.tablePath}.id`]);
        this.applyCustomEntityFilter(qbSelect, filterParams);
        this.applyDeleteMany(qbSelect, input);

        const qbDelete = this.createQueryBuilder(this.metadata.tablePath).delete()
            .where(`${this.metadata.tablePath}.id IN (${qbSelect.getQuery()})`)
            .setParameters(qbSelect.getParameters());

        await qbDelete.execute();
        return true;
    }
}