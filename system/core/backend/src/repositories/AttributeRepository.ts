import { TAttribute, TAttributeInput } from '@cromwell/core';
import { EntityRepository, Repository } from 'typeorm';

import { Attribute } from '../entities/Attribute';
import { handleBaseInput } from './BaseQueries';

@EntityRepository(Attribute)
export class AttributeRepository extends Repository<Attribute> {

    async getAttributes(): Promise<Attribute[]> {
        return this.find();
    }

    async getAttribute(id: string): Promise<Attribute> {
        const attribute = await this.findOne({
            where: { id }
        });
        if (!attribute) throw new Error(`Attribute ${id} not found!`);
        return attribute;
    }

    async handleAttributeInput(attribute: Attribute, input: TAttributeInput) {
        handleBaseInput(attribute, input);
        attribute.key = input.key;
        attribute.type = input.type;
        attribute.values = input.values;
    }

    async createAttribute(createAttribute: TAttributeInput): Promise<TAttribute> {
        let attribute = new Attribute();

        await this.handleAttributeInput(attribute, createAttribute);

        attribute = await this.save(attribute);
        if (!attribute.slug) {
            attribute.slug = attribute.id;
            await this.save(attribute);
        }

        return attribute;
    }

    async updateAttribute(id: string, updateAttribute: TAttributeInput): Promise<Attribute> {
        let attribute = await this.findOne({
            where: { id }
        });
        if (!attribute) throw new Error(`Attribute ${id} not found!`);

        await this.handleAttributeInput(attribute, updateAttribute);

        attribute = await this.save(attribute);

        return attribute;
    }

    async deleteAttribute(id: string): Promise<boolean> {
        console.log('AttributeRepository::deleteAttribute; id: ' + id)

        const attribute = await this.getAttribute(id);
        if (!attribute) {
            console.log('AttributeRepository::deleteAttribute failed to find attribute by id');
            return false;
        }
        const res = await this.delete(id);
        return true;
    }


}