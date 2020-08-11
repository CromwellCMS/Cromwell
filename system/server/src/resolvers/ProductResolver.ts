import { Resolver, Query, Mutation, Arg, FieldResolver, Root } from "type-graphql";
import { Product, PagedProduct } from '@cromwell/core-backend';
import { ProductRepository } from '@cromwell/core-backend';
import { ProductCategoryRepository } from '@cromwell/core-backend';
import { getCustomRepository } from "typeorm";
import { CreateProduct } from '@cromwell/core-backend';
import { UpdateProduct } from '@cromwell/core-backend';
import { ProductCategory, ProductFilter, PagedParamsInput } from '@cromwell/core-backend';
import { TProductCategory, TProduct, TPagedList } from "@cromwell/core";

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

    @FieldResolver(() => [ProductCategory])
    async categories(@Root() product: Product, @Arg("pagedParams") pagedParams: PagedParamsInput<TProductCategory>): Promise<TProductCategory[]> {
        return await getCustomRepository(ProductCategoryRepository).getCategoriesOfProduct(product.id, pagedParams);
    }

    @FieldResolver()
    views(): number {
        return Math.floor(Math.random() * 10);
    }

}