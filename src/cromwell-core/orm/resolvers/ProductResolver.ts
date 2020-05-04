import { Resolver, Query, Mutation, Arg, FieldResolver } from "type-graphql";
import { Product } from "../models/entities/Product";
import { CreateProduct } from "../models/inputs/CreateProduct";
import { UpdateProduct } from "../models/inputs/UpdateProduct";

@Resolver(Product)
export class ProductResolver {
    @Query(() => [Product])
    products() {
        return Product.find();
    }

    @Query(() => Product)
    product(@Arg("id") id: string) {
        return Product.findOne({ where: { id } });
    }

    @Mutation(() => Product)
    async createProduct(@Arg("data") data: CreateProduct) {
        const post = Product.create(data);
        await post.save();
        return post;
    }

    @Mutation(() => Product)
    async updateProduct(@Arg("id") id: string, @Arg("data") data: UpdateProduct) {
        const post = await Product.findOne({ where: { id } });
        if (!post) throw new Error("Product not found!");
        Object.assign(post, data);
        await post.save();
        return post;
    }

    @Mutation(() => Boolean)
    async deleteProduct(@Arg("id") id: string) {
        const post = await Product.findOne({ where: { id } });
        if (!post) throw new Error("Product not found!");
        await post.remove();
        return true;
    }

    @FieldResolver()
    views(): number {
        return Math.floor(Math.random() * 10);
    }

}