import { NextPage } from 'next';
import { ComponentType } from 'react';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

type ParsedUrlQuery = NodeJS.Dict<string | string[]>;
export type StaticPageContext<Q extends ParsedUrlQuery = ParsedUrlQuery> = {
    params?: Q;
    preview?: boolean;
    previewData?: any;
    pluginsConfig?: Record<string, any>;
}
export type TGetStaticProps<
    P extends { [key: string]: any } = { [key: string]: any },
    Q extends ParsedUrlQuery = ParsedUrlQuery> = (ctx: StaticPageContext) => Promise<P>;


export type TCromwellPage<Props = {}> = NextPage<Props & TCromwellPageCoreProps>;

export type TCromwellPageCoreProps = {
    pluginsData: Record<string, any>;
    pluginsSettings: Record<string, any>;
    childStaticProps: Record<string, any>;
    pageConfig?: TPageConfig;
    cmsConfig?: TCmsConfig;
    appConfig?: TAppConfig;
    appCustomConfig?: Record<string, any>;
    pagesInfo?: TPageInfo[];
}

export type TFrontendPluginProps<TData> = {
    data: TData;
    settings: any;
}

export type PageName = keyof {
    index;
    product;
    blog;
}

export type TDataComponentProps<Data> = {
    pluginName: string;
    component: React.ComponentType<Data>;
}

export type TCmsConfig = {
    apiPort: number;
    adminPanelPort: number;
    frontendPort: number;
    themeName: string;
    defaultPageSize: number;
    /** Array of available currencies: ['USD', 'EURO', ...] */
    currencyOptions?: string[];
    /** Object of local curency symbols that will be added to price in getPriceWithCurrency method: {"USD": "$","EURO": "€"}  */
    currencySymbols?: Record<string, string>;
    /** Ratio between currencies: {"USD": 1,"EURO": 0.8} */
    currencyRatio?: Record<string, number>;
}

export type TAppConfig = {
    /** Theme's pages dist dir  */
    pagesDir?: string;
    /** Colors to use */
    palette?: { primaryColor?: string }
    /** Custom HTML add into head of every page */
    headHtml?: string;
}

export type TThemeConfig = {
    pages: TPageConfig[];
    plugins: Record<string, {
        pages: string[],
        options: Record<string, any>
    }>;
    appConfig: TAppConfig;
    /**
     * Custom config that will be available at every page in the Store inside pageConfig props
     */
    appCustomConfig?: Record<string, any>,
    globalModifications?: TCromwellBlockData[];
}

export type TPageInfo = {
    /** Path of page's react component */
    route: string;
    /** Name */
    name: string;
    /** SEO title */
    title?: string;
    /** SEO description */
    description?: string;
    /** Is using next.js dynamic routes? */
    isDynamic?: boolean;
}

export type TPageConfig = TPageInfo & {
    modifications: TCromwellBlockData[];
    pageCustomConfig: Record<string, any>;
}

export type TCromwellBlock = React.Component<TCromwellBlockProps> & {
    getContentInstance: () => React.Component;
}

export type TCromwellStore = {
    pluginsData?: Record<string, any>;
    pluginsSettings?: Record<string, any>;
    cmsconfig?: TCmsConfig;
    pageConfig?: TPageConfig;
    appCustomConfig?: Record<string, any>;
    appConfig?: TAppConfig;
    importPlugin?: (pluginName: string) => { default: ComponentType } | undefined;
    importDynamicPlugin?: (pluginName: string) => ComponentType | undefined;
    rebuildPage?: (path: string) => void;
    /** { [ComponentName]: (Class/function) } */
    components?: Record<string, React.ComponentType<CommonComponentProps>>;
    /** { [CromwellBlockId]: Instance} */
    blockInstances?: Record<string, TCromwellBlock>;
    pagesInfo?: TPageInfo[];
    currency?: string;
    onCurrencyChange?: (currency: string) => void;
    graphQLClient?: any;
    restAPIClient?: any;
}

declare global {
    namespace NodeJS {
        interface Global {
            CromwellStore: TCromwellStore;
        }
    }
    interface Window {
        CromwellStore: TCromwellStore;
    }
}

export type TBlockDestinationPositionType = 'before' | 'after' | 'inside';

export type TCromwellBlockType = 'container' | 'plugin' | 'text' | 'HTML' | 'image' | 'gallery' | 'list';

export type TCromwellBlockData = {
    /**
     * Component's type
     */
    type: TCromwellBlockType;

    /**
     * Component's id, must be unique in a page.
     */
    componentId: string;

    /**
     * If true, indicates that this component was created in builder and it doesn't exist in JSX.
     * Exists only in page's config. 
     */
    isVirtual?: boolean;

    /**
     * Id of Destination Component where this component will be displayed. 
     * Works only for virtual blocks.
     */
    destinationComponentId?: string;

    /**
     * Position around Destination Component where this component will be displayed.
     * Works only for virtual blocks.
     */
    destinationPosition?: TBlockDestinationPositionType;

    /** CSS styles to apply to this block's wrapper*/
    styles?: string;

    /**
     * Non-virtual blocks that exist in JSX cannot be deleted (or moved) in theme's source code by user
     * but user can set isDeleted flag that will tell Blocks to render null instead
     */
    isDeleted?: boolean;

    /** For plugin block */
    plugin?: {
        /** Plugin's name to render inside component. Same name must be in cromwell.config.json */
        pluginName?: string;

        /** Custom editable plugin's config */
        pluginConfig?: Record<string, any>;
    }

    /** For "image" block */
    image?: {
        src?: string;
        link?: string;
        withEffect?: boolean;
    }

    /** For "HTML" block */
    html?: {
        innerHTML?: string;
    }

    /** For gallery block */
    gallery?: TGallerySettings

    /** For text block */
    text?: {
        content?: string;
        textElementType?: keyof React.ReactHTML;
    }
}

type TImageSettings = {
    src: string;
    id?: string | number;
    href?: string;
    thumb?: string;
};

export type TGallerySettings = {
    images: TImageSettings[],
    direction?: "horizontal" | "vertical",
    loop?: boolean;
    height?: number | string;
    width?: number | string;
    /** ratio = width / height */
    ratio?: number;
    slidesPerView?: number;
    backgroundSize?: 'cover' | 'contain';
    navigation?: {
        showOnHover?: boolean
    };
    showPagination?: boolean;
    showScrollbar?: boolean;
    showThumbs?: boolean | {
        width?: string;
        height?: string;
        loop?: boolean
    };
    zoom?: {
        zoomOnHover?: boolean;
        maxRatio?: number;
    };
    components?: {
        imgWrapper?: React.ComponentType<{ image: TImageSettings }>;
    }
}

export type TDBEntity = keyof {
    Post;
    Product;
    ProductCategory;
    Attribute;
}

export type GraphQLPathsType = { [K in TDBEntity]: TGraphQLNode };

export type TGraphQLNode = {
    getOneById: string;
    getOneBySlug?: string;
    getMany: string;
    create: string;
    update: string;
    delete: string;
}

export type TBasePageEntityType = {
    // DB id
    id: string;
    // Slug for page route
    slug?: string;
    // Page SEO title
    pageTitle?: string;
    // DB createDate
    createDate: Date;
    // DB updateDate
    updateDate: Date;
    // Is displaying at frontend
    isEnabled?: boolean;
}

type DBAuxiliaryColumns = 'id' | 'createDate' | 'updateDate';

export type BasePageEntityInputType = Omit<TBasePageEntityType, DBAuxiliaryColumns>;

export type TProductCategory = TBasePageEntityType & {
    // Name of the category (h1)
    name: string;
    // Href of main image
    mainImage: string;
    // Description (HTML allowed)
    description: string;
    // DB children
    children: TProductCategory[];
    // DB parent
    parent: TProductCategory;
    // Products in category
    products: TPagedList<TProduct>;
}

export type ProductCategoryInputType = Omit<TProductCategory, DBAuxiliaryColumns | 'children' | 'parent' | 'products'> & {
    parentId: string;
    childIds: string[];
};

export interface TProduct extends TBasePageEntityType {
    // Name of the product (h1)
    name: string;
    // Categories of the prooduct
    categories: TProductCategory[];
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
    // Rating 1-5
    rating?: number
    // Custom attributes
    attributes?: TAttributeInstance[];
}

export type TProductInput = Omit<TProduct, DBAuxiliaryColumns | 'categories' | 'rating'> & {
    categoryIds: string[];
};

export interface TPost extends TBasePageEntityType {
    // Title of post (h1)
    title: string;
    // DB id of author
    authorId: string;
    // Href of main image
    mainImage: string;
    // Short description (HTML allowed)
    description: string;
    // Post content (HTML allowed)
    content: string;
}

export type TPostInput = Omit<TProduct, DBAuxiliaryColumns>;


export interface TAuthor extends TBasePageEntityType {
    id: string;
    name: string;
}

export type TAttribute = {
    key: string;
    values: TAttributeValue[];
    type: 'radio' | 'checkbox';
    icon?: string;
}
export type TAttributeValue = {
    value: string;
    icon?: string;
}

export type TPagedParams<Entity> = {
    pageNumber?: number;
    pageSize?: number;
    orderBy?: keyof Entity;
    order?: 'ASC' | 'DESC';
}

export type TPagedMeta = {
    pageNumber?: number;
    pageSize?: number;
    totalPages?: number;
    totalElements?: number;
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
}

export type TPagedList<Entity> = {
    pagedMeta?: TPagedMeta;
    elements?: Entity[];
}

export type TCromwellBlockProps = {
    id: string;
    type?: TCromwellBlockType;
    className?: string;
    content?: (data?: TCromwellBlockData,
        blockRef?: React.RefObject<HTMLDivElement>,
        setContentInstance?: (inst: React.Component) => void
    ) => React.ReactNode;
}

export type TContentComponentProps = {
    id: string;
    config?: TCromwellBlockData;
    children?: React.ReactNode
}

export type TPluginConfig = {
    name: string;
    adminDir?: string;
    frontendDir?: string;
    backend?: {
        resolversDir?: string;
        entitiesDir?: string;
    }
}

export type CommonComponentProps = {
    data: TProduct
}
