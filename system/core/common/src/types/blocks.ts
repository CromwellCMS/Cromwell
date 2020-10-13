import { NextPage } from 'next';
import { TProduct } from './entities';
import { TPageConfig, TCmsConfig, TThemeMainConfig, TPageInfo } from './data';

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
    themeMainConfig?: TThemeMainConfig;
    themeCustomConfig?: Record<string, any>;
    pagesInfo?: TPageInfo[];
}

export type TFrontendPluginProps<TData = any, TSettings = any> = {
    data: TData;
    settings: TSettings;
}

export type TCromwellBlock = React.Component<TCromwellBlockProps> & {
    getContentInstance: () => React.Component;
    getData: () => TCromwellBlockData | undefined;
    getBlockRef: () => React.RefObject<HTMLDivElement>;
}

export type TDataComponentProps<Data> = {
    pluginName: string;
    component: React.ComponentType<Data>;
}


export type TCromwellBlockProps = {
    id: string;
    type?: TCromwellBlockType;
    className?: string;
    content?: (data: TCromwellBlockData | undefined,
        blockRef: React.RefObject<HTMLDivElement>,
        setContentInstance: (inst: React.Component) => void
    ) => React.ReactNode;
}

export type TContentComponentProps = {
    id: string;
    config?: TCromwellBlockData;
    children?: React.ReactNode;
}

export type TCommonComponentProps = {
    data: TProduct;
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
        /** Plugin's name to render inside component. Same name must be in cromwell.config.js */
        pluginName?: string;

        /** Custom editable plugin's config */
        pluginConfig?: Record<string, any>;
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
}

type TImageSettings = {
    src: string;
    id?: string | number;
    href?: string;
    thumb?: string;
};

export type TPluginConfig = {
    name: string;
    adminDir?: string;
    frontendDir?: string;
    backend?: {
        resolversDir?: string;
        entitiesDir?: string;
    };
}

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