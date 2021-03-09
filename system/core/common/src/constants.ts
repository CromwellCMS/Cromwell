import { TDBEntity, TGraphQLNode, TLogLevel } from './types/data';
import { getCmsSettings, getStoreItem } from './GlobalStore';

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
        getFiltered: "getFilteredPosts",
        getTags: "getPostTags",
    },
    Product: {
        getOneBySlug: "product",
        getOneById: "getProductById",
        getMany: "products",
        create: "createProduct",
        update: "updateProduct",
        delete: "deleteProduct",
        deleteMany: "deleteManyProducts",
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
    },
    ProductCategory: {
        getOneBySlug: "productCategory",
        getOneById: "getProductCategoryById",
        getMany: "productCategories",
        create: "createProductCategory",
        update: "updateProductCategory",
        delete: "deleteProductCategory",
        deleteMany: "deleteManyProductCategories",
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
        getFromProduct: "getProductReviewsOfProduct",
    },
    Order: {
        getOneBySlug: "getOrderBySlug",
        getOneById: "getOrderById",
        getMany: "getOrders",
        create: "createOrder",
        update: "updateOrder",
        delete: "deleteOrder",
        deleteMany: "deleteManyOrders",
        getFiltered: "getFilteredOrders",
    },
}

export const isServer = (): boolean => (typeof window === 'undefined');

export const currentApiVersion = '1.0.0';

export const apiV1BaseRoute = 'api/v1';
// export const isServer = (): boolean => true;


export const serviceLocator = {
    getApiUrl: () => {
        const cmsConfig = getCmsSettings();
        if (!cmsConfig) throw new Error('core:serviceLocator:getApiUrl !cmsConfig');
        const protocol = cmsConfig.protocol ?? 'http';

        if (cmsConfig.domain && cmsConfig.domain !== 'localhost') {
            return `${protocol}://${cmsConfig.domain}`
        } else {
            if (!cmsConfig.apiPort) throw new Error('core:serviceLocator:getApiUrl !apiPort');
            return `${protocol}://localhost:${cmsConfig.apiPort}`
        }
    },
    // Websocket API URL
    getApiWsUrl: () => {
        const cmsConfig = getCmsSettings();
        if (!cmsConfig) throw new Error('core:serviceLocator:getApiUrl !cmsConfig');
        const protocol = 'ws';

        if (cmsConfig.domain && cmsConfig.domain !== 'localhost') {
            return `${protocol}://${cmsConfig.domain}`
        } else {
            if (!cmsConfig.apiPort) throw new Error('core:serviceLocator:getApiWsUrl !apiPort');
            return `${protocol}://localhost:${cmsConfig.apiPort}`
        }
    },
    getManagerUrl: () => {
        const cmsConfig = getCmsSettings();
        if (!cmsConfig) throw new Error('core:serviceLocator:getManagerUrl !cmsConfig');
        const protocol = cmsConfig.protocol ?? 'http';

        if (cmsConfig.domain && cmsConfig.domain !== 'localhost') {
            return `${protocol}://${cmsConfig.domain}`
        } else {
            if (!cmsConfig.managerPort) throw new Error('core:serviceLocator:getApiUrl !apiPort');
            return `${protocol}://localhost:${cmsConfig.managerPort}`
        }
    },
    getManagerWsUrl: () => {
        // Only available at localhost for usage of API Server (as a proxy)
        const cmsConfig = getCmsSettings();
        if (!cmsConfig) throw new Error('core:serviceLocator:getManagerWS !cmsConfig');
        const protocol = 'ws';

        if (!cmsConfig.managerPort) throw new Error('core:serviceLocator:getApiUrl !apiPort');
        return `${protocol}://localhost:${cmsConfig.managerPort}`
    },
    getFrontendUrl: () => {
        const cmsConfig = getCmsSettings();
        if (!cmsConfig) throw new Error('core:serviceLocator:getFrontendUrl !cmsConfig');
        const protocol = cmsConfig.protocol ?? 'http';

        if (cmsConfig.domain && cmsConfig.domain !== 'localhost') {
            return `${protocol}://${cmsConfig.domain}`
        } else {
            if (!cmsConfig.frontendPort) throw new Error('core:serviceLocator:getFrontendUrl !frontendPort');
            return `${protocol}://localhost:${cmsConfig.frontendPort}`
        }
    },
    getAdminPanelUrl: () => {
        const cmsConfig = getCmsSettings();
        if (!cmsConfig) throw new Error('core:serviceLocator:getAdminPanelUrl !cmsConfig');
        const protocol = cmsConfig.protocol ?? 'http';

        if (cmsConfig.domain && cmsConfig.domain !== 'localhost') {
            return `${protocol}://${cmsConfig.domain}/admin`
        } else {
            if (!cmsConfig.adminPanelPort) throw new Error('core:serviceLocator:getAdminPanelUrl !adminPanelPort');
            return `${protocol}://localhost:${cmsConfig.adminPanelPort}`
        }
    }

};

export enum ECommonComponentNames {
    ProductCard = 'ProductCard',
    PostCard = 'PostCard',
}

export const logLevels = ["none", "errors-only", "errors-warnings", "minimal", "detailed", "all"];

export const logLevelMoreThan = (level: TLogLevel): boolean => {
    const currentLevel = getStoreItem('environment')?.logLevel ?? "errors-only";
    const currentLevelIdx = logLevels.indexOf(currentLevel);
    const levelIdx = logLevels.indexOf(level);
    if (currentLevelIdx >= 0 && levelIdx >= 0 && currentLevelIdx >= levelIdx) return true;
    return false;
}

export const logFor = (level: TLogLevel, msg: string, func?: (msg: string) => any) => {
    if (logLevelMoreThan(level)) func ? func(msg) : console.log(msg);
}


export const getRandStr = (lenght: number = 12) =>
    Math.random().toString(36).substring(2, Math.floor(lenght / 2) + 2) +
    Math.random().toString(36).substring(2, Math.ceil(lenght / 2) + 2);