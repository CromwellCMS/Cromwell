import { TAttribute, TAttributeInput, TAttributeProductVariant } from '@cromwell/core';
import { EntityRepository } from 'typeorm';

import { checkEntitySlug, handleBaseInput } from '../helpers/base-queries';
import { getLogger } from '../helpers/logger';
import { Attribute } from '../models/entities/attribute.entity';
import { AttributeToProduct } from '../models/entities/attribute-product.entity';
import { AttributeValue } from '../models/entities/attribute-value.entity';
import { BaseRepository } from './base.repository';
import { Product } from '../models/entities/product.entity';

const logger = getLogger();

@EntityRepository(Attribute)
export class AttributeRepository extends BaseRepository<Attribute> {

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

    async addAttributeValueToProduct(product: Product, value: AttributeValue, productVariant?: TAttributeProductVariant) {
        const attributeToProduct = new AttributeToProduct();
        attributeToProduct.product = product;
        attributeToProduct.productId = product.id;
        attributeToProduct.attributeValue = value;
        attributeToProduct.attributeValueId = value.id;
        attributeToProduct.productVariant = productVariant;
        attributeToProduct.key = value.key;
        attributeToProduct.value = value.value;
        await attributeToProduct.save();
    }

    async handleAttributeInput(attribute: Attribute, input: TAttributeInput) {
        await handleBaseInput(attribute, input);
        attribute.key = input.key;
        attribute.type = input.type;
        attribute.icon = input.icon;
        attribute.required = input.required;
        if (input.isEnabled === undefined) attribute.isEnabled = true;
        await attribute.save();

        if (input.values) {
            if (attribute.values) {
                for (const value of attribute.values) {
                    await value.remove();
                }
            }

            input.values = input.values.sort((a, b) => (a.value > b.value) ? 1 : -1);
            for (const valueInput of input.values) {
                const value = new AttributeValue();
                value.attribute = attribute;
                value.attributeId = attribute.id;
                value.key = attribute.key;
                value.value = valueInput.value;
                value.title = valueInput.title;
                value.icon = valueInput.icon;
                await value.save();
            }
        }
    }

    async createAttribute(createAttribute: TAttributeInput, id?: number): Promise<TAttribute> {
        logger.log('AttributeRepository::createAttribute');
        let attribute = new Attribute();
        if (id) attribute.id = id;

        await this.handleAttributeInput(attribute, createAttribute);

        attribute = await this.save(attribute);
        await checkEntitySlug(attribute, Attribute);

        return attribute;
    }

    async updateAttribute(id: number, updateAttribute: TAttributeInput): Promise<Attribute> {
        logger.log('AttributeRepository::updateAttribute; id: ' + id);
        let attribute = await this.findOne({
            where: { id },
            relations: ['values']
        });
        if (!attribute) throw new Error(`Attribute ${id} not found!`);

        await this.handleAttributeInput(attribute, updateAttribute);

        attribute = await this.save(attribute);
        await checkEntitySlug(attribute, Attribute);

        return attribute;
    }

    async deleteAttribute(id: number): Promise<boolean> {
        logger.log('AttributeRepository::deleteAttribute; id: ' + id);
        return this.deleteEntity(id);
    }
}