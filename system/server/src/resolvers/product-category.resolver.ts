import { EDBEntity, GraphQLPaths, TPagedList, TPermissionName, TProduct, TProductCategory } from '@cromwell/core';
import {
    applyDataFilters,
    CreateProductCategory,
    DeleteManyInput,
    entityMetaRepository,
    PagedParamsInput,
    PagedProduct,
    PagedProductCategory,
    ProductCategory,
    ProductCategoryFilterInput,
    ProductCategoryRepository,
    ProductRepository,
    TGraphQLContext,
    UpdateProductCategory,
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

const getOneBySlugPath = GraphQLPaths.ProductCategory.getOneBySlug;
const getOneByIdPath = GraphQLPaths.ProductCategory.getOneById;
const getManyPath = GraphQLPaths.ProductCategory.getMany;
const createPath = GraphQLPaths.ProductCategory.create;
const updatePath = GraphQLPaths.ProductCategory.update;
const deletePath = GraphQLPaths.ProductCategory.delete;
const deleteManyPath = GraphQLPaths.ProductCategory.deleteMany;
const getRootCategoriesPath = GraphQLPaths.ProductCategory.getRootCategories;
const productsKey: keyof TProductCategory = 'products';
const parentKey: keyof TProductCategory = 'parent';
const childrenKey: keyof TProductCategory = 'children';
const viewsKey: keyof TProductCategory = 'views';
const nestedLevelKey: keyof TProductCategory = 'nestedLevel';

@Resolver(ProductCategory)
export class ProductCategoryResolver {

    private repository = getCustomRepository(ProductCategoryRepository)
    private productRepository = getCustomRepository(ProductRepository)

    @Query(() => ProductCategory)
    async [getOneByIdPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("id", () => Int) id: number,
    ) {
        return getByIdWithFilters('ProductCategory', ctx, [], id,
            (...args) => this.repository.getProductCategoryById(...args));
    }

    @Query(() => ProductCategory)
    async [getOneBySlugPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("slug") slug: string,
    ) {
        return getBySlugWithFilters('ProductCategory', ctx, [], slug,
            (...args) => this.repository.getProductCategoryBySlug(...args));
    }

    @Query(() => PagedProductCategory)
    async [getManyPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TProductCategory>,
        @Arg("filterParams", { nullable: true }) filterParams?: ProductCategoryFilterInput,
    ): Promise<TPagedList<TProductCategory>> {
        return getManyWithFilters('ProductCategory', ctx, [], pagedParams, filterParams,
            (...args) => this.repository.getFilteredCategories(...args));
    }

    @Query(() => PagedProductCategory)
    async [getRootCategoriesPath](@Ctx() ctx: TGraphQLContext): Promise<TPagedList<TProductCategory>> {
        await applyDataFilters('ProductCategory', 'getRootCategoriesInput' as any as 'getManyInput', {
            user: ctx?.user,
            permissions: [],
        });
        return (await applyDataFilters('ProductCategory', 'getRootCategoriesOutput' as any as 'getManyOutput', {
            data: await this.repository.getRootCategories(),
            user: ctx?.user,
            permissions: [],
        })).data;
    }

    @Authorized<TPermissionName>('create_product_category')
    @Mutation(() => ProductCategory)
    async [createPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("data") data: CreateProductCategory
    ) {
        return createWithFilters('ProductCategory', ctx, ['create_product_category'], data,
            (...args) => this.repository.createProductCategory(...args));
    }

    @Authorized<TPermissionName>('update_product_category')
    @Mutation(() => ProductCategory)
    async [updatePath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("id", () => Int) id: number,
        @Arg("data") data: UpdateProductCategory
    ) {
        return updateWithFilters('ProductCategory', ctx, ['update_product_category'], data, id,
            (...args) => this.repository.updateProductCategory(...args));
    }

    @Authorized<TPermissionName>('delete_product_category')
    @Mutation(() => Boolean)
    async [deletePath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("id", () => Int) id: number
    ) {
        return deleteWithFilters('ProductCategory', ctx, ['delete_product_category'], id,
            (...args) => this.repository.deleteProductCategory(...args));
    }

    @Authorized<TPermissionName>('delete_product_category')
    @Mutation(() => Boolean)
    async [deleteManyPath](
        @Ctx() ctx: TGraphQLContext,
        @Arg("input") input: DeleteManyInput,
        @Arg("filterParams", { nullable: true }) filterParams?: ProductCategoryFilterInput,
    ): Promise<boolean | undefined> {
        return deleteManyWithFilters('ProductCategory', ctx, ['delete_product_category'], input, filterParams,
            (...args) => this.repository.deleteManyCategories(...args));
    }

    @FieldResolver(() => PagedProduct)
    async [productsKey](
        @Root() productCategory: ProductCategory,
        @Arg("pagedParams") pagedParams: PagedParamsInput<TProduct>
    ): Promise<TPagedList<TProduct>> {
        return this.productRepository.getProductsFromCategory(productCategory.id, pagedParams);
    }

    @FieldResolver(() => ProductCategory, { nullable: true })
    async [parentKey](@Root() productCategory: ProductCategory): Promise<TProductCategory | undefined | null> {
        return this.repository.getParentCategory(productCategory);
    }

    @FieldResolver(() => [ProductCategory])
    async [childrenKey](@Root() productCategory: ProductCategory): Promise<TProductCategory[]> {
        return this.repository.getChildCategories(productCategory);
    }

    @FieldResolver(() => GraphQLJSONObject, { nullable: true })
    async customMeta(@Root() entity: ProductCategory, @Arg("keys", () => [String]) fields: string[]): Promise<any> {
        return entityMetaRepository.getEntityMetaByKeys(EDBEntity.ProductCategory, entity.id, fields);
    }

    @FieldResolver(() => Int, { nullable: true })
    async [viewsKey](@Root() entity: ProductCategory): Promise<number | undefined> {
        return this.repository.getEntityViews(entity.id, EDBEntity.ProductCategory);
    }

    @FieldResolver(() => Int, { nullable: true })
    async [nestedLevelKey](@Root() entity: ProductCategory): Promise<number> {
        return this.repository.getNestedLevel(entity);
    }
}