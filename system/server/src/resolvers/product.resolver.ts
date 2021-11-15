import {
    EDBEntity,
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
    AttributeInstance,
    CreateProduct,
    DeleteManyInput,
    entityMetaRepository,
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
import { Arg, Authorized, FieldResolver, Int, Mutation, Query, Resolver, Root } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

import { resetAllPagesCache } from '../helpers/reset-page';
import { serverFireAction } from '../helpers/server-fire-action';

const categoriesKey: keyof TProduct = 'categories';
const ratingKey: keyof TProduct = 'rating';
const reviewsKey: keyof TProduct = 'reviews';
const viewsKey: keyof TProduct = 'views';
const attributesKey: keyof TProduct = 'attributes';

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
        return this.repository.getProductBySlug(slug, { withRating: true });
    }

    @Query(() => Product, { nullable: true })
    async [getOneByIdPath](@Arg("id", () => Int) id: number): Promise<Product | undefined> {
        return this.repository.getProductById(id, { withRating: true });
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
    async [updatePath](@Arg("id", () => Int) id: number, @Arg("data") data: UpdateProduct): Promise<Product> {
        const product = await this.repository.updateProduct(id, data);
        serverFireAction('update_product', product);
        resetAllPagesCache();
        return product;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Boolean)
    async [deletePath](@Arg("id", () => Int) id: number): Promise<boolean> {
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
    async [getFromCategoryPath](
        @Arg("categoryId", () => Int) categoryId: number,
        @Arg("pagedParams") pagedParams: PagedParamsInput<TProduct>
    ): Promise<TPagedList<TProduct>> {
        return this.repository.getProductsFromCategory(categoryId, pagedParams);
    }

    @Query(() => FilteredProduct)
    async [getFilteredPath](
        @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TProduct>,
        @Arg("filterParams", { nullable: true }) filterParams?: ProductFilterInput,
        @Arg("categoryId", () => Int, { nullable: true }) categoryId?: number,
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
    async customMeta(@Root() entity: Product, @Arg("keys", () => [String]) fields: string[]): Promise<any> {
        return entityMetaRepository.getEntityMetaByKeys(EDBEntity.Product, entity.id, fields);
    }

    @FieldResolver(() => Int, { nullable: true })
    async [viewsKey](@Root() product: Product): Promise<number | undefined> {
        return this.repository.getEntityViews(product.id, EDBEntity.Product);
    }

    @FieldResolver(() => [AttributeInstance], { nullable: true })
    async [attributesKey](@Root() product: Product): Promise<AttributeInstance[] | undefined> {
        return this.repository.getProductAttributes(product.id);
    }
}
