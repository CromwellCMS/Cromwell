import { Resolver, Query, Mutation, Arg, FieldResolver } from "type-graphql";
import { ProductCategory } from "../models/entities/ProductCategory";
import { CreateProductCategory } from "../models/inputs/CreateProductCategory";
import { UpdateProductCategory } from "../models/inputs/UpdateProductCategory";

@Resolver(ProductCategory)
export class ProductCategoryResolver {
    @Query(() => [ProductCategory])
    productCategories() {
        return ProductCategory.find();
    }

    @Query(() => ProductCategory)
    productCategory(@Arg("slug") slug: string) {
        return ProductCategory.findOne({ where: { slug } });
    }

    @Query(() => ProductCategory)
    getProductCategoryById(@Arg("id") id: string) {
        return ProductCategory.findOne({ where: { id } });
    }

    @Mutation(() => ProductCategory)
    async createProductCategory(@Arg("data") data: CreateProductCategory) {
        if (data.slug) await this.checkSlug(data.slug);

        const post = ProductCategory.create(data);
        if (!post.slug) post.slug = post.id;
        await post.save();
        return post;
    }

    @Mutation(() => ProductCategory)
    async updateProductCategory(@Arg("id") id: string, @Arg("data") data: UpdateProductCategory) {
        if (data.slug) await this.checkSlug(data.slug);

        const post = await ProductCategory.findOne({ where: { id } });
        if (!post) throw new Error("ProductCategory not found!");
        Object.assign(post, data);
        await post.save();
        return post;
    }

    @Mutation(() => Boolean)
    async deleteProductCategory(@Arg("id") id: string) {
        const post = await ProductCategory.findOne({ where: { id } });
        if (!post) throw new Error("ProductCategory not found!");
        await post.remove();
        return true;
    }

    @FieldResolver()
    views(): number {
        return Math.floor(Math.random() * 10);
    }

    async checkSlug(slug: string) {
        const prod = await ProductCategory.findOne({ where: { slug } });
        if (prod) throw new Error('Slug is not unique');
    }

}