import { Resolver, Query, Mutation, Arg, FieldResolver, Root } from "type-graphql";
import { ProductReview, ProductReviewInput } from '@cromwell/core-backend';
import { ProductReviewRepository, PagedProductReview, PagedParamsInput, ProductRepository } from '@cromwell/core-backend';
import { getCustomRepository } from "typeorm";
import { TProductReview, TPagedList, GraphQLPaths } from "@cromwell/core";

const getOneByIdPath = GraphQLPaths.ProductReview.getOneById;
const getManyPath = GraphQLPaths.ProductReview.getMany;
const createPath = GraphQLPaths.ProductReview.create;
const updatePath = GraphQLPaths.ProductReview.update;
const deletePath = GraphQLPaths.ProductReview.delete;
const getFromProductPath = GraphQLPaths.ProductReview.getFromProduct;

@Resolver(ProductReview)
export class ProductReviewResolver {

    private repository = getCustomRepository(ProductReviewRepository)

    @Query(() => PagedProductReview)
    async [getManyPath](@Arg("pagedParams") pagedParams: PagedParamsInput<TProductReview>): Promise<TPagedList<TProductReview>> {
        return await this.repository.getProductReviews(pagedParams);
    }

    @Query(() => PagedProductReview)
    async [getFromProductPath](@Arg("productId") productId: string, @Arg("pagedParams") pagedParams: PagedParamsInput<TProductReview>): Promise<TPagedList<TProductReview>> {
        return getCustomRepository(ProductRepository).getReviewsOfProduct(productId, pagedParams);
    }

    @Query(() => ProductReview)
    async [getOneByIdPath](@Arg("id") id: string): Promise<ProductReview> {
        return await this.repository.getProductReview(id);
    }

    @Mutation(() => ProductReview)
    async [createPath](@Arg("data") data: ProductReviewInput): Promise<TProductReview> {
        return await this.repository.createProductReview(data);
    }

    @Mutation(() => ProductReview)
    async [updatePath](@Arg("id") id: string, @Arg("data") data: ProductReviewInput): Promise<ProductReview> {
        return await this.repository.updateProductReview(id, data);
    }

    @Mutation(() => Boolean)
    async [deletePath](@Arg("id") id: string): Promise<boolean> {
        return await this.repository.deleteProductReview(id);
    }

}