import { Resolver, Query, Mutation, Arg, FieldResolver, Root } from "type-graphql";
import { ProductCategory } from '@cromwell/core-backend';
import { PagedParamsInput } from '@cromwell/core-backend';
import { ProductCategoryRepository } from '@cromwell/core-backend';
import { ProductRepository } from '@cromwell/core-backend';
import { getCustomRepository } from "typeorm";
import { TProduct } from "@cromwell/core";
import { Product } from '@cromwell/core-backend';


@Resolver(ProductCategory)
export default class ProductShowcaseResolver {

    private get repo() { return getCustomRepository(ProductCategoryRepository) }

    @Query(() => ProductCategory)
    async productShowcase(@Arg("slug") slug: string) {
        return await this.repo.getProductCategoryBySlug(slug);
    }

    @FieldResolver(() => [Product])
    async products(@Root() productCategory: ProductCategory, @Arg("pagedParams") pagedParams: PagedParamsInput<TProduct>): Promise<TProduct[]> {
        return await getCustomRepository(ProductRepository).getProductsFromCategory(productCategory.id, pagedParams);
    }
}