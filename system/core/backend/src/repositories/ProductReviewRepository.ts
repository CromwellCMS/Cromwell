import { DBTableNames, TProductReview, TProductReviewInput } from '@cromwell/core';
import { EntityRepository, Repository, getCustomRepository } from 'typeorm';

import { ProductReview } from '../entities/ProductReview';
import { applyGetManyFromOne, getPaged, handleBaseInput } from './BaseQueries';
import { ProductRepository } from './ProductRepository';

@EntityRepository(ProductReview)
export class ProductReviewRepository extends Repository<ProductReview> {

    async getProductReviews(): Promise<ProductReview[]> {
        return this.find();
    }

    async getProductReview(id: string): Promise<ProductReview> {
        const productReview = await this.findOne({
            where: { id }
        });
        if (!productReview) throw new Error(`ProductReview ${id} not found!`);
        return productReview;
    }

    async handleProductReviewInput(productReview: ProductReview, input: TProductReviewInput) {
        handleBaseInput(productReview, input);

        productReview.product = await getCustomRepository(ProductRepository).getProductById(input.productId);

        productReview.title = input.title;
        productReview.description = input.description;
        productReview.rating = input.rating;
        productReview.userName = input.userName;
    }

    async createProductReview(createProductReview: TProductReviewInput): Promise<TProductReview> {
        let productReview = new ProductReview();

        await this.handleProductReviewInput(productReview, createProductReview);

        productReview = await this.save(productReview);
        if (!productReview.slug) {
            productReview.slug = productReview.id;
            await this.save(productReview);
        }

        return productReview;
    }

    async updateProductReview(id: string, updateProductReview: TProductReviewInput): Promise<ProductReview> {
        let productReview = await this.findOne({
            where: { id }
        });
        if (!productReview) throw new Error(`ProductReview ${id} not found!`);

        await this.handleProductReviewInput(productReview, updateProductReview);

        productReview = await this.save(productReview);

        return productReview;
    }

    async deleteProductReview(id: string): Promise<boolean> {
        console.log('ProductReviewRepository::deleteProductReview; id: ' + id)

        const productReview = await this.getProductReview(id);
        if (!productReview) {
            console.log('ProductReviewRepository::deleteProductReview failed to find productReview by id');
            return false;
        }
        const res = await this.delete(id);
        return true;
    }


}