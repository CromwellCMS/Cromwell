
import { ComponentType } from 'react';
import { TCommonComponentProps, TCromwellBlock, TCromwellBlockData } from './blocks'


export type TCromwellStore = {
    pluginsData?: Record<string, any>;
    pluginsSettings?: Record<string, any>;
    cmsconfig?: TCmsConfig;
    pageConfig?: TPageConfig;
    themeCustomConfig?: Record<string, any>;
    themeMainConfig?: TThemeMainConfig;
    importPlugin?: (pluginName: string) => { default: ComponentType } | undefined;
    importDynamicPlugin?: (pluginName: string) => ComponentType | undefined;
    rebuildPage?: (path: string) => void;
    /** { [ComponentName]: (Class/function) } */
    components?: Record<string, React.ComponentType<TCommonComponentProps>>;
    /** { [CromwellBlockId]: Instance} */
    blockInstances?: Record<string, TCromwellBlock | undefined>;
    pagesInfo?: TPageInfo[];
    currency?: string;
    forceUpdatePage?: () => void;
    dbType?: string;
    env?: 'dev' | 'prod';
    graphQLClient?: any;
    restAPIClient?: any;
    webSocketClient?: any;
    cstore?: any;
    // nodeModules?: TCromwellNodeModules;
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

export type TDBEntity = keyof {
    Post;
    Product;
    ProductCategory;
    ProductReview;
    Attribute;
}

export type GraphQLPathsType = { [K in TDBEntity]: TGraphQLNode };

export type TGraphQLNode = {
    getOneById: string;
    getOneBySlug: string;
    getMany: string;
    create: string;
    update: string;
    delete: string;
    [x: string]: string;
}


export type TPagedList<Entity> = {
    pagedMeta?: TPagedMeta;
    elements?: Entity[];
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

export type TCmsConfig = {
    domain?: string;
    protocol?: 'http' | 'https';
    apiPort: number;
    adminPanelPort: number;
    frontendPort: number;
    managerPort: number;
    themeName: string;
    defaultPageSize?: number;
    /** Array of available currencies: ['USD', 'EURO', ...] */
    currencyOptions?: string[];
    /** Object of local curency symbols that will be added to price in getPriceWithCurrency method: {"USD": "$","EURO": "€"}  */
    currencySymbols?: Record<string, string>;
    /** Ratio between currencies: {"USD": 1,"EURO": 0.8} */
    currencyRatio?: Record<string, number>;
}

export type TThemeConfig = {
    main: TThemeMainConfig;
    pages: TPageConfig[];

    /**
     * Custom config that will be available at every page in the Store inside pageConfig props
     */
    themeCustomConfig?: Record<string, any>;
    globalModifications?: TCromwellBlockData[];
}

export type TThemeMainConfig = {
    themeName: string;

    /** Dir with production build of the theme. Path is relative from theme's root dir */
    buildDir?: string;
    /** Theme's pages dir inside buildDir. Same as in Next.js "pages" dir. Path is relative from theme's root dir  */
    pagesDir?: string;
    /** Path to component to use in Admin Panel */
    adminPanelDir?: string;
    /** Colors to use */
    palette?: { primaryColor?: string };
    /** Custom HTML to add into head of every page */
    headHtml?: string;
    /** Global CSS files to import from node_modules */
    globalCss?: string[];

    /** View fields to display in Admin Panel: */
    previewImage?: string;
    title?: string;
    description?: string;
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
    /** Is created in page builder and so does not has a .js file in theme's dir */
    isVirtual?: boolean;
}

export type TPageConfig = TPageInfo & {
    modifications: TCromwellBlockData[];
    pageCustomConfig?: Record<string, any>;
}