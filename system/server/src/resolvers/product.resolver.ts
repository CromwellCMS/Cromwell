import { GraphQLPaths, TFilteredProductList, TPagedList, TProduct, TProductCategory, TProductRating, TProductReview } from '@cromwell/core';
import {
    CreateProduct,
    PagedParamsInput,
    PagedProduct,
    PagedProductReview,
    Product,
    ProductCategory,
    ProductCategoryRepository,
    ProductRating,
    ProductRepository,
    UpdateProduct,
    ProductFilterInput,
    FilteredProduct,
    DeleteManyInput
} from '@cromwell/core-backend';
import { Arg, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

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

    @Mutation(() => Product)
    async [createPath](@Arg("data") data: CreateProduct): Promise<Product> {
        return this.repository.createProduct(data);
    }

    @Mutation(() => Product)
    async [updatePath](@Arg("id") id: string, @Arg("data") data: UpdateProduct): Promise<Product> {
        return this.repository.updateProduct(id, data);
    }

    @Mutation(() => Boolean)
    async [deletePath](@Arg("id") id: string): Promise<boolean> {
        return this.repository.deleteProduct(id);
    }

    @Mutation(() => Boolean)
    async [deleteManyPath](@Arg("data") data: DeleteManyInput): Promise<boolean | undefined> {
        return this.repository.deleteMany(data);
    }

    @Mutation(() => Boolean)
    async [deleteManyFilteredPath](
        @Arg("input") input: DeleteManyInput,
        @Arg("filterParams", { nullable: true }) filterParams?: ProductFilterInput,
    ): Promise<boolean | undefined> {
        return this.repository.deleteManyFilteredProducts(input, filterParams);
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
}

