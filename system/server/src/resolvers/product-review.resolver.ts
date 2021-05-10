import { GraphQLPaths, TAuthRole, TPagedList, TProductReview } from '@cromwell/core';
import {
    DeleteManyInput,
    PagedParamsInput,
    PagedProductReview,
    ProductReview,
    ProductReviewFilter,
    ProductReviewInput,
    ProductReviewRepository,
} from '@cromwell/core-backend';
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

import { mainFireAction } from '../helpers/mainFireAction';

const getOneByIdPath = GraphQLPaths.ProductReview.getOneById;
const getManyPath = GraphQLPaths.ProductReview.getMany;
const createPath = GraphQLPaths.ProductReview.create;
const updatePath = GraphQLPaths.ProductReview.update;
const deletePath = GraphQLPaths.ProductReview.delete;
const deleteManyPath = GraphQLPaths.ProductReview.deleteMany;
const deleteManyFilteredPath = GraphQLPaths.ProductReview.deleteManyFiltered;
const getFilteredPath = GraphQLPaths.ProductReview.getFiltered;

@Resolver(ProductReview)
export class ProductReviewResolver {

    private repository = getCustomRepository(ProductReviewRepository)

    @Query(() => PagedProductReview)
    async [getManyPath](@Arg("pagedParams") pagedParams: PagedParamsInput<TProductReview>): Promise<TPagedList<TProductReview>> {
        return await this.repository.getProductReviews(pagedParams);
    }

    @Query(() => ProductReview)
    async [getOneByIdPath](@Arg("id") id: string): Promise<ProductReview> {
        return await this.repository.getProductReview(id);
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => ProductReview)
    async [createPath](@Arg("data") data: ProductReviewInput): Promise<TProductReview> {
        const review = await this.repository.createProductReview(data);
        mainFireAction('create_product_review', review);
        return review;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => ProductReview)
    async [updatePath](@Arg("id") id: string, @Arg("data") data: ProductReviewInput): Promise<ProductReview> {
        const review = await this.repository.updateProductReview(id, data);
        mainFireAction('update_product_review', review);
        return review;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Boolean)
    async [deletePath](@Arg("id") id: string): Promise<boolean> {
        const review = await this.repository.deleteProductReview(id);
        mainFireAction('delete_product_review', { id });
        return review;
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Boolean)
    async [deleteManyPath](@Arg("data") data: DeleteManyInput): Promise<boolean | undefined> {
        return this.repository.deleteMany(data);
    }

    @Authorized<TAuthRole>("administrator")
    @Mutation(() => Boolean)
    async [deleteManyFilteredPath](
        @Arg("input") input: DeleteManyInput,
        @Arg("filterParams", { nullable: true }) filterParams?: ProductReviewFilter,
    ): Promise<boolean | undefined> {
        return this.repository.deleteManyFilteredProductReviews(input, filterParams);
    }

    @Query(() => PagedProductReview)
    async [getFilteredPath](
        @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TProductReview>,
        @Arg("filterParams", { nullable: true }) filterParams?: ProductReviewFilter,
    ): Promise<TPagedList<TProductReview> | undefined> {
        return this.repository.getFilteredProductReviews(pagedParams, filterParams);
    }

}