import {
  TBaseFilter,
  TDeleteManyInput,
  TPagedList,
  TPagedParams,
  TProductVariant,
  TProductVariantInput,
} from '@cromwell/core';
import { HttpException, HttpStatus } from '@nestjs/common';
import { EntityRepository, getCustomRepository, SelectQueryBuilder } from 'typeorm';

import { checkEntitySlug, getPaged, handleBaseInput, handleCustomMetaInput } from '../helpers/base-queries';
import { getLogger } from '../helpers/logger';
import { ProductVariant } from '../models/entities/product-variant.entity';
import { Product } from '../models/entities/product.entity';
import { BaseRepository } from './base.repository';
import { ProductRepository } from './product.repository';

const logger = getLogger();

@EntityRepository(ProductVariant)
export class ProductVariantRepository extends BaseRepository<ProductVariant> {
  private productRepo = getCustomRepository(ProductRepository);

  constructor() {
    super(ProductVariant);
  }

  async getProductVariants(params?: TPagedParams<TProductVariant>): Promise<TPagedList<TProductVariant>> {
    return getPaged(this.createQueryBuilder(this.metadata.tablePath), this.metadata.tablePath, params);
  }

  async getProductVariant(id: number): Promise<ProductVariant> {
    logger.log('ProductVariantRepository::getProductVariant id: ' + id);
    return this.getById(id);
  }

  async handleProductVariantInput(
    productVariant: ProductVariant,
    input: TProductVariantInput,
    action: 'update' | 'create',
    product?: Product | null,
  ) {
    await handleBaseInput(productVariant, input);

    if (!product) product = input.productId ? await this.productRepo.getProductById(input.productId) : null;
    if (!product)
      throw new HttpException(
        `ProductVariantRepository: productId ${input.productId} not found!`,
        HttpStatus.NOT_FOUND,
      );
    productVariant.product = product;
    productVariant.name = input.name;
    productVariant.price = input.price;
    productVariant.oldPrice = input.oldPrice;
    productVariant.sku = input.sku;
    productVariant.mainImage = input.mainImage;
    productVariant.images = input.images;
    productVariant.description = input.description;
    productVariant.descriptionDelta = input.descriptionDelta;
    productVariant.stockAmount = input.stockAmount;
    productVariant.manageStock = input.manageStock;
    productVariant.stockStatus = input.stockStatus;
    productVariant.attributes = input.attributes;

    if (action === 'create') await productVariant.save();
    await checkEntitySlug(productVariant, ProductVariant);
    await handleCustomMetaInput(productVariant, input);
  }

  async createProductVariant(
    createProductVariant: TProductVariantInput,
    id?: number | null,
    product?: Product,
  ): Promise<ProductVariant> {
    logger.log('ProductVariantRepository::createProductVariant');
    const productVariant = new ProductVariant();
    if (id) productVariant.id = id;

    await this.handleProductVariantInput(productVariant, createProductVariant, 'create', product);
    await this.save(productVariant);

    return productVariant;
  }

  async updateProductVariant(
    id: number,
    updateProductVariant: TProductVariantInput,
    product?: Product,
  ): Promise<ProductVariant> {
    logger.log('ProductVariantRepository::updateProductVariant; id: ' + id);
    const productVariant = await this.getById(id);

    await this.handleProductVariantInput(productVariant, updateProductVariant, 'update', product);
    await this.save(productVariant);
    return productVariant;
  }

  async deleteProductVariant(id: number): Promise<boolean> {
    logger.log('ProductVariantRepository::deleteProductVariant; id: ' + id);

    const productVariant = await this.getProductVariant(id);
    if (!productVariant) {
      return false;
    }
    await this.delete(id);
    return true;
  }

  applyProductVariantFilter(qb: SelectQueryBuilder<TProductVariant>, filterParams?: TBaseFilter) {
    this.applyBaseFilter(qb, filterParams);
  }

  async getFilteredProductVariants(
    pagedParams?: TPagedParams<TProductVariant>,
    filterParams?: TBaseFilter,
  ): Promise<TPagedList<TProductVariant>> {
    const qb = this.createQueryBuilder(this.metadata.tablePath);
    qb.select();
    this.applyProductVariantFilter(qb, filterParams);
    return await getPaged<TProductVariant>(qb, this.metadata.tablePath, pagedParams);
  }

  async deleteManyFilteredProductVariants(input: TDeleteManyInput, filterParams?: TBaseFilter): Promise<boolean> {
    if (!filterParams) return this.deleteMany(input);

    const qbSelect = this.createQueryBuilder(this.metadata.tablePath).select([`${this.metadata.tablePath}.id`]);
    this.applyProductVariantFilter(qbSelect, filterParams);
    this.applyDeleteMany(qbSelect, input);

    const qbDelete = this.createQueryBuilder(this.metadata.tablePath)
      .delete()
      .where(`${this.metadata.tablePath}.id IN (${qbSelect.getQuery()})`)
      .setParameters(qbSelect.getParameters());

    await qbDelete.execute();
    return true;
  }

  async handleVariantsInputForProduct(product: Product, variants: TProductVariantInput[]): Promise<ProductVariant[]> {
    const currentVariants = await getCustomRepository(ProductRepository).getProductVariantsOfProduct(product.id);

    const updatedVariants = (
      await Promise.all(
        variants.map(async (variant) => {
          variant.productId = product.id;
          let updated: ProductVariant | undefined;
          try {
            const entity = variant.id && (await this.getById(variant.id).catch((e) => ''));

            if (typeof entity === 'object' && entity?.id) {
              // Update
              updated = await this.updateProductVariant(entity.id, variant, product);
            } else {
              // Create
              updated = await this.createProductVariant(variant, null, product);
            }
          } catch (error) {
            logger.error(error);
          }
          return updated as ProductVariant;
        }),
      )
    ).filter(Boolean);

    if (currentVariants)
      await Promise.all(
        currentVariants.map(async (current) => {
          if (!updatedVariants.find((updated) => updated.id === current.id)) {
            await this.deleteProductVariant(current.id);
          }
        }),
      );

    return updatedVariants;
  }
}
