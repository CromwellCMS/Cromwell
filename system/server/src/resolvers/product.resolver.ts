import {
    GraphQLPaths,
    TAuthRole,
    TFilteredProductList,
    TPagedList,
    TProduct,
    TProductCategory,
    TProductRating,
    TProductReview,
} from '@cromwell/core';
import {
    CreateProduct,
    DeleteManyInput,
    EntityMetaRepository,
    FilteredProduct,
    PagedParamsInput,
    PagedProduct,
    PagedProductReview,
    Product,
    ProductCategory,
    ProductCategoryRepository,
    ProductFilterInput,
    ProductRating,
    ProductRepository,
    UpdateProduct,
} from '@cromwell/core-backend';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Arg, Authorized, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

import { resetAllPagesCache } from '../helpers/reset-page';
import { serverFireAction } from '../helpers/server-fire-action';

const categoriesKey: keyof TProduct = 'categories';
const ratingKey: keyof TProduct = 'rating';
const reviewsKey: keyof TProduct = 'reviews';

const getOneBySlugPath = GraphQLPaths.Product.getOneBySlug;
const getOneByIdPath = GraphQLPaths.Product.getOneById;
const getManyPath = GraphQLPaths.Product.getMany;
const createPath = GraphQLPaths.Product.create;
const updatePath = GraphQLPaths.Product.update;
const deletePath = GraphQLPaths.Product.delete;
const deleteManyPath = GraphQLPaths.Product.deleteMany;
const deleteManyFilteredPath = GraphQLPaths.Product.deleteManyFiltered;
const getFromCategoryPath = GraphQLPaths.Product.getFromCategory;
const getFilteredPath = GraphQLPaths.Product.getFiltered;


@Resolver(Product)
export class ProductResolver {

    private repository = getCustomRepository(ProductRepository)

    @Query(() => PagedProduct)
    async [getManyPath](@Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TProduct>):
        Promise<TPagedList<TProduct>> {
        return this.repository.getProducts(pagedParams);
    }

    @Query(() => Product, { nullable: true })
    async [getOneBySlugPath](@Arg("slug") slug: string): Promise<Product | undefined> {
        return this.repository.getProductBySlug(slug);
    }

    @Query(() => Product, { nullable: true })
    async [getOneByIdPath](@Arg("id") id: string): Promise<Product | undefined> {
        return this.repository.getProductById(id);
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Product)
    async [createPath](@Arg("data") data: CreateProduct): Promise<Product> {
        const product = await this.repository.createProduct(data);
        serverFireAction('create_product', product);
        resetAllPagesCache();
        return product;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Product)
    async [updatePath](@Arg("id") id: string, @Arg("data") data: UpdateProduct): Promise<Product> {
        const product = await this.repository.updateProduct(id, data);
        serverFireAction('update_product', product);
        resetAllPagesCache();
        return product;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Boolean)
    async [deletePath](@Arg("id") id: string): Promise<boolean> {
        const product = await this.repository.deleteProduct(id);
        serverFireAction('update_product', { id });
        resetAllPagesCache();
        return product;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Boolean)
    async [deleteManyPath](@Arg("data") data: DeleteManyInput): Promise<boolean | undefined> {
        const res = await this.repository.deleteMany(data);
        resetAllPagesCache();
        return res;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Boolean)
    async [deleteManyFilteredPath](
        @Arg("input") input: DeleteManyInput,
        @Arg("filterParams", { nullable: true }) filterParams?: ProductFilterInput,
    ): Promise<boolean | undefined> {
        const res = await this.repository.deleteManyFilteredProducts(input, filterParams);
        resetAllPagesCache();
        return res;
    }

    @Query(() => PagedProduct)
    async [getFromCategoryPath](@Arg("categoryId") categoryId: string, @Arg("pagedParams") pagedParams: PagedParamsInput<TProduct>): Promise<TPagedList<TProduct>> {
        return this.repository.getProductsFromCategory(categoryId, pagedParams);
    }

    @Query(() => FilteredProduct)
    async [getFilteredPath](
        @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TProduct>,
        @Arg("filterParams", { nullable: true }) filterParams?: ProductFilterInput,
        @Arg("categoryId", { nullable: true }) categoryId?: string,
    ): Promise<TFilteredProductList | undefined> {
        return this.repository.getFilteredProducts(pagedParams, filterParams, categoryId);
    }

    @FieldResolver(() => [ProductCategory], { nullable: true })
    async [categoriesKey](@Root() product: Product, @Arg("pagedParams") pagedParams: PagedParamsInput<TProductCategory>): Promise<TProductCategory[]> {
        return getCustomRepository(ProductCategoryRepository).getCategoriesOfProduct(product.id, pagedParams);
    }

    @FieldResolver(() => PagedProductReview)
    async [reviewsKey](@Root() product: Product, @Arg("pagedParams") pagedParams: PagedParamsInput<TProductReview>): Promise<TPagedList<TProductReview>> {
        return this.repository.getReviewsOfProduct(product.id, pagedParams);
    }

    @FieldResolver(() => ProductRating)
    async [ratingKey](@Root() product: Product): Promise<TProductRating> {
        return {
            reviewsNumber: product.reviewsCount,
            average: product.averageRating,
        }
    }

    @FieldResolver(() => GraphQLJSONObject, { nullable: true })
    async customMeta(@Root() entity: Product, @Arg("fields", () => [String]) fields: string[]): Promise<any> {
        return getCustomRepository(EntityMetaRepository).getEntityMetaValuesByKeys(entity.metaId, fields);
    }
}

