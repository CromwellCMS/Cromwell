import {
  EDBEntity,
  TDeleteManyInput,
  TFilteredProductList,
  TPagedList,
  TPagedParams,
  TProduct,
  TProductFilter,
  TProductFilterMeta,
  TProductInput,
  TProductRating,
  TProductReview,
} from '@cromwell/core';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Brackets, EntityRepository, getCustomRepository, SelectQueryBuilder } from 'typeorm';

import {
  applyGetManyFromOne,
  checkEntitySlug,
  getPaged,
  handleBaseInput,
  handleCustomMetaInput,
} from '../helpers/base-queries';
import { getLogger } from '../helpers/logger';
import { AttributeToProduct } from '../models/entities/attribute-product.entity';
import { AttributeValue } from '../models/entities/attribute-value.entity';
import { Attribute } from '../models/entities/attribute.entity';
import { ProductReview } from '../models/entities/product-review.entity';
import { ProductVariant } from '../models/entities/product-variant.entity';
import { Product } from '../models/entities/product.entity';
import { AttributeInstance } from '../models/objects/attribute-instance.object';
import { AttributeRepository } from './attribute.repository';
import { BaseRepository } from './base.repository';
import { ProductCategoryRepository } from './product-category.repository';
import { ProductReviewRepository } from './product-review.repository';
import { ProductVariantRepository } from './product-variant.repository';

const logger = getLogger();
const averageKey: keyof Product = 'averageRating';
const reviewsCountKey: keyof Product = 'reviewsCount';
const ratingKey: keyof TProductReview = 'rating';

type TGetProductOptions = {
  withRating?: boolean;
  withAttributes?: boolean;
  withCategories?: boolean;
  withVariants?: boolean;
};

@EntityRepository(Product)
export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super(Product);
  }

  applyGetProductRating(qb: SelectQueryBuilder<TProduct>) {
    const reviewTable = getCustomRepository(ProductReviewRepository).metadata.tablePath;
    qb.addSelect(`AVG(${reviewTable}.${String(ratingKey)})`, this.metadata.tablePath + '_' + averageKey)
      .addSelect(`COUNT(${reviewTable}.id)`, this.metadata.tablePath + '_' + reviewsCountKey)
      .leftJoin(
        ProductReview,
        reviewTable,
        `${reviewTable}.${this.quote('productId')} = ${this.metadata.tablePath}.id AND ` +
          `${reviewTable}.${this.quote('approved')} = :approvedValue `,
      )
      .setParameter('approvedValue', true)
      .groupBy(`${this.metadata.tablePath}.id`);
  }

  async applyAndGetPagedProducts(
    qb: SelectQueryBuilder<Product>,
    params?: TPagedParams<TProduct>,
  ): Promise<TPagedList<Product>> {
    this.applyGetProductRating(qb);

    if (params?.orderBy === 'rating') {
      params.orderBy = (this.metadata.tablePath + '_' + averageKey) as any;
      return getPaged<Product>(qb, undefined, params);
    }
    if (params?.orderBy === 'views') {
      this.applyGetEntityViews(qb, EDBEntity.Product);
      params.orderBy = (this.metadata.tablePath + '_' + 'views') as any;
      return getPaged<Product>(qb, undefined, params);
    }
    return await getPaged<Product>(qb, this.metadata.tablePath, params);
  }

  async getProducts(params?: TPagedParams<TProduct>): Promise<TPagedList<Product>> {
    const qb = this.createQueryBuilder(this.metadata.tablePath);
    return await this.applyAndGetPagedProducts(qb, params);
  }

  async getProductById(id: number, options?: TGetProductOptions): Promise<Product> {
    const qb = this.createQueryBuilder(this.metadata.tablePath).select();

    if (options?.withRating) {
      this.applyGetProductRating(qb);
    }
    qb.where(`${this.metadata.tablePath}.id = :id`, { id });
    const product = await qb.getOne();
    if (!product) throw new HttpException(`Product ${id} not found!`, HttpStatus.NOT_FOUND);

    await this.applyGetProductOptions(product, options);
    return product;
  }

  async getProductBySlug(slug: string, options?: TGetProductOptions): Promise<Product> {
    const qb = this.createQueryBuilder(this.metadata.tablePath).select();

    if (options?.withRating) {
      this.applyGetProductRating(qb);
    }
    const product = await qb.where(`${this.metadata.tablePath}.slug = :slug`, { slug }).getOne();
    if (!product) throw new HttpException(`Product ${slug} not found!`, HttpStatus.NOT_FOUND);

    await this.applyGetProductOptions(product, options);
    return product;
  }

  private async applyGetProductOptions(product?: Product, options?: TGetProductOptions) {
    if (!product?.id || !options) return;
    if (options.withAttributes) {
      product.attributes = await this.getProductAttributes(product.id);
    }
    if (options.withCategories) {
      product.categories = await getCustomRepository(ProductCategoryRepository).getCategoriesOfProduct(product.id);
    }
    if (options.withVariants) {
      product.variants = await this.getProductVariantsOfProduct(product.id);
    }
  }

  async handleProductInput(product: Product, input: TProductInput, action: 'update' | 'create') {
    await handleBaseInput(product, input);
    product.name = input.name;
    product.price = input.price;
    product.oldPrice = input.oldPrice;
    product.sku = input.sku;
    product.mainImage = input.mainImage;
    product.images = input.images;
    product.description = input.description;
    product.descriptionDelta = input.descriptionDelta;
    product.stockAmount = input.stockAmount;
    product.stockStatus = input.stockStatus;
    product.manageStock = input.manageStock;

    if (action === 'create') await product.save();

    if (input.variants) {
      await getCustomRepository(ProductVariantRepository).handleVariantsInputForProduct(product, input.variants);
    } else product.variants = input.variants;

    // Move mainImage into first item in the array if it is not
    if (product.images && product.images.length > 0 && product.mainImage && product.images[0] !== product.mainImage) {
      const images = [...product.images];
      const index = images.indexOf(product.mainImage);
      if (index > -1) {
        images.splice(index, 1);
        product.images = [product.mainImage, ...images];
      }
    }
    // Set mainImage from array if it hasn't been set
    if (!product.mainImage && product.images && product.images.length > 0) {
      product.mainImage = product.images[0];
    }

    if (input.attributes) {
      // Flatten attributes and values
      const inputValues: (Partial<AttributeToProduct> & {
        attribute: Attribute;
        attributeValue: AttributeValue;
      })[] = [];

      for (const inputAttribute of input.attributes) {
        if (!inputAttribute.key) continue;
        const attribute = await getCustomRepository(AttributeRepository).getAttributeByKey(inputAttribute.key);
        if (!attribute) continue;

        for (const inputValue of inputAttribute.values || []) {
          if (!attribute.values) continue;
          const attributeValue = attribute.values.find((value) => value.value === inputValue.value);
          if (!attributeValue) continue;

          inputValues.push({
            key: inputAttribute.key,
            value: inputValue.value,
            attribute,
            attributeValue,
          });
        }

        if (attribute.type === 'text_input') {
          const attributeValue = attribute.values?.find((value) => value.value === 'text_input');
          if (attributeValue) {
            inputValues.push({
              key: inputAttribute.key,
              value: 'text_input',
              attribute,
              attributeValue,
            });
          }
        }
      }

      // Remove current records that aren't in inputValues
      if (product.attributeValues?.length) {
        for (const value of product.attributeValues) {
          if (!inputValues.find((inputVal) => inputVal.value === value.value && inputVal.key === value.key)) {
            await value.remove();
          }
        }
      }

      const updatedValues: AttributeToProduct[] = [];
      // Create new or update current
      for (const inputValue of inputValues) {
        const currentValue = product.attributeValues?.find(
          (value) => value.key === inputValue.key && value.value === inputValue.value,
        );

        if (currentValue) {
          await currentValue.save();
          updatedValues.push(currentValue);
        } else {
          const newValue = await getCustomRepository(AttributeRepository).addAttributeValueToProduct(
            product,
            inputValue.attributeValue,
          );

          if (newValue) updatedValues.push(newValue);
        }
      }
      product.attributeValues = updatedValues;
    }

    // Check main category
    if (input.mainCategoryId) {
      try {
        const main = await getCustomRepository(ProductCategoryRepository).getProductCategoryById(input.mainCategoryId);
        product.mainCategory = main;
      } catch (error) {
        throw new HttpException(`Main category ${input.mainCategoryId} not found!`, HttpStatus.NOT_FOUND);
      }

      if (input.categoryIds && !input.categoryIds.includes(input.mainCategoryId)) {
        input.categoryIds.push(input.mainCategoryId);
      }
    }
    if (input.mainCategoryId === null) {
      product.mainCategory = null;
    }

    if (input.categoryIds) {
      product.categories = await getCustomRepository(ProductCategoryRepository).getProductCategoriesById(
        input.categoryIds,
      );
    }

    await handleCustomMetaInput(product, input);
    await checkEntitySlug(product, Product);
  }

  async createProduct(createProduct: TProductInput, id?: number | null): Promise<Product> {
    const product = new Product();
    if (id) product.id = id;

    await this.handleProductInput(product, createProduct, 'create');
    await this.save(product);
    return product;
  }

  async updateProduct(id: number, updateProduct: TProductInput): Promise<Product> {
    const product = await this.findOne({
      where: { id },
      relations: ['categories', 'attributeValues'],
    });
    if (!product) throw new HttpException(`Product ${id} not found!`, HttpStatus.NOT_FOUND);

    await this.handleProductInput(product, updateProduct, 'update');
    await this.save(product);
    return product;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const product = await this.getProductById(id);
    if (!product) {
      logger.error('ProductRepository::deleteProduct failed to find product by id');
      return false;
    }
    await this.delete(id);
    return true;
  }

  async getProductsFromCategory(categoryId: number, params?: TPagedParams<TProduct>): Promise<TPagedList<Product>> {
    const categoryTable = getCustomRepository(ProductCategoryRepository).metadata.tablePath;
    const qb = this.createQueryBuilder(this.metadata.tablePath).select();
    applyGetManyFromOne(qb, this.metadata.tablePath, 'categories', categoryTable, categoryId);
    return this.applyAndGetPagedProducts(qb, params);
  }

  async getReviewsOfProduct(
    productId: number,
    params?: TPagedParams<TProductReview>,
  ): Promise<TPagedList<ProductReview>> {
    const reviewTable = getCustomRepository(ProductReviewRepository).metadata.tablePath;

    const qb = getCustomRepository(ProductReviewRepository).createQueryBuilder(reviewTable).select();
    applyGetManyFromOne(qb, reviewTable, 'product', this.metadata.tablePath, productId);
    return getPaged<ProductReview>(qb, reviewTable, params);
  }

  async getProductRating(productId: number): Promise<TProductRating> {
    const reviewTable = getCustomRepository(ProductReviewRepository).metadata.tablePath;
    const qb = getCustomRepository(ProductReviewRepository).createQueryBuilder(reviewTable).select();
    applyGetManyFromOne(qb, reviewTable, 'product', this.metadata.tablePath, productId);

    const reviewsNumberKey: keyof TProductRating = 'reviewsNumber';
    const averageKey: keyof TProductRating = 'average';
    const ratingKey: keyof TProductReview = 'rating';
    qb.select('COUNT()', reviewsNumberKey);
    qb.addSelect(`AVG(${ratingKey})`, averageKey);

    const raw = await qb.getRawOne();
    return raw;
  }

  applyProductFilter(qb: SelectQueryBuilder<Product>, filterParams?: TProductFilter) {
    this.applyBaseFilter(qb, filterParams);

    if (!filterParams) return;
    if (filterParams.categoryId) {
      applyGetManyFromOne(
        qb,
        this.metadata.tablePath,
        'categories',
        getCustomRepository(ProductCategoryRepository).metadata.tablePath,
        filterParams.categoryId,
      );
    }

    // Attribute filter
    if (filterParams.attributes?.length) {
      const productAttributeTable = AttributeToProduct.getRepository().metadata.tablePath;

      filterParams.attributes.forEach((attr, attrIndex) => {
        if (!attr.key || !attr.values?.length) return;

        const joinName = `${productAttributeTable}_${attrIndex}`;
        qb.leftJoin(
          AttributeToProduct,
          joinName,
          `${joinName}.${this.quote('productId')} = ${this.metadata.tablePath}.id `,
        );
      });

      filterParams.attributes.forEach((attr, attrIndex) => {
        if (!attr.key || !attr.values?.length) return;
        const joinName = `${productAttributeTable}_${attrIndex}`;

        const brackets = new Brackets((subQb1) => {
          attr.values.forEach((val, valIndex) => {
            const brackets = new Brackets((subQb2) => {
              const keyProp = `key_${attrIndex}`;
              const valueProp = `value_${attrIndex}_${valIndex}`;
              subQb2.where(`${joinName}.${this.quote('key')} = :${keyProp}`, { [keyProp]: attr.key });
              subQb2.andWhere(`${joinName}.${this.quote('value')} = :${valueProp}`, { [valueProp]: val });
            });
            subQb1.orWhere(brackets);
          });
        });
        qb.andWhere(brackets);
      });
    }

    // Search by product name or sku or id
    if (filterParams.nameSearch) {
      const nameLikeStr = `%${filterParams.nameSearch}%`;

      const brackets = new Brackets((subQb) => {
        subQb.where(`${this.metadata.tablePath}.name ${this.getSqlLike()} :nameLikeStr`, { nameLikeStr });
        subQb.orWhere(`${this.metadata.tablePath}.sku ${this.getSqlLike()} :nameLikeStr`, { nameLikeStr });

        if (!isNaN(parseInt(filterParams.nameSearch + '')))
          subQb.orWhere(`${this.metadata.tablePath}.id = :idSearch`, {
            idSearch: filterParams.nameSearch,
          });
      });
      qb.andWhere(brackets);
    }

    // Price filter
    if (filterParams.maxPrice) {
      const query = `${this.metadata.tablePath}.price <= :maxPrice`;
      qb.andWhere(query, { maxPrice: filterParams.maxPrice });
    }
    if (filterParams.minPrice) {
      const query = `${this.metadata.tablePath}.price >= :minPrice`;
      qb.andWhere(query, { minPrice: filterParams.minPrice });
    }
  }

  async getFilteredProducts(
    pagedParams?: TPagedParams<TProduct>,
    filterParams?: TProductFilter,
  ): Promise<TFilteredProductList> {
    const getQb = (shouldApplyPriceFilter = true): SelectQueryBuilder<Product> => {
      const qb = this.createQueryBuilder(this.metadata.tablePath).select();

      this.applyProductFilter(
        qb,
        shouldApplyPriceFilter
          ? filterParams
          : {
              ...filterParams,
              maxPrice: undefined,
              minPrice: undefined,
            },
      );
      return qb;
    };

    const getFilterMeta = async (): Promise<TProductFilterMeta> => {
      // Get max price
      const qb = getQb(false);

      let [maxPrice, minPrice] = await Promise.all([
        qb
          .select(`MAX(${this.metadata.tablePath}.price)`, 'maxPrice')
          .orderBy()
          .groupBy()
          .getRawOne()
          .then((res) => res?.maxPrice),
        qb
          .select(`MIN(${this.metadata.tablePath}.price)`, 'minPrice')
          .orderBy()
          .groupBy()
          .getRawOne()
          .then((res) => res?.minPrice),
      ]);
      if (maxPrice && typeof maxPrice === 'string') maxPrice = parseInt(maxPrice);
      if (minPrice && typeof minPrice === 'string') minPrice = parseInt(minPrice);

      return {
        minPrice,
        maxPrice,
      };
    };

    const getElements = async (): Promise<TPagedList<TProduct>> => {
      return this.applyAndGetPagedProducts(getQb(), pagedParams);
    };

    const [filterMeta, paged] = await Promise.all([getFilterMeta(), getElements()]);

    const filtered: TFilteredProductList = {
      ...paged,
      filterMeta,
    };
    return filtered;
  }

  async deleteManyFilteredProducts(input: TDeleteManyInput, filterParams?: TProductFilter): Promise<boolean> {
    if (!filterParams) return this.deleteMany(input);

    const qbSelect = this.createQueryBuilder(this.metadata.tablePath).select([`${this.metadata.tablePath}.id`]);
    this.applyProductFilter(qbSelect, filterParams);
    this.applyDeleteMany(qbSelect, input);

    const qbDelete = this.createQueryBuilder(this.metadata.tablePath)
      .delete()
      .where(`${this.metadata.tablePath}.id IN (${qbSelect.getQuery()})`)
      .setParameters(qbSelect.getParameters());

    await qbDelete.execute();
    return true;
  }

  attributeRecordsToProductAttributeInstances(records?: AttributeToProduct[] | null): AttributeInstance[] | undefined {
    if (!records) return;

    const instances: Record<string, AttributeInstance> = {};
    records.forEach((record) => {
      if (!instances[record.key]) {
        instances[record.key] = {
          key: record.key,
          values: [],
        };
      }
      instances[record.key].values.push({
        value: record.value,
      });
    });
    return Object.values(instances);
  }

  async getProductAttributes(productId: number): Promise<AttributeInstance[] | undefined> {
    const records = await getCustomRepository(AttributeRepository).getAttributeInstancesOfProduct(productId);
    return this.attributeRecordsToProductAttributeInstances(records);
  }

  async getProductVariantsOfProduct(productId: number): Promise<ProductVariant[]> {
    return getCustomRepository(ProductVariantRepository).find({
      where: { productId },
    });
  }
}
