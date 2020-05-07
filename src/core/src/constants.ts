import { DBEntity, GraphQLNode } from './types';

export const GraphQLPaths: { [K in DBEntity]: GraphQLNode } = {
    Post: {
        getOne: "post",
        getAll: "posts",
        create: "createPost",
        update: "updatePost",
        delete: "deletePost"
    },
    Product: {
        getOne: "product",
        getAll: "products",
        create: "createProduct",
        update: "updateProduct",
        delete: "deleteProduct"
    }
}

export const componentsCachePath = '/tmp/components';