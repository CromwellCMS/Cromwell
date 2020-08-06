import { TDBEntity, TGraphQLNode } from './types';

export enum BasePageNames {
    Index = 'index',
    Product = 'product',
    Blog = 'blog',
    ProductCategory = 'product_category'
}
export enum BasePagePaths {
    Index = '/',
    Product = '/product',
    Blog = '/blog',
    ProductCategory = '/category'
}

export const GraphQLPaths: { [K in TDBEntity]: TGraphQLNode } = {
    Post: {
        getOneBySlug: "post",
        getOneById: "getPostById",
        getMany: "posts",
        create: "createPost",
        update: "updatePost",
        delete: "deletePost"
    },
    Product: {
        getOneBySlug: "product",
        getOneById: "getProductById",
        getMany: "products",
        create: "createProduct",
        update: "updateProduct",
        delete: "deleteProduct"
    },
    ProductCategory: {
        getOneBySlug: "productCategory",
        getOneById: "getProductCategoryById",
        getMany: "productCategories",
        create: "createProductCategory",
        update: "updateProductCategory",
        delete: "deleteProductCategory"
    }
}

export const DBTableNames: { [K in TDBEntity]: string } = {
    Post: 'post',
    Product: 'product',
    ProductCategory: 'product_category'
}

export const isServer = (): boolean => (typeof window === 'undefined');

export const apiV1BaseRoute = 'api/v1';
// export const isServer = (): boolean => true;


export enum ECommonComponentNames {
    product = 'product',
    post = 'post'
}