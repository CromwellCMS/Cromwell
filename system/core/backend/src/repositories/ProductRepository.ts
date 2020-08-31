import {
    BasePagePaths,
    DBTableNames,
    getStoreItem,
    TPagedList,
    TPagedParams,
    TProduct,
    TProductInput,
    TProductReview,
    TProductRating
} from '@cromwell/core';
import { EntityRepository, getCustomRepository, Repository } from 'typeorm';

import { Product, ProductRating } from '../entities/Product';
import { applyGetManyFromOne, getPaged, handleBaseInput } from './BaseQueries';
import { ProductCategoryRepository } from './ProductCategoryRepository';
import { ProductReviewRepository } from './ProductReviewRepository';
import { ProductReview } from '../entities/ProductReview';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {

    async getProducts(params: TPagedParams<TProduct>): Promise<TPagedList<TProduct>> {
        const qb = this.createQueryBuilder(DBTableNames.Product);
        const paged = await getPaged(qb, DBTableNames.Product, params);
        return paged;
    }

    async getProductById(id: string): Promise<Product | undefined> {
        const product = await this.findOne({
            where: { id }
        });
        if (!product) throw new Error(`Product ${id} not found!`);
        return product;
    }

    async getProductBySlug(slug: string): Promise<Product | undefined> {
        const product = await this.findOne({
            where: { slug }
        });
        if (!product) throw new Error(`Product ${slug} not found!`);
        return product;
    }

    async handleProductInput(product: Product, input: TProductInput) {
        handleBaseInput(product, input);
        product.name = input.name;
        product.price = input.price;
        product.oldPrice = input.oldPrice;
        product.mainImage = input.mainImage;
        product.images = input.images;
        product.description = input.description;
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
                product.images = [product.mainImage, ...imgs]
            }
        }
        // Set mainImage from array if it hasn't been set
        if (!product.mainImage && product.images && product.images.length > 0) {
            product.mainImage = product.images[0];
        }
    }

    async createProduct(createProduct: TProductInput): Promise<Product> {
        let product = new Product();

        await this.handleProductInput(product, createProduct);

        product = await this.save(product);
        if (!product.slug) {
            product.slug = product.id;

            await this.save(product);
        }

        this.buildProductPage(product);

        return product;
    }

    async updateProduct(id: string, updateProduct: TProductInput): Promise<Product> {
        let product = await this.findOne({
            where: { id },
            relations: ["categories"]
        });
        if (!product) throw new Error(`Product ${id} not found!`);

        await this.handleProductInput(product, updateProduct);

        product = await this.save(product);

        this.buildProductPage(product);

        return product;
    }

    async deleteProduct(id: string): Promise<boolean> {
        console.log('ProductRepository::deleteProduct; id: ' + id)

        const product = await this.getProductById(id);
        if (!product) {
            console.log('ProductRepository::deleteProduct failed to find product by id');
            return false;
        }
        const res = await this.delete(id);
        this.buildProductPage(product);
        return true;
    }

    async getProductsFromCategory(categoryId: string, params?: TPagedParams<TProduct>): Promise<TPagedList<TProduct>> {
        const qb = this.createQueryBuilder(DBTableNames.Product);
        applyGetManyFromOne(qb, DBTableNames.Product, 'categories', DBTableNames.ProductCategory, categoryId);
        const paged = await getPaged(qb, DBTableNames.Product, params);
        return paged;
    }

    async getReviewsOfProduct(productId: string, params?: TPagedParams<TProductReview>): Promise<TPagedList<TProductReview>> {
        const qb = getCustomRepository(ProductReviewRepository).createQueryBuilder(DBTableNames.ProductReview);
        applyGetManyFromOne(qb, DBTableNames.ProductReview, 'product', DBTableNames.Product, productId);
        return getPaged(qb, DBTableNames.ProductReview, params)
    }

    async getProductRating(productId: string): Promise<TProductRating> {
        const qb = getCustomRepository(ProductReviewRepository).createQueryBuilder(DBTableNames.ProductReview);
        applyGetManyFromOne(qb, DBTableNames.ProductReview, 'product', DBTableNames.Product, productId);

        const reviewsNumberKey: keyof TProductRating = 'reviewsNumber';
        const averageKey: keyof TProductRating = 'average';
        const ratingKey: keyof TProductReview = 'rating';
        qb.select('COUNT()', reviewsNumberKey);
        qb.addSelect(`AVG(${ratingKey})`, averageKey);

        const raw = await qb.getRawOne();
        return raw;
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