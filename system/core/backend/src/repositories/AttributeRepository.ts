import { TAttribute, TAttributeInput, logFor } from '@cromwell/core';
import { EntityRepository, Repository } from 'typeorm';

import { Attribute } from '../entities/Attribute';
import { BaseRepository } from './BaseRepository';
import { handleBaseInput, checkEntitySlug } from './BaseQueries';
import { getLogger } from '../helpers/constants';

const logger = getLogger('detailed');

@EntityRepository(Attribute)
export class AttributeRepository extends BaseRepository<Attribute> {

    async getAttributes(): Promise<Attribute[]> {
        logger.log('AttributeRepository::getAttributes');
        return this.find();
    }

    async getAttribute(id: string): Promise<Attribute | undefined> {
        logger.log('AttributeRepository::getAttribute; id: ' + id);
        return this.getById(id);
    }

    async handleAttributeInput(attribute: Attribute, input: TAttributeInput) {
        handleBaseInput(attribute, input);
        attribute.key = input.key;
        attribute.type = input.type;
        attribute.values = input.values.sort((a, b) => (a.value > b.value) ? 1 : -1);
        attribute.icon = input.icon;
        if (input.isEnabled === undefined) attribute.isEnabled = true;
    }

    async createAttribute(createAttribute: TAttributeInput): Promise<TAttribute> {
        logger.log('AttributeRepository::createAttribute');
        let attribute = new Attribute();

        await this.handleAttributeInput(attribute, createAttribute);

        attribute = await this.save(attribute);
        await checkEntitySlug(attribute, Attribute);

        return attribute;
    }

    async updateAttribute(id: string, updateAttribute: TAttributeInput): Promise<Attribute> {
        logger.log('AttributeRepository::updateAttribute; id: ' + id);
        let attribute = await this.findOne({
            where: { id }
        });
        if (!attribute) throw new Error(`Attribute ${id} not found!`);

        await this.handleAttributeInput(attribute, updateAttribute);

        attribute = await this.save(attribute);
        await checkEntitySlug(attribute, Attribute);

        return attribute;
    }

    async deleteAttribute(id: string): Promise<boolean> {
        logger.log('AttributeRepository::deleteAttribute; id: ' + id);
        return this.deleteEntity(id);
    }


}