import { Resolver, Query, Mutation, Arg, FieldResolver, Root } from "type-graphql";
import { ProductReview, ProductReviewInput } from '@cromwell/core-backend';
import { ProductReviewRepository } from '@cromwell/core-backend';
import { getCustomRepository } from "typeorm";
import { TProductReview, TPagedList } from "@cromwell/core";

@Resolver(ProductReview)
export class ProductReviewResolver {

    private get repo() { return getCustomRepository(ProductReviewRepository) }

    @Query(() => [ProductReview])
    async productReviews(): Promise<TProductReview[]> {
        return await this.repo.getProductReviews();
    }

    @Query(() => ProductReview)
    async productReview(@Arg("id") id: string): Promise<ProductReview> {
        return await this.repo.getProductReview(id);
    }

    @Mutation(() => ProductReview)
    async createProductReview(@Arg("data") data: ProductReviewInput): Promise<TProductReview> {
        return await this.repo.createProductReview(data);
    }

    @Mutation(() => ProductReview)
    async updateProductReview(@Arg("id") id: string, @Arg("data") data: ProductReviewInput): Promise<ProductReview> {
        return await this.repo.updateProductReview(id, data);
    }

    @Mutation(() => Boolean)
    async deleteProductReview(@Arg("id") id: string): Promise<boolean> {
        return await this.repo.deleteProductReview(id);
    }

}