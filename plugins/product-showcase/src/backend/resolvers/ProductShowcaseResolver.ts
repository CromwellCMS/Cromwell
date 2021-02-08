import { logFor } from '@cromwell/core';
import { ProductCategory, ProductCategoryRepository } from '@cromwell/core-backend';
import { Arg, Query, Resolver } from 'type-graphql';
import { getCustomRepository } from 'typeorm';


@Resolver(ProductCategory)
export default class ProductShowcaseResolver {

    private get repo() { return getCustomRepository(ProductCategoryRepository) }

    @Query(() => ProductCategory)
    async productShowcase(@Arg("slug") slug: string) {
        logFor('detailed', 'ProductShowcaseResolver::productShowcase slug:' + slug);
        const timestamp = Date.now();
        const category = await this.repo.getProductCategoryBySlug(slug);

        const timestamp2 = Date.now();
        logFor('detailed', 'ProductShowcaseResolver::productShowcase time elapsed: ' + (timestamp2 - timestamp) + 'ms');

        return category;
    }
}