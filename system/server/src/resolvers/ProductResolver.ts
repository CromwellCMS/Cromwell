import { TPagedList, TProduct, TProductCategory, TProductReview } from '@cromwell/core';
import {
    CreateProduct,
    PagedParamsInput,
    PagedProduct,
    Product,
    ProductCategory,
    ProductCategoryRepository,
    ProductRepository,
    UpdateProduct,
    ProductReview
} from '@cromwell/core-backend';
import { Arg, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { getCustomRepository } from 'typeorm';
// @OneToMany(type => ProductReview, review => review.product)
// reviews?: TProductReview[];
@Resolver(Product)
export class ProductResolver {

    private get repo() { return getCustomRepository(ProductRepository) }

    @Query(() => PagedProduct)
    async products(@Arg("pagedParams") pagedParams: PagedParamsInput<TProduct>): Promise<TPagedList<TProduct>> {
        return await this.repo.getProducts(pagedParams);
    }

    @Query(() => Product)
    async product(@Arg("slug") slug: string): Promise<Product> {
        return await this.repo.getProductBySlug(slug);
    }

    @Query(() => Product)
    async getProductById(@Arg("id") id: string): Promise<Product> {
        return await this.repo.getProductById(id);
    }

    @Mutation(() => Product)
    async createProduct(@Arg("data") data: CreateProduct): Promise<TProduct> {
        return await this.repo.createProduct(data);
    }

    @Mutation(() => Product)
    async updateProduct(@Arg("id") id: string, @Arg("data") data: UpdateProduct): Promise<Product> {
        return await this.repo.updateProduct(id, data);
    }

    @Mutation(() => Boolean)
    async deleteProduct(@Arg("id") id: string): Promise<boolean> {
        return await this.repo.deleteProduct(id);
    }

    @Query(() => PagedProduct)
    async getProductsFromCategory(@Arg("categoryId") categoryId: string, @Arg("pagedParams") pagedParams: PagedParamsInput<TProduct>): Promise<TPagedList<TProduct>> {
        return await this.repo.getProductsFromCategory(categoryId, pagedParams);
    }

    @FieldResolver(() => [ProductCategory])
    async categories(@Root() product: Product, @Arg("pagedParams") pagedParams: PagedParamsInput<TProductCategory>): Promise<TProductCategory[]> {
        return await getCustomRepository(ProductCategoryRepository).getCategoriesOfProduct(product.id, pagedParams);
    }

    @FieldResolver(() => [ProductReview])
    async reviews(@Root() product: Product): Promise<TProductReview[]> {
        return await product.reviews;
    }

    @FieldResolver()
    views(): number {
        return Math.floor(Math.random() * 10);
    }

}