/// <reference types="react" />
import { NextPage } from 'next';
export declare type CromwellPageType<Props = {}> = NextPage<Props & CromwellPageCoreProps>;
export declare type CromwellPageCoreProps = {
    modulesData: Record<string, any>;
    childStaticProps: Record<string, any>;
};
export declare type PageName = keyof {
    index: any;
    product: any;
    blog: any;
};
export declare type DataComponentProps<Data> = {
    moduleName: string;
    component: React.ComponentType<Data>;
};
export declare type CMSconfigType = {
    apiPort: number;
    adminPanelPort: number;
    templatePort: number;
    templateName: string;
    defaultPageSize: number;
};
export declare type CromwellStoreType = {
    modulesData?: Record<string, any>;
    cmsconfig?: CMSconfigType;
    blocksData?: CromwellBlockDataType[];
};
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
export declare type BlockDestinationPositionType = 'before' | 'after' | 'inside';
export declare type CromwellBlockDataType = {
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
};
export declare type DBEntity = keyof {
    Post: any;
    Product: any;
    ProductCategory: any;
};
export declare type GraphQLPathsType = {
    [K in DBEntity]: GraphQLNode;
};
export declare type GraphQLNode = {
    getOneById: string;
    getOneBySlug: string;
    getAll: string;
    create: string;
    update: string;
    delete: string;
};
export declare type BasePageEntityType = {
    id: string;
    slug: string;
    pageTitle: string;
    createDate: Date;
    updateDate: Date;
    isEnabled: boolean;
};
declare type DBAuxiliaryColumns = 'id' | 'createDate' | 'updateDate';
export declare type BasePageEntityInputType = Omit<BasePageEntityType, DBAuxiliaryColumns>;
export declare type ProductCategoryType = BasePageEntityType & {
    name: string;
    mainImage: string;
    description: string;
    children: ProductCategoryType[];
    parent: ProductCategoryType;
    products: ProductType[];
};
export declare type ProductCategoryInputType = Omit<ProductCategoryType, DBAuxiliaryColumns | 'children' | 'parent' | 'products'> & {
    parentId: string;
    childIds: string[];
};
export interface ProductType extends BasePageEntityType {
    name: string;
    categories: ProductCategoryType[];
    price: string;
    oldPrice?: string | null;
    mainImage: string;
    images: string[];
    description: string;
}
export declare type ProductInputType = Omit<ProductType, DBAuxiliaryColumns | 'categories'> & {
    categoryIds: string[];
};
export interface PostType extends BasePageEntityType {
    title: string;
    authorId: string;
    mainImage: string;
    description: string;
    content: string;
}
export declare type PostInputType = Omit<ProductType, DBAuxiliaryColumns>;
export interface AuthorType extends BasePageEntityType {
    id: string;
    name: string;
}
export declare type PagedParamsType<Entity> = {
    pageNumber?: number;
    pageSize?: number;
    orderBy?: keyof Entity;
    order?: 'ASC' | 'DESC';
};
export {};
