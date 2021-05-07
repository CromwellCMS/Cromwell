import { TCommonComponentProps, TCromwellBlock, TCromwellBlockData } from './blocks';
import { TCmsEntityCore, TProduct, TUser } from './entities';


export type TCromwellStore = {
    pluginsData?: Record<string, any>;
    pluginsComponents?: Record<string, any>;
    pluginsSettings?: Record<string, any>;
    cmsSettings?: TCmsSettings;
    pageConfig?: TPageConfig;
    themeCustomConfig?: Record<string, any>;
    rebuildPage?: (path: string) => void;
    /** { [ComponentName]: (Class/function) } */
    components?: Record<string, React.ComponentType<TCommonComponentProps & { [x: string]: any }>>;
    /** { [CromwellBlockId]: Instance} */
    blockInstances?: Record<string, TCromwellBlock | undefined>;
    pagesInfo?: TPageInfo[];
    currency?: string;
    forceUpdatePage?: () => void;
    dbType?: string;
    environment?: {
        mode?: 'dev' | 'prod';
        isAdminPanel?: boolean;
        logLevel?: TLogLevel;
    },
    apiClients?: {
        mainGraphQLClient?: any;
        pluginGraphQLClient?: any;
        mainRestAPIClient?: any;
        pluginRestAPIClient?: any;
    }
    webSocketClient?: any;
    cstore?: any;
    nodeModules?: TCromwellNodeModules;
    fsRequire?: (path: string) => any;
    notifier?: TCromwellNotify;
    palette?: TPalette;
    userInfo?: TUser;
    storeChangeCallbacks?: Record<string, ((prop) => any)[]>;
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
    User;
    Product;
    ProductCategory;
    ProductReview;
    Attribute;
    Order;
    Generic;
    Tag;
}

export type GraphQLPathsType = { [K in TDBEntity]: TGraphQLNode };

export type TGraphQLNode = {
    getOneById: string;
    getOneBySlug: string;
    getMany: string;
    create: string;
    update: string;
    delete: string;
    deleteMany: string;
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

// Stored in cmsconfig.json
export type TCmsConfig = {
    domain?: string;
    protocol?: 'http' | 'https';
    mainApiPort?: number;
    pluginApiPort?: number;
    adminPanelPort?: number;
    frontendPort?: number;
    managerPort?: number;
    defaultSettings?: TCmsEntityCore;
    pm?: 'yarn' | 'cromwella';
    watchPoll?: number;
    useWatch?: boolean;
}

// Info form cmsconfig.json and settings from DB
export type TCmsSettings = TCmsConfig & TCmsEntityCore;

export type TRollupConfig = {
    main: Record<string, any>;
    frontendBundle?: Record<string, any>;
    frontendCjs?: Record<string, any>;
    backend?: Record<string, any>;
    themePages?: Record<string, any>;
    adminPanel?: Record<string, any>;
}

export type TThemeConfig = {
    /** Configs for Rollup */
    rollupConfig?: () => TRollupConfig | Promise<TRollupConfig>;
    /** Colors to use */
    palette?: TPalette;
    /** Custom HTML to add into head of every page */
    headHtml?: string;
    /** Global CSS files to import from node_modules */
    globalCss?: string[];
    /** Mapping of default CMS pages to theme's components. Such as { category: "category/[slug]" } */
    defaultPages?: Record<TDefaultPageName, string>;
    /** Pages' description and modifications */
    pages?: TPageConfig[];
    /** Custom config that will be available at every page in the Store inside pageConfig props */
    themeCustomConfig?: Record<string, any>;
    /** Modifications to apply on all pages */
    globalModifications?: TCromwellBlockData[];
}

export type TDefaultPageName = 'index' | 'category' | 'product' | 'post' | 'tag' | 'pages' | 'account' | 'blog';

export type TPalette = {
    primaryColor?: string;
    secondaryColor?: string;
};

export type TPageInfo = {
    /** Unique ID of a page */
    id: string;

    /** 
     * Page's url/slug. Can be:
     * 1. Filesystem relative path of page's react component without extension. If file name is "./post/[slug].tsx"
     * then route must be "post/[slug]"
     * 2. Route of a virtual page (generic page). Responsible component is "pages/[slug].js" ,
     * route must in format: "pages/any-slug"
     * */
    route: string;

    /** Name */
    name: string;
    /** Meta title (SEO) */
    title?: string;
    /** Meta description (SEO) */
    description?: string;
    /** Is using next.js dynamic routes? */
    isDynamic?: boolean;
    /** Created in Pagebuilder or manually in config and does not have a corresponding .js file with React component */
    isVirtual?: boolean;
}

export type TPageConfig = TPageInfo & {
    modifications: TCromwellBlockData[];
    pageCustomConfig?: Record<string, any>;
    adminPanelProps?: any;
}

export type TPluginConfig = {
    /** Configs for Rollup */
    rollupConfig?: () => TRollupConfig | Promise<TRollupConfig>;
    adminInputFile?: string
    frontendInputFile?: string
    frontendModule?: string;
    backend?: {
        resolversDir?: string;
        entitiesDir?: string;
    }
    defaultSettings?: any;
}

export type TModuleConfig = TThemeConfig & TPluginConfig;

export type TCromwellNodeModules = {
    importStatuses?: Record<string, 'failed' | 'ready' | 'default' | Promise<'failed' | 'ready' | 'default'>>;
    scriptStatuses?: Record<string, 'failed' | 'ready' | Promise<'failed' | 'ready'>>;
    imports?: Record<string, () => void>;
    modules?: Record<string, any>;
    moduleExternals?: Record<string, string[]>;
    importModule?: (moduleName: string, namedExports?: string[]) => Promise<boolean> | boolean;
    importSciptExternals?: (metaInfo: TSciprtMetaInfo) => Promise<boolean>;
    hasBeenExecuted?: boolean;
    prefix?: string;
    setPrefix?: (prefix: string) => void;
};

export type TSciprtMetaInfo = {
    name: string;
    // { [moduleName]: namedImports }
    externalDependencies: Record<string, string[]>;
    import?: 'chunks' | 'lib';
}

export type TPagesMetaInfo = {
    paths: {
        pageName: string;
        localPath?: string;
        srcFullPath?: string;
        importedStyles?: string[];
        basePath?: string;
        localDepsBundle?: string;
    }[];
    basePath?: string;
    rootBuildDir?: string;
    buildDir?: string;
}

export type TFrontendBundle = {
    source?: string;
    meta?: TSciprtMetaInfo;
    cjsPath?: string;
}

export type TPluginInfo = {
    name: string;
}

export type TLogLevel = "none" | "errors-only" | "errors-warnings" | "minimal" | "detailed" | "all";

// react-toastify, for example
export type TCromwellNotify = {
    success?: (message: string, options?) => void;
    warning?: (message: string, options?) => void;
    error?: (message: string, options?) => void;
    info?: (message: string, options?) => void;
}

export type TPackageJson = {
    name?: string;
    version?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    module?: string;
    cromwell?: TPackageCromwellConfig;
};

export type TPackageCromwellConfig = {
    name?: string;
    type?: 'plugin' | 'theme';
    title?: string;
    description?: string;
    icon?: string;
    previewImage?: string;
    frontendDependencies?: (string | TFrontendDependency)[];
    themes?: string[];
    plugins?: string[];
    bundledDependencies?: string[];
}

export type TCromwellaConfig = {
    packages: string[];
    frontendDependencies?: (string | TFrontendDependency)[];
}

export type TFrontendDependency = {
    name: string;
    version?: string;
    builtins?: string[];
    externals?: TExternal[];
    excludeExports?: string[];
    ignore?: string[];
    addExports?: TAdditionalExports[];
}

export type TExternal = {
    usedName: string;
    moduleName?: string;
    importName?: string;
}

export type TAdditionalExports = {
    name: string;
    path?: string;
    importType?: 'default' | 'named';
    saveAsModules?: string[];
}

export type TStoreListItem = {
    product?: TProduct;
    pickedAttributes?: Record<string, string[]>;
    amount?: number;
}

export type TCmsStats = {
    reviews: number;
    averageRating: number;
    pages: number;
    pageViews: number;
    topPageViews: TPageStats[];
    orders: number;
    salesValue: number;
    salesPerDay: TSalePerDay[];
    customers: number;
}

export type TPageStats = {
    pageRoute?: string;
    views?: number;
    productSlug?: string;
    categorySlug?: string;
    postSlug?: string;
    tagSlug?: string;
    pageId?: string;
}

export type TSalePerDay = {
    date: Date;
    orders: number;
    salesValue: number;
}