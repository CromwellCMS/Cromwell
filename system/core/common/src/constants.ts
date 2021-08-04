import { TDBEntity, TGraphQLNode } from './types/data';

export const GraphQLPaths: { [K in Exclude<TDBEntity, 'Theme' | 'Plugin' | 'PostComment' | 'CMS'>]: TGraphQLNode } = {
    Generic: {
        getOneBySlug: "getGenericBySlug",
        getOneById: "getGenericById",
        getMany: "getAllGenerics",
        getManyPaged: "getPagedGeneric",
        create: "createGeneric",
        update: "updateGeneric",
        delete: "deleteGeneric",
        deleteMany: "deleteManyGenerics",
    },
    Post: {
        getOneBySlug: "post",
        getOneById: "getPostById",
        getMany: "posts",
        create: "createPost",
        update: "updatePost",
        delete: "deletePost",
        deleteMany: "deleteManyPosts",
        deleteManyFiltered: "deleteManyFilteredPosts",
        getFiltered: "getFilteredPosts",
    },
    Product: {
        getOneBySlug: "product",
        getOneById: "getProductById",
        getMany: "products",
        create: "createProduct",
        update: "updateProduct",
        delete: "deleteProduct",
        deleteMany: "deleteManyProducts",
        deleteManyFiltered: "deleteManyFilteredProducts",
        getFromCategory: "getProductsFromCategory",
        getFiltered: "getFilteredProducts"
    },
    User: {
        getOneBySlug: "user",
        getOneById: "getUserById",
        getMany: "users",
        create: "createUser",
        update: "updateUser",
        delete: "deleteUser",
        deleteMany: "deleteManyUsers",
        deleteManyFiltered: "deleteManyFilteredUsers",
        getFiltered: "getFilteredUsers"
    },
    ProductCategory: {
        getOneBySlug: "productCategory",
        getOneById: "getProductCategoryById",
        getMany: "productCategories",
        create: "createProductCategory",
        update: "updateProductCategory",
        delete: "deleteProductCategory",
        deleteMany: "deleteManyProductCategories",
        deleteManyFiltered: "deleteManyFilteredProductCategories",
        getRootCategories: 'getRootCategories',
        getFiltered: "getFilteredProductCategories",
    },
    Attribute: {
        getOneBySlug: "",
        getOneById: "getAttribute",
        getMany: "getAttributes",
        create: "createAttribute",
        update: "updateAttribute",
        delete: "deleteAttribute",
        deleteMany: "deleteManyAttributes",
    },
    ProductReview: {
        getOneBySlug: "getProductReviewBySlug",
        getOneById: "getProductReview",
        getMany: "getProductReviews",
        create: "createProductReview",
        update: "updateProductReview",
        delete: "deleteProductReview",
        deleteMany: "deleteManyProductReviews",
        deleteManyFiltered: "deleteManyFilteredProductReviews",
        getFiltered: "getFilteredProductReviews",
    },
    Order: {
        getOneBySlug: "getOrderBySlug",
        getOneById: "getOrderById",
        getMany: "getOrders",
        create: "createOrder",
        update: "updateOrder",
        delete: "deleteOrder",
        deleteManyFiltered: "deleteManyFilteredOrders",
        deleteMany: "deleteManyOrders",
        getFiltered: "getFilteredOrders",
        getOrdersOfUser: 'getOrdersOfUser',
    },
    Tag: {
        getOneBySlug: "getTagBySlug",
        getOneById: "getTagById",
        getMany: "getTags",
        create: "createTag",
        update: "updateTag",
        delete: "deleteTag",
        deleteMany: "deleteManyTags",
    },
}

export enum ECommonComponentNames {
    ProductCard = 'ProductCard',
    PostCard = 'PostCard',
}

export const genericPageName = 'pages/[slug]';

export const moduleMainBuildFileName = 'main.bundle.js';
export const moduleLibBuildFileName = 'lib.bundle.js';
export const moduleNodeBuildFileName = 'node.bundle.js';
export const moduleMetaInfoFileName = 'meta.json';
export const moduleBundleInfoFileName = 'bundle.info.json';
export const moduleArchiveFileName = 'module.zip';
export const bundledModulesDirName = 'bundled-modules';
export const moduleGeneratedFileName = 'generated.js';
export const moduleOneChunkGeneratedFileName = 'generated.lib.js';
export const moduleNodeGeneratedFileName = 'generated.node.js';
export const moduleExportsDirChunk = 'generated';
export const moduleChunksBuildDirChunk = 'chunks';