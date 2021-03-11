import {
    BasePagePaths,
    getStoreItem,
    TFilteredProductList,
    TPagedList,
    TPagedParams,
    TProduct,
    TProductFilter,
    TProductFilterMeta,
    TProductInput,
    TProductRating,
    TProductReview,
    TDeleteManyInput,
} from '@cromwell/core';
import { Brackets, EntityRepository, getCustomRepository, SelectQueryBuilder, DeleteQueryBuilder, QueryBuilder } from 'typeorm';

import { ProductFilterInput } from '../entities/filter/ProductFilterInput';
import { Product } from '../entities/Product';
import { ProductReview } from '../entities/ProductReview';
import { getLogger } from '../helpers/constants';
import { PagedParamsInput } from './../inputs/PagedParamsInput';
import { applyGetManyFromOne, checkEntitySlug, getPaged, handleBaseInput } from './BaseQueries';
import { BaseRepository } from './BaseRepository';
import { ProductCategoryRepository } from './ProductCategoryRepository';
import { ProductReviewRepository } from './ProductReviewRepository';

const logger = getLogger('detailed');
const averageKey: keyof Product = 'averageRating';
const reviewsCountKey: keyof Product = 'reviewsCount'
const ratingKey: keyof TProductReview = 'rating';

@EntityRepository(Product)
export class ProductRepository extends BaseRepository<Product> {

    constructor() {
        super(Product)
    }

    async applyGetProductRating(qb: SelectQueryBuilder<TProduct>) {
        const reviewTable = getCustomRepository(ProductReviewRepository).metadata.tablePath;
        qb.addSelect(`AVG(${reviewTable}.${String(ratingKey)})`, 'product_' + averageKey)
            .addSelect(`COUNT(${reviewTable}.id)`, 'product_' + reviewsCountKey)
            .leftJoin(ProductReview, reviewTable, `${reviewTable}.productId = ${this.metadata.tablePath}.id `)
            .groupBy(`${this.metadata.tablePath}.id`);
    }

    async applyAndGetPagedProducts(qb: SelectQueryBuilder<TProduct>, params?: TPagedParams<TProduct>): Promise<TPagedList<TProduct>> {
        this.applyGetProductRating(qb);

        if (params?.orderBy === "rating") {
            params.orderBy = 'product_' + averageKey as any;
            return getPaged(qb, undefined, params);
        }
        return getPaged(qb, this.metadata.tablePath, params);
    }

    async getProducts(params?: TPagedParams<TProduct>): Promise<TPagedList<TProduct>> {
        logger.log('ProductRepository::getProducts');
        const qb = this.createQueryBuilder(this.metadata.tablePath);
        const prods = await this.applyAndGetPagedProducts(qb, params)
        return prods;
    }

    async getProductById(id: string): Promise<Product | undefined> {
        logger.log('ProductRepository::getProductById id: ' + id);
        const qb = this.createQueryBuilder(this.metadata.tablePath);
        this.applyGetProductRating(qb);
        return qb.where(`${this.metadata.tablePath}.id = :id`, { id })
            .getOne();
    }

    async getProductBySlug(slug: string): Promise<Product | undefined> {
        logger.log('ProductRepository::getProductBySlug slug: ' + slug);
        const qb = this.createQueryBuilder(this.metadata.tablePath);
        this.applyGetProductRating(qb);
        return qb.where(`${this.metadata.tablePath}.slug = :slug`, { slug })
            .getOne();
    }

    async handleProductInput(product: Product, input: TProductInput) {
        handleBaseInput(product, input);
        product.name = input.name;
        product.price = input.price;
        product.oldPrice = input.oldPrice;
        product.mainImage = input.mainImage;
        product.images = input.images;
        product.description = input.description;
        product.descriptionDelta = input.descriptionDelta;
        product.attributes = input.attributes;

        if (input.categoryIds) {
            product.categories = await getCustomRepository(ProductCategoryRepository)
                .getProductCategoriesById(input.categoryIds);
        }

        // Move mainImage into first item in the array if it is not
        if (product.images && product.images.length > 0 && product.mainImage && product.images[0] !== product.mainImage) {
            const imgs = [...product.images];
            const index = imgs.indexOf(product.mainImage);
            if (index > -1) {
                imgs.splice(index, 1);
                product.images = [product.mainImage, ...imgs];
            }
        }
        // Set mainImage from array if it hasn't been set
        if (!product.mainImage && product.images && product.images.length > 0) {
            product.mainImage = product.images[0];
        }
    }

    async createProduct(createProduct: TProductInput): Promise<Product> {
        logger.log('ProductRepository::createProduct');
        let product = new Product();

        await this.handleProductInput(product, createProduct);

        product = await this.save(product);
        await checkEntitySlug(product);

        // this.buildProductPage(product);

        return product;
    }

    async updateProduct(id: string, updateProduct: TProductInput): Promise<Product> {
        logger.log('ProductRepository::updateProduct id: ' + id);
        let product = await this.findOne({
            where: { id },
            relations: ["categories"]
        });
        if (!product) throw new Error(`Product ${id} not found!`);

        await this.handleProductInput(product, updateProduct);

        product = await this.save(product);
        await checkEntitySlug(product);

        // this.buildProductPage(product);

        return product;
    }

    async deleteProduct(id: string): Promise<boolean> {
        logger.log('ProductRepository::deleteProduct; id: ' + id);

        const product = await this.getProductById(id);
        if (!product) {
            console.log('ProductRepository::deleteProduct failed to find product by id');
            return false;
        }
        const res = await this.delete(id);
        // this.buildProductPage(product);
        return true;
    }

    async getProductsFromCategory(categoryId: string, params?: TPagedParams<TProduct>): Promise<TPagedList<TProduct>> {
        logger.log('ProductRepository::getProductsFromCategory id: ' + categoryId);
        const categoryTable = getCustomRepository(ProductCategoryRepository).metadata.tablePath;
        const qb = this.createQueryBuilder(this.metadata.tablePath);
        applyGetManyFromOne(qb, this.metadata.tablePath, 'categories', categoryTable, categoryId);
        return this.applyAndGetPagedProducts(qb, params);
    }

    async getReviewsOfProduct(productId: string, params?: TPagedParams<TProductReview>): Promise<TPagedList<TProductReview>> {
        logger.log('ProductRepository::getReviewsOfProduct id: ' + productId);
        const reviewTable = getCustomRepository(ProductReviewRepository).metadata.tablePath;

        const qb = getCustomRepository(ProductReviewRepository).createQueryBuilder(reviewTable);
        applyGetManyFromOne(qb, reviewTable, 'product', this.metadata.tablePath, productId);
        return getPaged(qb, reviewTable, params)
    }

    async getProductRating(productId: string): Promise<TProductRating> {
        logger.log('ProductRepository::getProductRating id: ' + productId);
        const reviewTable = getCustomRepository(ProductReviewRepository).metadata.tablePath;
        const qb = getCustomRepository(ProductReviewRepository).createQueryBuilder(reviewTable);
        applyGetManyFromOne(qb, reviewTable, 'product', this.metadata.tablePath, productId);

        const reviewsNumberKey: keyof TProductRating = 'reviewsNumber';
        const averageKey: keyof TProductRating = 'average';
        const ratingKey: keyof TProductReview = 'rating';
        qb.select('COUNT()', reviewsNumberKey);
        qb.addSelect(`AVG(${ratingKey})`, averageKey);

        const raw = await qb.getRawOne();
        return raw;
    }

    applyProductFilter(qb: SelectQueryBuilder<Product> | DeleteQueryBuilder<Product>, filterParams?: ProductFilterInput, categoryId?: string) {
        if (categoryId) {
            // Cannot apply category filter in Delete query
            applyGetManyFromOne(qb as SelectQueryBuilder<Product>, this.metadata.tablePath, 'categories',
                getCustomRepository(ProductCategoryRepository).metadata.tablePath, categoryId);
        }

        if (filterParams) {
            // Attribute filter
            // Improper filter via LIKE operator (won't work with attributes that have intersections in values)
            if (filterParams.attributes) {
                filterParams.attributes.forEach(attr => {
                    if (attr.values.length > 0) {
                        const brackets = new Brackets(subQb => {
                            let isFirstVal = true;
                            attr.values.forEach(val => {
                                const likeStr = `%{"key":"${attr.key}","values":[%{"value":"${val}"%]}%`;
                                const valKey = `${attr.key}_${val}`;
                                const query = `${this.metadata.tablePath}.attributesJSON LIKE :${valKey}`;
                                if (isFirstVal) {
                                    isFirstVal = false;
                                    subQb.where(query, { [valKey]: likeStr });
                                } else {
                                    subQb.orWhere(query, { [valKey]: likeStr });
                                }
                            })
                        });
                        qb.andWhere(brackets);
                    }
                });
            }

            // Search by product name
            if (filterParams.nameSearch && filterParams.nameSearch !== '') {
                const likeStr = `%${filterParams.nameSearch}%`;
                const query = `${this.metadata.tablePath}.name LIKE :likeStr`;
                qb.andWhere(query, { likeStr });
            }

            // Price filter
            if (filterParams.maxPrice) {
                const query = `${this.metadata.tablePath}.price <= :maxPrice`;
                qb.andWhere(query, { maxPrice: filterParams.maxPrice })
            }
            if (filterParams.minPrice) {
                const query = `${this.metadata.tablePath}.price >= :minPrice`;
                qb.andWhere(query, { minPrice: filterParams.minPrice })
            }
        }
    }

    async getFilteredProducts(pagedParams?: PagedParamsInput<TProduct>, filterParams?: ProductFilterInput, categoryId?: string): Promise<TFilteredProductList> {
        logger.log('ProductRepository::getFilteredProducts categoryId:' + categoryId + ' pagedParams:' + pagedParams);
        const timestamp = Date.now();

        const getQb = (shouldApplyPriceFilter = true): SelectQueryBuilder<Product> => {
            const qb = this.createQueryBuilder(this.metadata.tablePath);

            if (shouldApplyPriceFilter === false) {
                filterParams = {
                    ...filterParams,
                    maxPrice: undefined,
                    minPrice: undefined,
                }
            }
            this.applyProductFilter(qb, filterParams, categoryId)
            return qb;
        }

        const getFilterMeta = async (): Promise<TProductFilterMeta> => {
            // Get max price
            const qb = getQb(false);

            let [maxPrice, minPrice] = await Promise.all([
                qb.select(`MAX(${this.metadata.tablePath}.price)`, "maxPrice").getRawOne().then(res => res?.maxPrice),
                qb.select(`MIN(${this.metadata.tablePath}.price)`, "minPrice").getRawOne().then(res => res?.minPrice)
            ]);
            if (maxPrice && typeof maxPrice === 'string') maxPrice = parseInt(maxPrice);
            if (minPrice && typeof minPrice === 'string') minPrice = parseInt(minPrice);

            return {
                minPrice, maxPrice
            }
        }

        const getElements = async (): Promise<TPagedList<TProduct>> => {
            return this.applyAndGetPagedProducts(getQb(), pagedParams);
        }

        const [filterMeta, paged] = await Promise.all([getFilterMeta(), getElements()]);

        const timestamp2 = Date.now();
        logger.log('ProductRepository::getFilteredProducts time elapsed: ' + (timestamp2 - timestamp) + 'ms');

        const filtered: TFilteredProductList = {
            ...paged,
            filterMeta
        }
        return filtered;
    }

    async deleteManyFilteredProducts(input: TDeleteManyInput, filterParams?: ProductFilterInput): Promise<boolean | undefined> {
        const qb = this.createQueryBuilder()
            .delete().from<Product>(this.metadata.tablePath);

        this.applyProductFilter(qb, filterParams);
        this.applyDeletMany(qb, input);
        await qb.execute();
        return true;
    }

    private buildProductPage(product: TProduct) {
        const rebuildPage = getStoreItem('rebuildPage');
        if (rebuildPage) {
            rebuildPage(`${BasePagePaths.Product}/${product.slug}`);
            if (product.categories) {
                product.categories.forEach(cat => {
                    rebuildPage(`${BasePagePaths.ProductCategory}/${cat.slug}`);
                })
            }
        }
    }

}