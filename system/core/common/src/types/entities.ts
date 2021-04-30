import { TPagedList, TStoreListItem } from './data';

export type TBasePageEntity = {
    // DB id
    id: string;
    // Slug for page route
    slug?: string;
    // Page SEO title
    pageTitle?: string;
    // Page SEO description
    pageDescription?: string;
    // DB createDate
    createDate?: Date;
    // DB updateDate
    updateDate?: Date;
    // Is displaying at frontend
    isEnabled?: boolean;
}

type TDBAuxiliaryColumns = 'id' | 'createDate' | 'updateDate';

export type TBasePageEntityInput = Omit<TBasePageEntity, TDBAuxiliaryColumns>;


// ProductCategory

type TProductCategoryCore = {
    // Name of the category (h1)
    name: string;
    // Href of main image
    mainImage?: string;
    // Description (HTML allowed)
    description?: string;
    // Description in Quill format
    descriptionDelta?: string;
    // DB children
    children?: TProductCategory[];
    // DB parent
    parent?: TProductCategory | null;
    // Products in category
    products?: TPagedList<TProduct>;
}

export type TProductCategory = TProductCategoryCore & TBasePageEntity;

export type TProductCategoryInput = TBasePageEntityInput & Omit<TProductCategoryCore, 'children' | 'parent' | 'products'> & {
    parentId?: string;
    childIds?: string[];
};

export type TProductCategoryFilter = {
    nameSearch?: string;
}


// PRODUCT

export interface TProduct extends TBasePageEntity {
    // Name of the product (h1)
    name?: string;
    // Categories of the prooduct
    categories?: TProductCategory[];
    // Price. Will be discount price if oldPrice is specified
    price?: number;
    // Price before sale, optional
    oldPrice?: number;
    // Href of main image
    mainImage?: string;
    // Hrefs of iamges
    images?: string[];
    // Description (HTML allowed)
    description?: string;
    // Description in Quill format
    descriptionDelta?: string;
    // Rating data
    rating?: TProductRating;
    // Customer reviews 
    reviews?: TProductReview[];
    // Custom attributes
    attributes?: TAttributeInstance[];
    // Qnt of page requests
    views?: number;
}

export type TProductRating = {
    // Rating 1-5
    average?: number;
    // Number of customer reviews
    reviewsNumber?: number;
}

export type TProductInput = Omit<TProduct, TDBAuxiliaryColumns | 'categories' | 'rating' | 'reviews'> & {
    categoryIds?: string[];
};

export type TProductFilter = {
    minPrice?: number;
    maxPrice?: number;
    attributes?: TProductFilterAttribute[];
    nameSearch?: string;
}
export type TProductFilterAttribute = {
    key: string;
    values: string[];
}

export type TFilteredProductList = TPagedList<TProduct> & {
    filterMeta: TProductFilterMeta;
}

export type TProductFilterMeta = {
    minPrice?: number;
    maxPrice?: number;
}


// POST

export interface TPost extends TBasePageEntity {
    // Title of post (h1)
    title?: string | null;
    // User-author
    author?: TUser;
    // Href of main image
    mainImage?: string | null;
    // Estimated time in minutes to read the post
    readTime?: string | null;
    // Tags / categories to show post
    tags?: TTag[] | null;
    // Post content, HTML
    content?: string | null;
    // Post content, stringified JSON from Quill.js
    delta?: string | null;
    // Short description to display in blog list
    excerpt?: string | null;
    // Is published?
    isPublished?: boolean | null;
    // Publish date
    publishDate?: Date | null;
}

export type TPostInput = Omit<TPost, TDBAuxiliaryColumns | 'author' | 'tags'> & {
    authorId: string;
    tagIds?: string[] | null;
};

export type TPostFilter = {
    authorId?: string;
    titleSearch?: string;
    tagIds?: string[];
    published?: boolean;
}

export interface TTag extends TBasePageEntity {
    name: string;
    color?: string | null;
    image?: string | null;
    description?: string | null;
}

export type TTagInput = Omit<TTag, TDBAuxiliaryColumns>;

// USER / AUTHOR

export interface TUser extends TBasePageEntity {
    // Name
    fullName: string;
    // E-mail
    email: string;
    // Avatar image
    avatar?: string;
    bio?: string;
    phone?: string;
    address?: string;
    role?: TUserRole;
}
export type TUserRole = 'administrator' | 'author' | 'customer' | 'guest';
export type TAuthRole = TUserRole | 'self' | 'all';

export type TCreateUser = Omit<TUser, TDBAuxiliaryColumns> & {
    password?: string;
};

export type TUpdateUser = Omit<TUser, TDBAuxiliaryColumns>;

export type TUserFilter = {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    role?: TUserRole;
}

// Attribute

export interface TAttribute extends TBasePageEntity {
    key: string;
    values: TAttributeValue[];
    type: 'radio' | 'checkbox';
    icon?: string;
}

export type TAttributeInput = Omit<TAttribute, TDBAuxiliaryColumns>;

export type TAttributeValue = {
    value: string;
    icon?: string;
}

export type TAttributeInstance = {
    key: string;
    values: TAttributeInstanceValue[];
}

export type TAttributeInstanceValue = {
    value: string;
    productVariant?: TAttributeProductVariant;
}

export type TAttributeProductVariant = {
    name?: string;
    price?: number;
    oldPrice?: number;
    mainImage?: string;
    images?: string[];
    description?: string;
    descriptionDelta?: string;
}


// ProductReview

type TProductReviewCore = {
    productId: string;
    title?: string;
    description?: string;
    rating?: number;
    userName?: string;
    userId?: string;
    approved?: boolean;
}

export type TProductReview = TProductReviewCore & TBasePageEntity;

export type TProductReviewInput = TProductReviewCore & TBasePageEntityInput;


// Store order

type TOrderCore = {
    status?: string;
    cart?: string | TStoreListItem[];
    orderTotalPrice?: number;
    cartTotalPrice?: number;
    cartOldTotalPrice?: number;
    shippingPrice?: number;
    totalQnt?: number;
    userId?: string;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    customerAddress?: string;
    customerComment?: string;
    shippingMethod?: string;
}

export type TOrder = TOrderCore & TBasePageEntity;

export type TOrderInput = TOrderCore & TBasePageEntityInput;

export type TOrderFilter = {
    status?: string;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    orderId?: string;
    dateFrom?: string;
    dateTo?: string;
}

// Theme entity

type TThemeEntityCore = {
    name: string;
    isInstalled: boolean;
    hasAdminBundle?: boolean;
    title?: string;
    settings?: string;
    defaultSettings?: string;
    moduleInfo?: string;
}

export type TThemeEntity = TThemeEntityCore & TBasePageEntity;

export type TThemeEntityInput = TThemeEntityCore & TBasePageEntityInput;


// Plugin entity

type TPluginEntityCore = {
    name: string;
    title?: string;
    isInstalled: boolean;
    hasAdminBundle?: boolean;
    settings?: string;
    defaultSettings?: string;
    moduleInfo?: string;
}

export type TPluginEntity = TPluginEntityCore & TBasePageEntity;

export type TPluginEntityInput = TPluginEntityCore & TBasePageEntityInput;



// DB CMS entity

export type TCmsEntityCore = {
    // < Public config >
    // Protocol for api client to use
    protocol?: 'http' | 'https';
    // Package name of currently used theme
    themeName?: string;
    // Page size to use in lists, eg. at Product Category page
    defaultPageSize?: number;
    // Available currencies in the store and rates between them to convert
    currencies?: TCurrency[];
    // Default timezone in GMT, number +-
    timezone?: number;
    // Default language
    language?: string;
    // Website favicon
    favicon?: string;
    // Website logo
    logo?: string;
    // Standard shipping price if no shipment methods specified
    defaultShippingPrice?: number;

    // Custom HTML code injection
    headerHtml?: string;
    footerHtml?: string;
    // < / >


    // < Advanced / private config >
    // SMTP connection string to e-mail service provider
    smtpConnectionString?: string;
    // E-mail to send mails from
    sendFromEmail?: string;
    // < / >

    // < INTERNAL >
    // Internal. https://github.com/CromwellCMS/Cromwell/blob/55046c48d9da0a44e4b11e7918c73876fcd1cfc1/system/manager/src/managers/baseManager.ts#L194:L206
    versions?: TServiceVersions | string;
    // Internal. If false or not set, will launch installation at first Admin Panel visit.
    installed?: boolean;
    // < / >
}

export type TCmsEntityInput = {
    protocol?: 'http' | 'https';
    defaultPageSize?: number;
    currencies?: TCurrency[];
    timezone?: number;
    language?: string;
    favicon?: string;
    logo?: string;
    headerHtml?: string;
    footerHtml?: string;
    defaultShippingPrice?: number;
    smtpConnectionString?: string;
    sendFromEmail?: string;
}

export type TServiceVersions = {
    renderer?: number;
    serverMain?: number;
    serverPlugin?: number;
    adminPanel?: number;
};

export type TCmsEntity = TCmsEntityCore & TBasePageEntity;


export type TCurrency = {
    tag: string;
    title?: string;
    /** Local curency symbols that will be added to price in getPriceWithCurrency method */
    symbol?: string;
    /** Ratio for currencies to compare: "USD": 1,"EURO": 0.8, etc. */
    ratio?: number;
}


export type TDeleteManyInput = {
    ids: string[];
    all?: boolean;
}