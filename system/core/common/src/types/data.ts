import { TCommonComponentProps, TCromwellBlock, TCromwellBlockData } from './blocks';
import { TCmsEntityCore, TProduct, TUser, TServiceVersions } from './entities';
import { ConnectionOptions } from 'typeorm';

/**
 * Global store mostly for internal usage.
 * If you need Redux interactivity, use onStoreChange.
 */
export type TCromwellStore = {
    /**
     * Internal. Plugins data
     */
    plugins?: Record<string, {
        data?: any;
        component?: any;
        code?: string;
        settings?: any;
    }>;
    /**
     * Public CMS Settings 
     */
    cmsSettings?: TCmsSettings;
    /**
     * Config of currently opened Theme's page
     */
    pageConfig?: TPageConfig;
    themeCustomConfig?: Record<string, any>;

    /**
     * Internal. Common component storage. E.g. product cards to be reused by Plugins
     *  { [ComponentName]: (Class/function) }
     *  */
    components?: Record<string, React.ComponentType<TCommonComponentProps & { [x: string]: any }>>;

    /**
     * Internal. References to all instances of Cromwell Blocks at the page
     * { [CromwellBlockId]: Instance}
     */
    blockInstances?: Record<string, TCromwellBlock | undefined>;
    /**
     * Short pages info of current Theme
     */
    pagesInfo?: TPageInfo[];

    /**
     * Active currency
     */
    currency?: string;

    /**
     * Helper to invoke render (force update) of current page's root component
     */
    forceUpdatePage?: () => void;

    /**
     * Info about current DB for backend usage
     */
    dbInfo?: TDBInfo;

    environment?: {
        mode?: 'dev' | 'prod';
        isAdminPanel?: boolean;
        logLevel?: TLogLevel;
    },
    /** Internal */
    apiClients?: {
        graphQLClient?: any;
        restAPIClient?: any;
    }
    webSocketClient?: any;
    cstore?: any;
    nodeModules?: TCromwellNodeModules;
    fsRequire?: (path: string) => Promise<any>;
    notifier?: TCromwellNotify;
    theme?: TCMSTheme;
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
    PostComment;
    Tag;
    Product;
    ProductCategory;
    ProductReview;
    Attribute;
    Order;
    User;
    Theme;
    Plugin;
    Generic;
    CMS;
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

/**
 * cmsconfig.json
 */
export type TCmsConfig = {
    domain?: string;
    orm?: ConnectionOptions;
    apiPort?: number;
    adminPanelPort?: number;
    frontendPort?: number;
    managerPort?: number;
    centralServerUrl?: string;
    defaultSettings?: TCmsEntityCore;
    pm?: 'yarn' | 'cromwella';
    watchPoll?: number;
    useWatch?: boolean;
    env?: 'dev' | 'prod';
    accessTokenSecret?: string;
    refreshTokenSecret?: string;
    accessTokenExpirationTime?: number;
    refreshTokenExpirationTime?: number;
    cookieSecret?: string;
};

/**
 * Merged info form cmsconfig.json and settings from DB
 */
export type TCmsSettings = TCmsConfig & TCmsEntityCore;

export type TRollupConfig = {
    main: Record<string, any>;
    frontend?: Record<string, any>;
    frontendCjs?: Record<string, any>;
    backend?: Record<string, any>;
    themePages?: Record<string, any>;
    adminPanel?: Record<string, any>;
}

/**
 * Theme module config, part of cromwell.config.js
 */
export type TThemeConfig = {
    /** Configs for Rollup */
    rollupConfig?: () => TRollupConfig | Promise<TRollupConfig>;
    /** Next.js config that usually exported from next.config.js */
    nextConfig?: () => any;
    /** Colors to use */
    palette?: TPalette;
    /** Custom HTML to add into head of every page */
    headHtml?: string;
    /** Custom HTML to add to the end of every page */
    footerHtml?: string;
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

export type TDefaultPageName = 'index' | 'category' | 'product' | 'post' | 'tag' | 'pages' | 'account' | 'checkout' | 'blog';

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
    /** If true, this page created in PageBuilder or manually in config and does not have a corresponding source file with React component */
    isVirtual?: boolean;
}

export type TPageConfig = TPageInfo & {
    modifications: TCromwellBlockData[];
    pageCustomConfig?: Record<string, any>;
    adminPanelProps?: any;
    /** Custom HTML to add into head of the page */
    headHtml?: string;
    /** Custom HTML to add to the end of the page */
    footerHtml?: string;
}

/**
 * Plugin module config, part of cromwell.config.js
 */
export type TPluginConfig = {
    /** Options for Rollup */
    rollupConfig?: () => TRollupConfig | Promise<TRollupConfig>;
    adminInputFile?: string
    frontendInputFile?: string
    frontendModule?: string;
    backend?: string;
    defaultSettings?: any;
}

export type TModuleConfig = TThemeConfig & TPluginConfig;

/**
 * Internal. Store for reusable Frontend dependencies.
 */
export type TCromwellNodeModules = {
    importStatuses?: Record<string, 'failed' | 'ready' | 'default' | Promise<'failed' | 'ready' | 'default'>>;
    scriptStatuses?: Record<string, 'failed' | 'ready' | Promise<'failed' | 'ready'>>;
    imports?: Record<string, () => void>;
    modules?: Record<string, any>;
    moduleExternals?: Record<string, string[]>;
    importModule?: (moduleName: string, namedExports?: string[]) => Promise<boolean> | boolean;
    importScriptExternals?: (metaInfo: TScriptMetaInfo) => Promise<boolean>;
    hasBeenExecuted?: boolean;
    prefix?: string;
    setPrefix?: (prefix: string) => void;
};

export type TScriptMetaInfo = {
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
    meta?: TScriptMetaInfo;
    cjsPath?: string;
}

export type TPluginInfo = {
    name: string;
}

export type TLogLevel = "none" | "errors-only" | "errors-warnings" | "minimal" | "detailed" | "all";

/**
 * UI Notification service. In Admin panel it's react-toastify, for example.
 */
export type TCromwellNotify = {
    success?: (message: string, options?) => void;
    warning?: (message: string, options?) => void;
    error?: (message: string, options?) => void;
    info?: (message: string, options?) => void;
}

/**
 * package.json definition with cromwell info
 */
export type TPackageJson = {
    name?: string;
    version?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    module?: string;
    cromwell?: TPackageCromwellConfig;
};

/**
 * Module info in package.json under "cromwell" property
 */
export type TPackageCromwellConfig = {
    name?: string;
    version?: string;
    type?: 'plugin' | 'theme';
    title?: string;
    author?: string;
    authorLink?: string;
    excerpt?: string;
    description?: string;
    icon?: string;
    image?: string;
    images?: string[];
    tags?: string[];
    packageName?: string;
    frontendDependencies?: (string | TFrontendDependency)[];
    themes?: string[];
    plugins?: string[];
    firstLoadedDependencies?: string[];
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
    bundledCss?: string[];
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

export type TCmsStatus = {
    currentVersion?: string;
    updateAvailable: boolean;
    updateInfo?: TUpdateInfo;
    notifications?: TNotification[];
    isUpdating?: boolean;
}

export type TUpdateInfo = {
    name: string;
    version: string;
    packageVersion: string;
    beta: boolean;
    description?: string;
    changelog?: string;
    image?: string;
    createdAt: Date;
    onlyManualUpdate?: boolean;
}

export type TNotification = {
    message: string;
    type: 'info' | 'warning' | 'error';
    documentationLink?: string;
    pageLink?: string
}


/**
 * Version of a CMS module.
 * CCS - Cromwell Central Server
 */
export type TCCSVersion = {
    name: string;
    createdAt: Date;
    version: string;
    packageVersion: string;
    beta: boolean;
    onlyManualUpdate?: boolean;
    restartServices: (keyof TServiceVersions)[];
    description?: string;
    changelog?: string;
    image?: string;
}

export type TCCSModuleShortInfo = {
    version: string;
    packageVersion: string;
    betaVersion?: string;
    betaPackageVersion?: string;
}

export type TCCSModuleInfo = {
    name: string;
    createdAt: Date;
    updatedAt: Date;
    packageName: string;
    version: string;
    packageVersion: string;
    betaVersion: string;
    betaPackageVersion: string;
    author: string;
    authorLink: string;
    slug?: string;
    title?: string;
    description?: string;
    excerpt?: string;
    image?: string;
    images?: string[];
    icon?: string;
    tags?: string[];
}


// PluginSettings
export type TPluginSettingsProps<TSettings = any> = {
    globalSettings?: TSettings;
    pluginName: string;
}

export type TFrontendPluginProps<TData = any, TGlobalSettings = any, TInstanceSettings = any> = {
    data?: TData;
    pluginName: string;
    globalSettings?: TGlobalSettings;
    instanceSettings?: TInstanceSettings;
}

export type TCMSTheme = {
    palette?: TPalette;
    mode?: 'default' | 'dark';
}

export type TDBInfo = {
    dbType?: string;
}