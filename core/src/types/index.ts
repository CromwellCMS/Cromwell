import { NextPage } from 'next';
import { ComponentType } from 'react';
import { AxiosRequestConfig, AxiosResponse } from 'axios';


export type CromwellPageType<Props = {}> = NextPage<Props & CromwellPageCoreProps>;

export type CromwellPageCoreProps = {
    modulesData: Record<string, any>;
    childStaticProps: Record<string, any>;
    cromwellBlocksData: CromwellBlockDataType[];
}

export type PageName = keyof {
    index;
    product;
    blog;
}

export type DataComponentProps<Data> = {
    moduleName: string;
    component: React.ComponentType<Data>;
}

export type CMSconfigType = {
    apiPort: number;
    adminPanelPort: number;
    templatePort: number;
    templateName: string;
    defaultPageSize: number;
}

export type CromwellStoreType = {
    modulesData?: Record<string, any>;
    cmsconfig?: CMSconfigType;
    blocksData?: CromwellBlockDataType[];
    importModule?: (moduleName: string) => { default: ComponentType } | undefined;
    importDynamicModule?: (moduleName: string) => ComponentType | undefined;
    pageBuilder?: PageBuilderType;
}

declare global {
    namespace NodeJS {
        interface Global {
            CromwellStore: CromwellStoreType;
        }
    }
    interface Window {
        CromwellStore: CromwellStoreType;
    }
}

export type BlockDestinationPositionType = 'before' | 'after' | 'inside';

export type CromwellBlockDataType = {
    /**
     * Component's id, must be unique for the entire app.
     */
    componentId: string;
    /**
     * Id of Destination Component where this component will be displayed.
     */
    destinationComponentId?: string;
    /**
     * Position around Destination Component where this component will be displayed.
     */
    destinationPosition?: BlockDestinationPositionType;
    /**
     * If true indicates that this component was created in builder and it doesn't exist in JSX.
     * Exists only in page's config. 
     */
    isVirtual?: boolean;
    /**
     * Module's name to render inside component. Same name must be in cromwell.config.json
     */
    moduleName?: string;
    /**
     * 
     * CSS styles to apply to this module.
     */
    styles?: string;
}


export type DBEntity = keyof {
    Post;
    Product;
    ProductCategory;
}

export type GraphQLPathsType = { [K in DBEntity]: GraphQLNode };

export type GraphQLNode = {
    getOneById: string;
    getOneBySlug: string;
    getMany: string;
    create: string;
    update: string;
    delete: string;
}

export type BasePageEntityType = {
    // DB id
    id: string;
    // Slug for page route
    slug: string;
    // Page SEO title
    pageTitle: string;
    // DB createDate
    createDate: Date;
    // DB updateDate
    updateDate: Date;
    // Is displaying at frontend
    isEnabled: boolean;
}

type DBAuxiliaryColumns = 'id' | 'createDate' | 'updateDate';

export type BasePageEntityInputType = Omit<BasePageEntityType, DBAuxiliaryColumns>;

export type ProductCategoryType = BasePageEntityType & {
    // Name of the category (h1)
    name: string;
    // Href of main image
    mainImage: string;
    // Description (HTML allowed)
    description: string;
    // DB children
    children: ProductCategoryType[];
    // DB parent
    parent: ProductCategoryType;
    // Products in category
    products: ProductType[];
}

export type ProductCategoryInputType = Omit<ProductCategoryType, DBAuxiliaryColumns | 'children' | 'parent' | 'products'> & {
    parentId: string;
    childIds: string[];
};

export interface ProductType extends BasePageEntityType {
    // Name of the product (h1)
    name: string;
    // Categories of the prooduct
    categories: ProductCategoryType[];
    // Price. Will be discount price if oldPrice is specified
    price: string;
    // Price before sale, optional
    oldPrice?: string | null;
    // Href of main image
    mainImage: string;
    // Hrefs of iamges
    images: string[];
    // Description (HTML allowed)
    description: string;
}

export type ProductInputType = Omit<ProductType, DBAuxiliaryColumns | 'categories'> & {
    categoryIds: string[];
};

export interface PostType extends BasePageEntityType {
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

export type PostInputType = Omit<ProductType, DBAuxiliaryColumns>;


export interface AuthorType extends BasePageEntityType {

    id: string;

    name: string;
}

export type PagedParamsType<Entity> = {
    pageNumber?: number;
    pageSize?: number;
    orderBy?: keyof Entity;
    order?: 'ASC' | 'DESC';
}

export type RestAPIClient = {
    get: <T>(route: string, config?: AxiosRequestConfig | undefined) => Promise<AxiosResponse<T>>;
    getUserModifications: (pageName: string) => Promise<CromwellBlockDataType[]>;
}

export interface PageBuilderType {
    buildPage: (path: string) => void;
    deletePage: (path: string) => void;
}