import { TDBEntity, TGraphQLNode } from './types/data';
import { TPaymentOption, TShippingOption } from './types/entities';

export const GraphQLPaths: { [K in Exclude<TDBEntity, 'Theme' | 'Plugin' | 'PostComment' | 'CMS'>]: TGraphQLNode } = {
  Generic: {
    getOneBySlug: 'getGenericBySlug',
    getOneById: 'getGenericById',
    getMany: 'getAllGenerics',
    getManyPaged: 'getPagedGeneric',
    create: 'createGeneric',
    update: 'updateGeneric',
    delete: 'deleteGeneric',
    deleteMany: 'deleteManyGenerics',
    getFiltered: 'getFilteredGenerics',
  },
  Post: {
    getOneBySlug: 'getPostBySlug',
    getOneById: 'getPostById',
    getMany: 'getPosts',
    create: 'createPost',
    update: 'updatePost',
    delete: 'deletePost',
    deleteMany: 'deleteManyPosts',
  },
  Product: {
    getOneBySlug: 'getProductBySlug',
    getOneById: 'getProductById',
    getMany: 'getProducts',
    create: 'createProduct',
    update: 'updateProduct',
    delete: 'deleteProduct',
    deleteMany: 'deleteManyProducts',
  },
  User: {
    getOneBySlug: 'getUserBySlug',
    getOneById: 'getUserById',
    getOneByEmail: 'getUserByEmail',
    getMany: 'getUsers',
    create: 'createUser',
    update: 'updateUser',
    delete: 'deleteUser',
    deleteMany: 'deleteManyUsers',
  },
  ProductCategory: {
    getOneBySlug: 'getProductCategoryBySlug',
    getOneById: 'getProductCategoryById',
    getMany: 'getProductCategories',
    create: 'createProductCategory',
    update: 'updateProductCategory',
    delete: 'deleteProductCategory',
    deleteMany: 'deleteManyProductCategories',
    getRootCategories: 'getRootCategories',
  },
  Attribute: {
    getOneBySlug: 'getAttributeBySlug',
    getOneById: 'getAttributeById',
    getMany: 'getAttributes',
    create: 'createAttribute',
    update: 'updateAttribute',
    delete: 'deleteAttribute',
    deleteMany: 'deleteManyAttributes',
  },
  ProductReview: {
    getOneBySlug: 'getProductReviewBySlug',
    getOneById: 'getProductReviewById',
    getMany: 'getProductReviews',
    create: 'createProductReview',
    update: 'updateProductReview',
    delete: 'deleteProductReview',
    deleteMany: 'deleteManyProductReviews',
  },
  Order: {
    getOneBySlug: 'getOrderBySlug',
    getOneById: 'getOrderById',
    getMany: 'getOrders',
    create: 'createOrder',
    update: 'updateOrder',
    delete: 'deleteOrder',
    deleteMany: 'deleteManyOrders',
    getOrdersOfUser: 'getOrdersOfUser',
  },
  Tag: {
    getOneBySlug: 'getTagBySlug',
    getOneById: 'getTagById',
    getMany: 'getTags',
    create: 'createTag',
    update: 'updateTag',
    delete: 'deleteTag',
    deleteMany: 'deleteManyTags',
  },
  CustomEntity: {
    getOneBySlug: 'getCustomEntityBySlug',
    getOneById: 'getCustomEntityById',
    getMany: 'getCustomEntities',
    create: 'createCustomEntity',
    update: 'updateCustomEntity',
    delete: 'deleteCustomEntity',
    deleteMany: 'deleteManyCustomEntities',
  },
  Coupon: {
    getOneBySlug: 'getCouponBySlug',
    getOneById: 'getCouponById',
    getMany: 'getCoupons',
    create: 'createCoupon',
    update: 'updateCoupon',
    delete: 'deleteCoupon',
    deleteMany: 'deleteManyCoupons',
    getCouponsByCodes: 'getCouponsByCodes',
  },
  ProductVariant: {
    getOneBySlug: 'getProductVariantBySlug',
    getOneById: 'getProductVariantById',
    getMany: 'getProductVariants',
    create: 'createProductVariant',
    update: 'updateProductVariant',
    delete: 'deleteProductVariant',
    deleteMany: 'deleteManyProductVariants',
    getProductVariantsByCodes: 'getProductVariantsByCodes',
  },
  Role: {
    getOneBySlug: 'getRoleBySlug',
    getOneById: 'getRoleById',
    getMany: 'getRoles',
    create: 'createRole',
    update: 'updateRole',
    delete: 'deleteRole',
    deleteMany: 'deleteManyRoles',
  },
};

export enum ESharedComponentNames {
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

export const systemPackages = [
  '@cromwell/core',
  '@cromwell/admin-panel',
  '@cromwell/cli',
  '@cromwell/core-backend',
  '@cromwell/core-frontend',
  '@cromwell/cms',
  '@cromwell/renderer',
  '@cromwell/server',
  '@cromwell/utils',
] as const;

export const nodeRequire = ((name: string) => eval(`require('${name}');`)) as NodeRequire;

export const standardShipping: TShippingOption = {
  key: 'Standard shipping',
  name: 'Standard shipping',
};

export const payLaterOption: TPaymentOption = {
  key: 'Pay later',
  name: 'Pay later',
};
