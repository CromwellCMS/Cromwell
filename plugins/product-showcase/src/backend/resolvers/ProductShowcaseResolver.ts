import { logFor, TPagedList, TProduct } from '@cromwell/core';
import {
    PagedProduct,
    PluginRepository,
    ProductCategory,
    ProductCategoryRepository,
    ProductRepository,
} from '@cromwell/core-backend';
import { Arg, Query, Resolver } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

import { TSettings } from '../../types';

@Resolver(ProductCategory)
export default class ProductShowcaseResolver {

    private get repo() { return getCustomRepository(ProductCategoryRepository) }
    private get productRepo() { return getCustomRepository(ProductRepository) }

    @Query(() => PagedProduct)
    async productShowcase(@Arg("slug", { nullable: true }) slug?: string): Promise<TPagedList<TProduct>> {
        logFor('detailed', 'ProductShowcaseResolver::productShowcase slug:' + slug);
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
            for (const category of product.categories) {
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
        logFor('detailed', 'ProductShowcaseResolver::productShowcase time elapsed: ' + (timestamp2 - timestamp) + 'ms');

        return products;
    }
}