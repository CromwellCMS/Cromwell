import {
  TAttribute,
  TAttributeInput,
  TAttributeValue,
  TBaseFilter,
  TDeleteManyInput,
  TPagedList,
  TPagedParams,
} from '@cromwell/core';
import { HttpException, HttpStatus } from '@nestjs/common';
import { EntityRepository, SelectQueryBuilder } from 'typeorm';

import { checkEntitySlug, getPaged, handleBaseInput, handleCustomMetaInput } from '../helpers/base-queries';
import { getLogger } from '../helpers/logger';
import { AttributeToProduct } from '../models/entities/attribute-product.entity';
import { AttributeValue } from '../models/entities/attribute-value.entity';
import { Attribute } from '../models/entities/attribute.entity';
import { Product } from '../models/entities/product.entity';
import { BaseRepository } from './base.repository';

const logger = getLogger();

@EntityRepository(Attribute)
export class AttributeRepository extends BaseRepository<Attribute> {
  constructor() {
    super(Attribute);
  }

  async getAttributes(params?: TPagedParams<TAttribute>): Promise<TPagedList<Attribute>> {
    const qb = this.createQueryBuilder(this.metadata.tablePath);
    qb.leftJoinAndSelect(`${this.metadata.tablePath}.values`, AttributeValue.getRepository().metadata.tablePath);
    return await getPaged<Attribute>(qb, this.metadata.tablePath, params);
  }

  async getAttribute(id: number): Promise<Attribute> {
    return this.getById(id, ['values']);
  }

  async getAttributeByKey(key: string): Promise<Attribute> {
    const attribute = await this.findOne({
      where: { key },
      relations: ['values'],
    });
    if (!attribute) throw new HttpException(`${this.metadata.tablePath} ${key} not found!`, HttpStatus.NOT_FOUND);
    return attribute;
  }

  async getAttributeInstancesOfProduct(productId: number): Promise<AttributeToProduct[]> {
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
    attribute.title = input.title;
    attribute.type = input.type;
    attribute.icon = input.icon;
    attribute.required = input.required;
    if (input.isEnabled === undefined) attribute.isEnabled = true;

    if (action === 'create') await attribute.save();

    if (input.values) {
      const valuesObj: Record<string, TAttributeValue> = {};
      input.values.forEach((value) => {
        if (!valuesObj[value.value]) valuesObj[value.value] = value;
      });
      input.values = Object.values(valuesObj);

      const updatedValues: AttributeValue[] = [];
      input.values = input.values.sort((a, b) => (a.value > b.value ? 1 : -1));
      for (const valueInput of input.values) {
        if (!attribute.key) continue;
        const value = attribute.values?.find((val) => val.value === valueInput.value) ?? new AttributeValue();

        value.attribute = attribute;
        value.attributeId = attribute.id;
        value.key = attribute.key;
        value.value = valueInput.value;
        value.title = valueInput.title;
        value.icon = valueInput.icon;
        await value.save();
        updatedValues.push(value);
      }

      if (attribute.values) {
        for (const value of attribute.values) {
          if (!updatedValues.find((val) => value.id === val.id)) {
            await value.remove();
          }
        }
      }

      attribute.values = updatedValues;
    }

    await handleCustomMetaInput(attribute, input);
    await checkEntitySlug(attribute, Attribute);
  }

  async createAttribute(createAttribute: TAttributeInput, id?: number | null): Promise<Attribute> {
    const attribute = new Attribute();
    if (id) attribute.id = id;

    await this.handleAttributeInput(attribute, createAttribute, 'create');
    await this.save(attribute);
    return attribute;
  }

  async updateAttribute(id: number, updateAttribute: TAttributeInput): Promise<Attribute> {
    const attribute = await this.getById(id, ['values']);
    if (!attribute) throw new HttpException(`Attribute ${id} not found!`, HttpStatus.NOT_FOUND);

    await this.handleAttributeInput(attribute, updateAttribute, 'update');
    await this.save(attribute);
    return attribute;
  }

  async deleteAttribute(id: number): Promise<boolean> {
    return this.deleteEntity(id);
  }

  applyAttributeFilter(qb: SelectQueryBuilder<Attribute>, filterParams?: TBaseFilter) {
    this.applyBaseFilter(qb, filterParams);
    return qb;
  }

  async getFilteredAttributes(
    pagedParams?: TPagedParams<TAttribute>,
    filterParams?: TBaseFilter,
  ): Promise<TPagedList<Attribute>> {
    const qb = this.createQueryBuilder(this.metadata.tablePath);
    qb.select();
    qb.leftJoinAndSelect(`${this.metadata.tablePath}.values`, AttributeValue.getRepository().metadata.tablePath);
    this.applyAttributeFilter(qb, filterParams);
    return await getPaged<Attribute>(qb, this.metadata.tablePath, pagedParams);
  }

  async deleteManyFilteredAttributes(input: TDeleteManyInput, filterParams?: TBaseFilter): Promise<boolean> {
    if (!filterParams) return this.deleteMany(input);

    const qbSelect = this.createQueryBuilder(this.metadata.tablePath).select([`${this.metadata.tablePath}.id`]);
    this.applyAttributeFilter(qbSelect, filterParams);
    this.applyDeleteMany(qbSelect, input);

    const qbDelete = this.createQueryBuilder(this.metadata.tablePath)
      .delete()
      .where(`${this.metadata.tablePath}.id IN (${qbSelect.getQuery()})`)
      .setParameters(qbSelect.getParameters());

    await qbDelete.execute();
    return true;
  }
}
