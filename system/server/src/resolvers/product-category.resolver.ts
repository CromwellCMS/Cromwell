import {
  EDBEntity,
  GraphQLPaths,
  TPagedList,
  TPermissionName,
  matchPermissions,
  TProduct,
  TProductCategory,
} from '@cromwell/core';
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
  ProductFilterInput,
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
  setupFilterForEnabledOnly,
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
  private repository = getCustomRepository(ProductCategoryRepository);
  private productRepository = getCustomRepository(ProductRepository);

  @Query(() => ProductCategory)
  async [getOneByIdPath](@Ctx() ctx: TGraphQLContext, @Arg('id', () => Int) id: number) {
    return getByIdWithFilters('ProductCategory', ctx, [], ['read_product_categories'], id, (...args) =>
      this.repository.getProductCategoryById(...args),
    );
  }

  @Query(() => ProductCategory)
  async [getOneBySlugPath](@Ctx() ctx: TGraphQLContext, @Arg('slug', () => String) slug: string) {
    return getBySlugWithFilters('ProductCategory', ctx, [], ['read_product_categories'], slug, (...args) =>
      this.repository.getProductCategoryBySlug(...args),
    );
  }

  @Query(() => PagedProductCategory)
  async [getManyPath](
    @Ctx() ctx: TGraphQLContext,
    @Arg('pagedParams', () => PagedParamsInput, { nullable: true }) pagedParams?: PagedParamsInput<TProductCategory>,
    @Arg('filterParams', () => ProductCategoryFilterInput, { nullable: true })
    filterParams?: ProductCategoryFilterInput,
  ): Promise<TPagedList<TProductCategory>> {
    return getManyWithFilters(
      'ProductCategory',
      ctx,
      [],
      ['read_product_categories'],
      pagedParams,
      filterParams,
      (...args) => this.repository.getFilteredCategories(...args),
    );
  }

  @Query(() => PagedProductCategory)
  async [getRootCategoriesPath](@Ctx() ctx: TGraphQLContext): Promise<TPagedList<TProductCategory>> {
    await applyDataFilters('ProductCategory', 'getRootCategoriesInput' as any as 'getManyInput', {
      user: ctx?.user,
      permissions: [],
    });
    const categories = (
      await applyDataFilters('ProductCategory', 'getRootCategoriesOutput' as any as 'getManyOutput', {
        data: await this.repository.getRootCategories(),
        user: ctx?.user,
        permissions: [],
      })
    ).data;
    if (categories?.elements && !matchPermissions(ctx.user, ['read_product_categories'])) {
      categories.elements = categories.elements.filter((category) => category.isEnabled !== false);
    }
    return categories;
  }

  @Authorized<TPermissionName>('create_product_category')
  @Mutation(() => ProductCategory)
  async [createPath](
    @Ctx() ctx: TGraphQLContext,
    @Arg('data', () => CreateProductCategory) data: CreateProductCategory,
  ) {
    return createWithFilters('ProductCategory', ctx, ['create_product_category'], data, (...args) =>
      this.repository.createProductCategory(...args),
    );
  }

  @Authorized<TPermissionName>('update_product_category')
  @Mutation(() => ProductCategory)
  async [updatePath](
    @Ctx() ctx: TGraphQLContext,
    @Arg('id', () => Int) id: number,
    @Arg('data', () => UpdateProductCategory) data: UpdateProductCategory,
  ) {
    return updateWithFilters('ProductCategory', ctx, ['update_product_category'], data, id, (...args) =>
      this.repository.updateProductCategory(...args),
    );
  }

  @Authorized<TPermissionName>('delete_product_category')
  @Mutation(() => Boolean)
  async [deletePath](@Ctx() ctx: TGraphQLContext, @Arg('id', () => Int) id: number) {
    return deleteWithFilters('ProductCategory', ctx, ['delete_product_category'], id, (...args) =>
      this.repository.deleteProductCategory(...args),
    );
  }

  @Authorized<TPermissionName>('delete_product_category')
  @Mutation(() => Boolean)
  async [deleteManyPath](
    @Ctx() ctx: TGraphQLContext,
    @Arg('input', () => DeleteManyInput) input: DeleteManyInput,
    @Arg('filterParams', () => ProductCategoryFilterInput, { nullable: true })
    filterParams?: ProductCategoryFilterInput,
  ): Promise<boolean | undefined> {
    return deleteManyWithFilters('ProductCategory', ctx, ['delete_product_category'], input, filterParams, (...args) =>
      this.repository.deleteManyCategories(...args),
    );
  }

  @FieldResolver(() => PagedProduct)
  async [productsKey](
    @Ctx() ctx: TGraphQLContext,
    @Root() productCategory: ProductCategory,
    @Arg('pagedParams', () => PagedParamsInput) pagedParams: PagedParamsInput<TProduct>,
    @Arg('filterParams', () => ProductFilterInput, { nullable: true }) filterParams?: ProductFilterInput,
  ): Promise<TPagedList<TProduct>> {
    if (!filterParams) filterParams = {};
    filterParams.categoryId = productCategory.id;

    if (!matchPermissions(ctx.user, ['read_products'])) {
      filterParams = setupFilterForEnabledOnly(filterParams);
    }
    return this.productRepository.getFilteredProducts(pagedParams, filterParams);
  }

  @FieldResolver(() => ProductCategory, { nullable: true })
  async [parentKey](
    @Ctx() ctx: TGraphQLContext,
    @Root() productCategory: ProductCategory,
  ): Promise<TProductCategory | undefined | null> {
    const category = await this.repository.getParentCategory(productCategory);
    if (category?.isEnabled === false && !matchPermissions(ctx.user, ['read_product_categories'])) return;
    return category;
  }

  @FieldResolver(() => [ProductCategory])
  async [childrenKey](
    @Ctx() ctx: TGraphQLContext,
    @Root() productCategory: ProductCategory,
  ): Promise<TProductCategory[]> {
    let categories = await this.repository.getChildCategories(productCategory);
    if (!matchPermissions(ctx.user, ['read_product_categories'])) {
      categories = categories.filter((category) => category.isEnabled !== false);
    }
    return categories;
  }

  @FieldResolver(() => GraphQLJSONObject, { nullable: true })
  async customMeta(@Root() entity: ProductCategory, @Arg('keys', () => [String]) fields: string[]): Promise<any> {
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
