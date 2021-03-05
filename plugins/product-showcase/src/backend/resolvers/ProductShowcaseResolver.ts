import { logFor, TPagedList, TProduct } from '@cromwell/core';
import { getLogger, PagedProduct, PluginRepository, ProductCategory, ProductRepository } from '@cromwell/core-backend';
import { Arg, Query, Resolver } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

import { TSettings } from '../../types';

const logger = getLogger('detailed');


@Resolver(ProductCategory)
export default class ProductShowcaseResolver {

    private get productRepo() { return getCustomRepository(ProductRepository) }

    @Query(() => PagedProduct)
    async productShowcase(@Arg("slug", { nullable: true }) slug?: string): Promise<TPagedList<TProduct>> {
        logger.log('ProductShowcaseResolver::productShowcase slug:' + slug);
        const timestamp = Date.now();

        let products: TPagedList<TProduct> = {
            elements: []
        };
        const settings = await getCustomRepository(PluginRepository).getPluginSettings<TSettings>('@cromwell/plugin-product-showcase');
        const maxSize = settings?.size ?? 20;

        if (slug) {
            const product = await this.productRepo.getBySlug(slug, ['categories']);
            if (!product?.id) throw new Error('Product with slug ' + slug + ' was not found!');

            // Gather products from all related categories until reach limit (maxSize)
            for (const category of product.categories ?? []) {
                if (category?.id) {
                    const categoryProducts = await this.productRepo.getProductsFromCategory(category.id, {
                        pageSize: maxSize
                    });
                    if (categoryProducts?.elements && products.elements) {
                        for (const prod of categoryProducts.elements) {

                            // Differnt categories may contain same products, we don't want to duplicate them
                            if (products.elements.some(addedProd => addedProd.id === prod.id)) continue;

                            products.elements.push(prod);

                            if (products.elements?.length &&
                                products.elements?.length >= maxSize) break;
                        }

                    }
                }

                if (products.elements?.length &&
                    products.elements?.length >= maxSize) break;
            }
        } else {
            products = await this.productRepo.getPaged({ pageSize: maxSize });
        }

        const timestamp2 = Date.now();
        logger.log('ProductShowcaseResolver::productShowcase time elapsed: ' + (timestamp2 - timestamp) + 'ms');

        return products;
    }
}