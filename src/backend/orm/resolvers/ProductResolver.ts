import { Resolver, Query, Mutation, Arg, FieldResolver, Root } from "type-graphql";
import { Product } from "../models/entities/Product";
import { ProductRepository } from "../repositories/ProductRepository";
import { ProductCategoryRepository } from "../repositories/ProductCategoryRepository";
import { getCustomRepository } from "typeorm";
import { CreateProduct } from "../models/inputs/CreateProduct";
import { UpdateProduct } from "../models/inputs/UpdateProduct";
import { PagedParamsInput } from "../models/inputs/PagedParamsInput";
import { ProductCategory } from "../models/entities/ProductCategory";
import { ProductCategoryType, ProductType } from "@cromwell/core";

@Resolver(Product)
export class ProductResolver {

    private get repo() { return getCustomRepository(ProductRepository) }

    @Query(() => [Product])
    async products(@Arg("pagedParams") pagedParams: PagedParamsInput<ProductType>): Promise<Product[]> {
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
    async createProduct(@Arg("data") data: CreateProduct): Promise<Product> {
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
    async categories(@Root() product: Product, @Arg("pagedParams") pagedParams: PagedParamsInput<ProductCategoryType>): Promise<ProductCategoryType[]> {
        return await getCustomRepository(ProductCategoryRepository).getCategoriesOfProduct(product.id, pagedParams);
    }

    @FieldResolver()
    views(): number {
        return Math.floor(Math.random() * 10);
    }

}