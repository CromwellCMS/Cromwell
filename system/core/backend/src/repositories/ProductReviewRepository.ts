import { TPagedList, TPagedParams, TProductReview, TProductReviewInput, logFor } from '@cromwell/core';
import { EntityRepository, getCustomRepository } from 'typeorm';

import { ProductReview } from '../entities/ProductReview';
import { getPaged, handleBaseInput, checkEntitySlug } from './BaseQueries';
import { BaseRepository } from './BaseRepository';
import { ProductRepository } from './ProductRepository';
import { getLogger } from '../helpers/constants';

const logger = getLogger('detailed');

@EntityRepository(ProductReview)
export class ProductReviewRepository extends BaseRepository<ProductReview> {

    private productRepo = getCustomRepository(ProductRepository);
    async getProductReviews(params: TPagedParams<TProductReview>): Promise<TPagedList<TProductReview>> {
        return getPaged(this.createQueryBuilder(), this.metadata.tablePath, params);
    }

    async getProductReview(id: string): Promise<ProductReview> {
        logger.log('ProductReviewRepository::getProductReview id: ' + id);
        const productReview = await this.findOne({
            where: { id }
        });
        if (!productReview) throw new Error(`ProductReview ${id} not found!`);
        return productReview;
    }

    async handleProductReviewInput(productReview: ProductReview, input: TProductReviewInput) {
        handleBaseInput(productReview, input);

        const product = await this.productRepo.getProductById(input.productId);
        if (!product) throw new Error(`ProductReviewRepository:handleProductReviewInput productId ${input.productId} not found!`);
        productReview.product = product;

        productReview.title = input.title;
        productReview.description = input.description;
        productReview.rating = input.rating;
        productReview.userName = input.userName;
    }

    async createProductReview(createProductReview: TProductReviewInput): Promise<TProductReview> {
        logger.log('ProductReviewRepository::createProductReview');
        let productReview = new ProductReview();

        await this.handleProductReviewInput(productReview, createProductReview);

        productReview = await this.save(productReview);
        await checkEntitySlug(productReview);

        return productReview;
    }

    async updateProductReview(id: string, updateProductReview: TProductReviewInput): Promise<ProductReview> {
        logger.log('ProductReviewRepository::updateProductReview; id: ' + id);
        let productReview = await this.findOne({
            where: { id }
        });
        if (!productReview) throw new Error(`ProductReview ${id} not found!`);

        await this.handleProductReviewInput(productReview, updateProductReview);

        productReview = await this.save(productReview);
        await checkEntitySlug(productReview);

        return productReview;
    }

    async deleteProductReview(id: string): Promise<boolean> {
        logger.log('ProductReviewRepository::deleteProductReview; id: ' + id);

        const productReview = await this.getProductReview(id);
        if (!productReview) {
            return false;
        }
        const res = await this.delete(id);
        return true;
    }


}