import { TPagedList, TProduct } from '@cromwell/core';
import {
  getLogger,
  getPluginSettings,
  PagedProduct,
  ProductCategory,
  ProductRepository,
  ProductCategoryRepository,
} from '@cromwell/core-backend';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Arg, Query, Resolver } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

import { TSettings } from '../../types';
import { PluginProductShowcase_PageData } from '../entities/page-data.entity';

const logger = getLogger();

@Resolver(ProductCategory)
export default class PluginProductShowcaseResolver {
  private get productRepo() {
    return getCustomRepository(ProductRepository);
  }
  private get categoryRepo() {
    return getCustomRepository(ProductCategoryRepository);
  }

  @Query(() => PagedProduct)
  async pluginProductShowcase(
    @Arg('data', () => PluginProductShowcase_PageData, { nullable: true }) data?: PluginProductShowcase_PageData,
  ): Promise<TPagedList<TProduct>> {
    const timestamp = Date.now();

    let products: TPagedList<TProduct> = {
      elements: [],
    };

    const settings = await getPluginSettings<TSettings>('@cromwell/plugin-product-showcase');
    const maxSize = settings?.size ?? 20;

    if (data?.categorySlug) {
      const category = await this.categoryRepo.getProductCategoryBySlug(data.categorySlug);
      if (!category?.id)
        throw new HttpException('Category with slug ' + data?.categorySlug + ' was not found!', HttpStatus.NOT_FOUND);

      products = await this.productRepo.getProductsFromCategory(category.id, { pageSize: maxSize });
    } else if (data?.categoryId) {
      products = await this.productRepo.getProductsFromCategory(data.categoryId, { pageSize: maxSize });
    } else if (data?.pageSlug || data?.productSlug) {
      // If we are on a product page, show products from the same category
      const productSlug = data?.productSlug || data?.pageSlug;
      const product = await this.productRepo.getBySlug(productSlug, ['categories']);
      if (!product?.id)
        throw new HttpException('Product with slug ' + productSlug + ' was not found!', HttpStatus.NOT_FOUND);

      // Gather products from all related categories until reach limit (maxSize)
      for (const category of product.categories ?? []) {
        if (category?.id) {
          const categoryProducts = await this.productRepo.getProductsFromCategory(category.id, {
            pageSize: maxSize,
          });
          if (categoryProducts?.elements && products.elements) {
            for (const prod of categoryProducts.elements) {
              // Different categories may contain same products, we don't want to duplicate them
              if (products.elements.some((addedProd) => addedProd.id === prod.id)) continue;

              products.elements.push(prod);

              if (products.elements.length >= maxSize) break;
            }
          }
        }

        if (products.elements?.length && products.elements?.length >= maxSize) break;
      }

      if (products.elements && products.elements.length < maxSize) {
        (await this.productRepo.getProducts({ pageSize: maxSize }))?.elements?.forEach((prod) => {
          if (products.elements && products.elements.length < maxSize) {
            products.elements?.push(prod);
          }
        });
      }
    } else {
      products = await this.productRepo.getProducts({ pageSize: maxSize });
    }

    const timestamp2 = Date.now();
    logger.log('ProductShowcaseResolver::productShowcase time elapsed: ' + (timestamp2 - timestamp) + 'ms');

    return products;
  }
}
