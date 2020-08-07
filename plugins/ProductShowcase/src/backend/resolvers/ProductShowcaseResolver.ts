import { Resolver, Query, Mutation, Arg, FieldResolver, Root } from "type-graphql";
import { ProductCategory } from '@cromwell/core-backend';
import { PagedParamsInput } from '@cromwell/core-backend';
import { ProductCategoryRepository } from '@cromwell/core-backend';
import { ProductRepository } from '@cromwell/core-backend';
import { getCustomRepository } from "typeorm";
import { TProduct, TPagedList } from "@cromwell/core";
import { PagedProduct } from '@cromwell/core-backend';


@Resolver(ProductCategory)
export default class ProductShowcaseResolver {

    private get repo() { return getCustomRepository(ProductCategoryRepository) }

    @Query(() => ProductCategory)
    async productShowcase(@Arg("slug") slug: string) {
        return await this.repo.getProductCategoryBySlug(slug);
    }
}