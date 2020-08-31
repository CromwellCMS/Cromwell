import { TDBEntity, TGraphQLNode } from './types/data';

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
        delete: "deleteProduct",
        getFromCategory: "getProductsFromCategory"
    },
    ProductCategory: {
        getOneBySlug: "productCategory",
        getOneById: "getProductCategoryById",
        getMany: "productCategories",
        create: "createProductCategory",
        update: "updateProductCategory",
        delete: "deleteProductCategory"
    },
    Attribute: {
        getOneBySlug: "",
        getOneById: "getAttribute",
        getMany: "getAttributes",
        create: "createAttribute",
        update: "updateAttribute",
        delete: "deleteAttribute"
    },
    ProductReview: {
        getOneBySlug: "",
        getOneById: "getProductReview",
        getMany: "getProductReviews",
        create: "createProductReview",
        update: "updateProductReview",
        delete: "deleteProductReview",
        getFromProduct: "getProductReviewsOfProduct"
    }
}

export const DBTableNames: { [K in TDBEntity]: string } = {
    Post: 'post',
    Product: 'product',
    ProductCategory: 'product_category',
    Attribute: 'attribute',
    ProductReview: 'product_review'
}

export const isServer = (): boolean => (typeof window === 'undefined');

export const apiV1BaseRoute = 'api/v1';
// export const isServer = (): boolean => true;


export enum ECommonComponentNames {
    ProductCard = 'ProductCard',
    Post = 'Post'
}