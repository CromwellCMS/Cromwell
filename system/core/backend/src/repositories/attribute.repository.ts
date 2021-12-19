import { TAttribute, TAttributeInput } from '@cromwell/core';
import { EntityRepository } from 'typeorm';

import { checkEntitySlug, handleBaseInput, handleCustomMetaInput } from '../helpers/base-queries';
import { getLogger } from '../helpers/logger';
import { Attribute } from '../models/entities/attribute.entity';
import { AttributeToProduct } from '../models/entities/attribute-product.entity';
import { AttributeValue } from '../models/entities/attribute-value.entity';
import { BaseRepository } from './base.repository';
import { Product } from '../models/entities/product.entity';

const logger = getLogger();

@EntityRepository(Attribute)
export class AttributeRepository extends BaseRepository<Attribute> {

    constructor() {
        super(Attribute);
    }

    async getAttributes(): Promise<Attribute[]> {
        logger.log('AttributeRepository::getAttributes');
        return this.find({ relations: ['values'] });
    }

    async getAttribute(id: number): Promise<Attribute | undefined> {
        logger.log('AttributeRepository::getAttribute; id: ' + id);
        return this.findOne({
            where: { id },
            relations: ['values']
        });
    }

    async getAttributeByKey(key: string): Promise<Attribute | undefined> {
        logger.log('AttributeRepository::getAttributeByKey; key: ' + key);
        return this.findOne({
            where: { key },
            relations: ['values']
        });
    }

    async getAttributeInstancesOfProduct(productId: number): Promise<AttributeToProduct[] | undefined> {
        logger.log('AttributeRepository::getAttributeInstancesOfProduct; productId: ' + productId);

        return AttributeToProduct.getRepository().find({
            where: { productId },
        });
    }

    async addAttributeValueToProduct(product: Product, value: AttributeValue): Promise<AttributeToProduct | undefined> {
        if (!value.key) return;
        const attributeToProduct = new AttributeToProduct();
        attributeToProduct.product = product;
        attributeToProduct.productId = product.id;
        attributeToProduct.attributeValue = value;
        attributeToProduct.attributeValueId = value.id;
        attributeToProduct.key = value.key;
        attributeToProduct.value = value.value;
        await attributeToProduct.save();
        return attributeToProduct;
    }

    async handleAttributeInput(attribute: Attribute, input: TAttributeInput, action: 'update' | 'create') {
        await handleBaseInput(attribute, input);
        attribute.key = input.key;
        attribute.type = input.type;
        attribute.icon = input.icon;
        attribute.required = input.required;
        if (input.isEnabled === undefined) attribute.isEnabled = true;

        if (action === 'create') await attribute.save();

        if (input.values) {
            if (attribute.values) {
                for (const value of attribute.values) {
                    if (!input.values.find(val => value.value === val.value)) {
                        await value.remove();
                    }
                }
            }

            const updatedValues: AttributeValue[] = [];
            input.values = input.values.sort((a, b) => (a.value > b.value) ? 1 : -1);
            for (const valueInput of input.values) {
                if (!attribute.key) return;
                const value = attribute.values?.find(val => val.value === valueInput.value)
                    ?? new AttributeValue();

                value.attribute = attribute;
                value.attributeId = attribute.id;
                value.key = attribute.key;
                value.value = valueInput.value;
                value.title = valueInput.title;
                value.icon = valueInput.icon;
                await value.save();
                updatedValues.push(value);
            }
            attribute.values = updatedValues;
        }

        await handleCustomMetaInput(attribute, input);
        await checkEntitySlug(attribute, Attribute);
    }

    async createAttribute(createAttribute: TAttributeInput, id?: number | null): Promise<TAttribute> {
        logger.log('AttributeRepository::createAttribute');
        const attribute = new Attribute();
        if (id) attribute.id = id;

        await this.handleAttributeInput(attribute, createAttribute, 'create');
        await this.save(attribute);
        return attribute;
    }

    async updateAttribute(id: number, updateAttribute: TAttributeInput): Promise<Attribute> {
        logger.log('AttributeRepository::updateAttribute; id: ' + id);

        const attribute = await this.getById(id, ['values']);
        if (!attribute) throw new Error(`Attribute ${id} not found!`);

        await this.handleAttributeInput(attribute, updateAttribute, 'update');
        await this.save(attribute);
        return attribute;
    }

    async deleteAttribute(id: number): Promise<boolean> {
        logger.log('AttributeRepository::deleteAttribute; id: ' + id);
        return this.deleteEntity(id);
    }
}