import { NextPage } from 'next';
import { ReactNode } from 'react';

import { TCmsSettings, TPageConfig, TPageInfo, TPalette } from './data';
import { TPost, TProduct } from './entities';

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


export type TCromwellPage<Props = {} | undefined> = NextPage<Props & TCromwellPageCoreProps>;

export type TCromwellPageCoreProps = {
    pluginsData?: Record<string, any>;
    pluginsSettings?: Record<string, any>;
    childStaticProps?: Record<string, any>;
    pageConfig?: TPageConfig;
    cmsSettings?: TCmsSettings;
    themeCustomConfig?: Record<string, any>;
    pagesInfo?: TPageInfo[];
    headHtml?: string | null;
    palette?: TPalette | null;
}

export type TFrontendPluginProps<TData = any, TSettings = any> = {
    data?: TData;
    settings?: TSettings;
    pluginName: string;
}

export type TAdminPanelPluginProps<TSettings = any> = {
    settings?: TSettings;
    pluginName: string;
}

export type TCromwellBlock = React.Component<TCromwellBlockProps> & {
    getContentInstance: () => React.Component;
    setContentInstance: (contentInstance: React.Component) => void;
    getData: () => TCromwellBlockData | undefined;
    getBlockRef: () => React.RefObject<HTMLDivElement>;
    contentRender: (getContent?: TBlockContentGetter | null) => React.ReactNode | null;
    consumerRender: (jsxParentId?: string) => React.ReactNode | null;
    getDefaultContent: () => React.ReactNode | null;
    notifyChildRegistered: (inst: TCromwellBlock) => void;
    rerender: () => Promise<void>;
    addDidUpdateListener: (id: string, func: () => void) => void;
    getRenderPromise: () => Promise<void> | null;
}

export type TDataComponentProps<Data> = {
    pluginName: string;
    component: React.ComponentType<Data>;
}


export type TCromwellBlockProps = {
    id: string;
    type?: TCromwellBlockType;
    className?: string;
    jsxParentId?: string;
    content?: (data: TCromwellBlockData | undefined,
        blockRef: React.RefObject<HTMLDivElement>,
        setContentInstance: (inst: React.Component) => void
    ) => React.ReactNode;
} & TCromwellBlockData;

export type TContentComponentProps = {
    id: string;
    config?: TCromwellBlockData;
    children?: React.ReactNode;
}

export type TCommonComponentProps = {
    data?: TProduct | TPost | any;
}

export type TCromwellBlockType = 'container' | 'plugin' | 'text' | 'HTML' | 'image' | 'gallery' | 'list' | 'link';

export type TCromwellBlockData = {
    /**
     * Component's type
     */
    type?: TCromwellBlockType;

    /**
     * Component's id, must be unique in a page.
     */
    id: string;

    /**
     * If true, indicates that this component was created in builder and it doesn't exist in source files.
     * Exists only in page's config. 
     */
    isVirtual?: boolean;

    /**
     * Id of Destination Component where this component will be displayed. 
     */
    parentId?: string;

    /**
     * Index inside children array of parent element 
     */
    index?: number;

    /** CSS styles to apply to this block's wrapper*/
    styles?: string;

    /**
     * Non-virtual blocks that exist in JSX cannot be deleted (or moved) in theme's source code by user
     * but user can set isDeleted flag that will tell Blocks to render null instead
     */
    isDeleted?: boolean;

    /** For plugin block */
    plugin?: {
        /** Plugin's name to render inside component. Same name must be in module.config.js */
        pluginName?: string;

        /** Custom editable plugin's settings */
        settings?: Record<string, any>;
    };

    /** For "image" block */
    image?: {
        src?: string;
        link?: string;
        withEffect?: boolean;
    };

    /** For "HTML" block */
    html?: {
        innerHTML?: string;
    };

    /** For gallery block */
    gallery?: TGallerySettings;

    /** For text block */
    text?: {
        content?: string;
        textElementType?: keyof React.ReactHTML;
    };

    /** If true, user can't delete or modify this block in the editor */
    isConstant?: boolean;

    /** For link block */
    link?: {
        href?: string;
        text?: string;
    }
}

type TImageSettings = {
    src: string;
    id?: string | number;
    href?: string;
    thumb?: string;
};

export type TGallerySettings = {
    images: TImageSettings[];
    direction?: "horizontal" | "vertical";
    loop?: boolean;
    height?: number | string;
    width?: number | string;
    /** ratio = width / height */
    ratio?: number;
    slidesPerView?: number;
    backgroundSize?: 'cover' | 'contain';
    navigation?: {
        showOnHover?: boolean;
    };
    showPagination?: boolean;
    showScrollbar?: boolean;
    showThumbs?: boolean | {
        width?: string;
        height?: string;
        loop?: boolean;
    };
    zoom?: {
        zoomOnHover?: boolean;
        maxRatio?: number;
    };
    components?: {
        imgWrapper?: React.ComponentType<{ image: TImageSettings }>;
    };
}

export type TBlockContentGetter = (block: TCromwellBlock) => React.ReactNode | null;