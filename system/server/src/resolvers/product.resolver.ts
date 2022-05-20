import {
    EDBEntity,
    getCmsSettings,
    GraphQLPaths,
    matchPermissions,
    TPagedList,
    TPermissionName,
    TProduct,
    TProductCategory,
    TProductRating,
    TProductReview,
    TProductReviewFilter,
} from '@cromwell/core';
import {
    AttributeInstance,
    CreateProduct,
    DeleteManyInput,
    entityMetaRepository,
    FilteredProduct,
    PagedParamsInput,
    PagedProductReview,
    Product,
    ProductCategory,
    ProductCategoryRepository,
    ProductFilterInput,
    ProductRating,
    ProductRepository,
    ProductReviewRepository,
    ProductVariant,
    TGraphQLContext,
    UpdateProduct,
} from '@cromwell/core-backend';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Arg, Authorized, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

import {
    createWithFilters,
    deleteManyWithFilters,
    deleteWithFilters,
    getByIdWithFilters,
    getBySlugWithFilters,
    getManyWithFilters,
    updateWithFilters,
} from '../helpers/data-filters';

const categoriesKey: keyof TProduct = 'categories';
const ratingKey: keyof TProduct = 'rating';
const reviewsKey: keyof TProduct = 'reviews';
const viewsKey: keyof TProduct = 'views';
const attributesKey: keyof TProduct = 'attributes';
const variantsKey: keyof TProduct = 'variants';

const getOneBySlugPath = GraphQLPaths.Product.getOneBySlug;
const getOneByIdPath = GraphQLPaths.Product.getOneById;
const getManyPath = GraphQLPaths.Product.getMany;
const createPath = GraphQLPaths.Product.create;
const updatePath = GraphQLPaths.Product.update;
const deletePath = GraphQLPaths.Product.delete;
const deleteManyPath = GraphQLPaths.Product.deleteMany;

@Resolver(Product)
export class ProductResolver {

    private repository = getCustomRepository(ProductRepository)

    @Query(() => Product, { nullable: true })
    async [getOneByIdPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("id", () => Int) id: number
    ): Promise<TProduct> {
        return getByIdWithFilters('Product', ctx, [], ['read_products'], id,
            (id) => this.repository.getProductById(id, { withRating: true }));
    }

    @Query(() => Product, { nullable: true })
    async [getOneBySlugPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("slug") slug: string
    ): Promise<TProduct> {
        return getBySlugWithFilters('Product', ctx, [], ['read_products'], slug,
            (slug) => this.repository.getProductBySlug(slug, { withRating: true }));
    }

    @Query(() => FilteredProduct)
    async [getManyPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TProduct>,
        @Arg("filterParams", { nullable: true }) filterParams?: ProductFilterInput,
    ): Promise<TPagedList<TProduct>> {
        return getManyWithFilters('Product', ctx, [], ['read_products'], pagedParams, filterParams,
            (...args) => this.repository.getFilteredProducts(...args));
    }

    @Authorized<TPermissionName>('create_product')
    @Mutation(() => Product)
    async [createPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("data") data: CreateProduct
    ): Promise<TProduct> {
        return createWithFilters('Product', ctx, ['create_product'], data,
            (...args) => this.repository.createProduct(...args));
    }

    @Authorized<TPermissionName>('update_product')
    @Mutation(() => Product)
    async [updatePath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("id", () => Int) id: number,
        @Arg("data") data: UpdateProduct
    ): Promise<TProduct> {
        return updateWithFilters('Product', ctx, ['update_product'], data, id,
            (...args) => this.repository.updateProduct(...args));
    }

    @Authorized<TPermissionName>('delete_product')
    @Mutation(() => Boolean)
    async [deletePath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("id", () => Int) id: number
    ): Promise<boolean> {
        return deleteWithFilters('Product', ctx, ['delete_product'], id,
            (...args) => this.repository.deleteProduct(...args));
    }

    @Authorized<TPermissionName>('delete_product')
    @Mutation(() => Boolean)
    async [deleteManyPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("input") input: DeleteManyInput,
        @Arg("filterParams", { nullable: true }) filterParams?: ProductFilterInput,
    ): Promise<boolean | undefined> {
        return deleteManyWithFilters('Product', ctx, ['delete_product'], input, filterParams,
            (...args) => this.repository.deleteManyFilteredProducts(...args));
    }

    @FieldResolver(() => [ProductCategory], { nullable: true })
    async [categoriesKey](
        @Ctx() ctx: TGraphQLContext,
        @Root() product: Product,
    ): Promise<TProductCategory[]> {
        let categories = await getCustomRepository(ProductCategoryRepository).getCategoriesOfProduct(product.id);

        if (!matchPermissions(ctx.user, ['read_product_categories'])) {
            categories = categories?.filter(category => category.isEnabled !== false);
        }
        return categories;
    }

    @FieldResolver(() => PagedProductReview)
    async [reviewsKey](
        @Ctx() ctx: TGraphQLContext,
        @Root() product: Product,
        @Arg("pagedParams", { nullable: true }) pagedParams: PagedParamsInput<TProductReview>
    ): Promise<TPagedList<TProductReview>> {
        const filterParams: TProductReviewFilter = {
            productId: product.id,
        };
        const settings = await getCmsSettings();
        if (!matchPermissions(ctx.user, ['read_product_reviews'])) {
            if (!settings?.showUnapprovedReviews) {
                filterParams.approved = true;
            }
        }
        return getManyWithFilters('ProductReview', ctx, [], ['read_product_reviews'], pagedParams, filterParams,
            (...args) => getCustomRepository(ProductReviewRepository).getFilteredProductReviews(...args));
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

    @FieldResolver(() => [ProductVariant], { nullable: true })
    async [variantsKey](@Root() product: Product): Promise<ProductVariant[] | undefined | null> {
        return this.repository.getProductVariantsOfProduct(product.id);
    }
}
