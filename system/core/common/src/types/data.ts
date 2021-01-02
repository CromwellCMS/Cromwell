
import { TCommonComponentProps, TCromwellBlock, TCromwellBlockData } from './blocks'
import { TCmsEntityCore } from './entities';


export type TCromwellStore = {
    pluginsData?: Record<string, any>;
    pluginsComponents?: Record<string, any>;
    pluginsSettings?: Record<string, any>;
    cmsSettings?: TCmsSettings;
    pageConfig?: TPageConfig;
    themeCustomConfig?: Record<string, any>;
    themeMainConfig?: TThemeMainConfig;
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
    graphQLClient?: any;
    restAPIClient?: any;
    webSocketClient?: any;
    cstore?: any;
    nodeModules?: TCromwellNodeModules;
    themePageComponents?: Record<string, any>;
    fsRequire?: (path: string) => any;
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
    Generic;
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

// Stored in cmsconfig.json
export type TCmsConfig = {
    domain?: string;
    protocol?: 'http' | 'https';
    apiPort: number;
    adminPanelPort: number;
    frontendPort: number;
    managerPort: number;
    defaultSettings?: TCmsEntityCore;
    pm?: 'yarn' | 'cromwella';
}

// Info form cmsconfig.json and settings from DB
export type TCmsSettings = TCmsConfig & TCmsEntityCore;

export type TBuildConfig = {
    name: string;
    type: 'plugin' | 'theme';
    rollupConfig?: () => TRollupConfig | Promise<TRollupConfig>;
}

export type TRollupConfig = {
    main: Record<string, any>;
    frontendBundle?: Record<string, any>;
    frontendCjs?: Record<string, any>;
    backend?: Record<string, any>;
    themePages?: Record<string, any>;
    adminPanel?: Record<string, any>;
}


export type TThemeConfig = TBuildConfig & {
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
    /** Meta title (SEO) */
    title?: string;
    /** Meta description (SEO) */
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

export type TPluginConfig = TBuildConfig & {
    adminInputFile?: string
    frontendInputFile?: string
    frontendModule?: string;
    backend?: {
        resolversDir?: string;
        entitiesDir?: string;
    }
    defaultSettings?: any;
    title?: string;
}

export type TCromwellNodeModules = {
    importStatuses?: Record<string, 'failed' | 'ready' | 'default' | Promise<'failed' | 'ready' | 'default'>>;
    scriptStatuses?: Record<string, 'failed' | 'ready' | Promise<'failed' | 'ready'>>;
    imports?: Record<string, () => void>;
    modules?: Record<string, Object>;
    moduleExternals?: Record<string, string[]>;
    importModule?: (moduleName: string, namedExports?: string[]) => Promise<boolean> | boolean;
    importSciptExternals?: (metaInfo: TSciprtMetaInfo) => Promise<boolean>;
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
    }[]
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