import { TDeleteManyInput, TPagedList, TPagedParams, TProductReview, TProductReviewInput } from '@cromwell/core';
import sanitizeHtml from 'sanitize-html';
import { Brackets, DeleteQueryBuilder, EntityRepository, getCustomRepository, SelectQueryBuilder } from 'typeorm';

import { ProductReviewFilter } from '../entities/filter/ProductReviewFilter';
import { ProductReview } from '../entities/ProductReview';
import { getLogger } from '../helpers/logger';
import { PagedParamsInput } from './../inputs/PagedParamsInput';
import { checkEntitySlug, getPaged, handleBaseInput } from './BaseQueries';
import { BaseRepository } from './BaseRepository';
import { ProductRepository } from './ProductRepository';

const logger = getLogger();

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


        productReview.title = input.title ? sanitizeHtml(input.title, {
            allowedTags: []
        }) : input.title;
        productReview.description = input.description ? sanitizeHtml(input.description, {
            allowedTags: []
        }) : input.description;
        productReview.rating = input.rating;
        productReview.userName = input.userName ? sanitizeHtml(input.userName, {
            allowedTags: []
        }) : input.userName;
        productReview.approved = input.approved;
        productReview.userId = input.userId;
    }

    async createProductReview(createProductReview: TProductReviewInput, id?: string): Promise<TProductReview> {
        logger.log('ProductReviewRepository::createProductReview');
        let productReview = new ProductReview();
        if (id) productReview.id = id;

        await this.handleProductReviewInput(productReview, createProductReview);

        productReview = await this.save(productReview);
        await checkEntitySlug(productReview, ProductReview);

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
        await checkEntitySlug(productReview, ProductReview);

        return productReview;
    }

    async deleteProductReview(id: string): Promise<boolean> {
        logger.log('ProductReviewRepository::deleteProductReview; id: ' + id);

        const productReview = await this.getProductReview(id);
        if (!productReview) {
            return false;
        }
        await this.delete(id);
        return true;
    }

    applyProductReviewFilter(qb: SelectQueryBuilder<TProductReview> | DeleteQueryBuilder<TProductReview>, filterParams?: ProductReviewFilter) {
        // Search by approved
        if (filterParams?.approved !== undefined && filterParams?.approved !== null) {

            if (filterParams.approved) {
                const query = `${this.metadata.tablePath}.approved = :approvedSearch`;
                qb.andWhere(query, { approvedSearch: filterParams.approved });
            }

            if (filterParams?.approved === false) {
                const brackets = new Brackets(subQb => {
                    const query = `${this.metadata.tablePath}.approved = :approvedSearch`;
                    subQb.where(query, { approvedSearch: filterParams.approved });

                    const query2 = `${this.metadata.tablePath}.approved IS NULL`;
                    subQb.orWhere(query2);
                });
                qb.andWhere(brackets);
            }
        }

        // Search by productId
        if (filterParams?.productId && filterParams.productId !== '') {
            const query = `${this.metadata.tablePath}.productId = :productId`;
            qb.andWhere(query, { productId: filterParams.productId });
        }

        // Search by userId
        if (filterParams?.userId && filterParams.userId !== '') {
            const query = `${this.metadata.tablePath}.userId = :userId`;
            qb.andWhere(query, { userId: filterParams.userId });
        }

        // Search by userName
        if (filterParams?.userName && filterParams.userName !== '') {
            const userNameSearch = `%${filterParams.userName}%`;
            const query = `${this.metadata.tablePath}.userName LIKE :userNameSearch`;
            qb.andWhere(query, { userNameSearch });
        }
    }

    async getFilteredProductReviews(pagedParams?: PagedParamsInput<TProductReview>, filterParams?: ProductReviewFilter): Promise<TPagedList<TProductReview>> {
        const qb = this.createQueryBuilder(this.metadata.tablePath);
        qb.select();
        this.applyProductReviewFilter(qb, filterParams);
        return await getPaged<TProductReview>(qb, this.metadata.tablePath, pagedParams);
    }


    async deleteManyFilteredProductReviews(input: TDeleteManyInput, filterParams?: ProductReviewFilter): Promise<boolean | undefined> {
        const qb = this.createQueryBuilder()
            .delete().from<ProductReview>(this.metadata.tablePath);

        this.applyProductReviewFilter(qb, filterParams);
        this.applyDeleteMany(qb, input);
        try {
            await qb.execute();
        } catch (e) {
            logger.error(e)
        }
        return true;
    }

}