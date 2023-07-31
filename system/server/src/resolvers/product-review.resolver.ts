import { GraphQLPaths, matchPermissions, TPagedList, TPermissionName, TProductReview } from '@cromwell/core';
import {
  DeleteManyInput,
  getCmsSettings,
  PagedParamsInput,
  PagedProductReview,
  ProductReview,
  ProductReviewFilter,
  ProductReviewInput,
  ProductReviewRepository,
  TGraphQLContext,
} from '@cromwell/core-backend';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Arg, Authorized, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

import {
  createWithFilters,
  deleteManyWithFilters,
  deleteWithFilters,
  getByIdWithFilters,
  getManyWithFilters,
  updateWithFilters,
} from '../helpers/data-filters';

const getOneByIdPath = GraphQLPaths.ProductReview.getOneById;
const getManyPath = GraphQLPaths.ProductReview.getMany;
const createPath = GraphQLPaths.ProductReview.create;
const updatePath = GraphQLPaths.ProductReview.update;
const deletePath = GraphQLPaths.ProductReview.delete;
const deleteManyPath = GraphQLPaths.ProductReview.deleteMany;

@Resolver(ProductReview)
export class ProductReviewResolver {
  private repository = getCustomRepository(ProductReviewRepository);

  @Query(() => ProductReview)
  async [getOneByIdPath](@Ctx() ctx: TGraphQLContext, @Arg('id', () => Int) id: number): Promise<TProductReview> {
    return getByIdWithFilters('ProductReview', ctx, [], ['read_product_reviews'], id, async (...args) => {
      const review = await this.repository.getProductReview(...args);
      const settings = await getCmsSettings();
      if (
        !settings.showUnapprovedReviews &&
        !matchPermissions(ctx.user, ['read_product_reviews']) &&
        !review?.approved
      ) {
        throw new HttpException(`Product review ${id} not found!`, HttpStatus.NOT_FOUND);
      }
      return review;
    });
  }

  @Query(() => PagedProductReview)
  async [getManyPath](
    @Ctx() ctx: TGraphQLContext,
    @Arg('pagedParams', () => PagedParamsInput, { nullable: true }) pagedParams?: PagedParamsInput<TProductReview>,
    @Arg('filterParams', () => ProductReviewFilter, { nullable: true }) filterParams?: ProductReviewFilter,
  ): Promise<TPagedList<TProductReview> | undefined> {
    const settings = await getCmsSettings();
    if (!settings.showUnapprovedReviews && !matchPermissions(ctx.user, ['read_product_reviews'])) {
      if (!filterParams) filterParams = {};
      filterParams.approved = true;
    }

    return getManyWithFilters(
      'ProductReview',
      ctx,
      [],
      ['read_product_reviews'],
      pagedParams,
      filterParams,
      (...args) => this.repository.getFilteredProductReviews(...args),
    );
  }

  @Authorized<TPermissionName>('create_product_review')
  @Mutation(() => ProductReview)
  async [createPath](
    @Ctx() ctx: TGraphQLContext,
    @Arg('data', () => ProductReviewInput) data: ProductReviewInput,
  ): Promise<TProductReview> {
    return createWithFilters('ProductReview', ctx, ['create_product_review'], data, (...args) =>
      this.repository.createProductReview(...args),
    );
  }

  @Authorized<TPermissionName>('update_product_review')
  @Mutation(() => ProductReview)
  async [updatePath](
    @Ctx() ctx: TGraphQLContext,
    @Arg('id', () => Int) id: number,
    @Arg('data', () => ProductReviewInput) data: ProductReviewInput,
  ): Promise<TProductReview> {
    return updateWithFilters('ProductReview', ctx, ['update_product_review'], data, id, (...args) =>
      this.repository.updateProductReview(...args),
    );
  }

  @Authorized<TPermissionName>('delete_product_review')
  @Mutation(() => Boolean)
  async [deletePath](@Ctx() ctx: TGraphQLContext, @Arg('id', () => Int) id: number): Promise<boolean> {
    return deleteWithFilters('ProductReview', ctx, ['delete_product_review'], id, (...args) =>
      this.repository.deleteProductReview(...args),
    );
  }

  @Authorized<TPermissionName>('delete_product_review')
  @Mutation(() => Boolean)
  async [deleteManyPath](
    @Ctx() ctx: TGraphQLContext,
    @Arg('input', () => DeleteManyInput) input: DeleteManyInput,
    @Arg('filterParams', () => ProductReviewFilter, { nullable: true }) filterParams?: ProductReviewFilter,
  ): Promise<boolean | undefined> {
    return deleteManyWithFilters('ProductReview', ctx, ['delete_product_review'], input, filterParams, (...args) =>
      this.repository.deleteManyFilteredProductReviews(...args),
    );
  }
}
