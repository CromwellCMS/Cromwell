import { DBEntity, GraphQLNode } from './types';

export const GraphQLPaths: { [K in DBEntity]: GraphQLNode } = {
    Post: {
        getOneBySlug: "post",
        getOneById: "getPostById",
        getAll: "posts",
        create: "createPost",
        update: "updatePost",
        delete: "deletePost"
    },
    Product: {
        getOneBySlug: "product",
        getOneById: "getProductById",
        getAll: "products",
        create: "createProduct",
        update: "updateProduct",
        delete: "deleteProduct"
    }
}

export const componentsCachePath = '/tmp/components';