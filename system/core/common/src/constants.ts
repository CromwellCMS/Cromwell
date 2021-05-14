import { getCmsSettings, getStoreItem } from './GlobalStore';
import { TCmsConfig, TDBEntity, TGraphQLNode, TLogLevel } from './types/data';

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

export const isServer = (): boolean => (typeof window === 'undefined');

export const currentApiVersion = '1.0.0';
export const apiV1BaseRoute = 'api/v1';
export const apiMainRoute = `${apiV1BaseRoute}/main`;
export const apiExtensionRoute = `${apiV1BaseRoute}/ext`;
// export const isServer = (): boolean => true;

const getBaseUrl = (key: keyof TCmsConfig) => {
    const cmsConfig = getCmsSettings();
    if (!cmsConfig) throw new Error('core:serviceLocator: CmsConfig was not found in the global store!');
    const port = cmsConfig[key] as string;
    if (!port) throw new Error('core:serviceLocator: !port for ' + key);

    if (isServer()) {
        return `http://localhost:${port}`;
    }
    if (window.location.hostname === 'localhost')
        return window.location.protocol + '//localhost:' + port;
    else
        return window.location.protocol + '//' + window.location.host;
}

export const serviceLocator = {
    getMainApiUrl: () => {
        return getBaseUrl('apiPort');
    },
    getApiWsUrl: () => {
        return getBaseUrl('apiPort');
    },
    getFrontendUrl: () => {
        return getBaseUrl('frontendPort');
    },
    getAdminPanelUrl: () => {
        return getBaseUrl('adminPanelPort');
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


export const genericPageName = 'pages/[slug]';

export const sleep = (time: number) => new Promise(done => setTimeout(done, time * 1000));
