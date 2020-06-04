import { NextPage } from 'next';

export type CromwellPageType<Props = {}> = NextPage<Props & CromwellPageCoreProps>;

export type CromwellPageCoreProps = {
    modulesData: Record<string, any>;
    childStaticProps: Record<string, any>;
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

export type CromwellBlockDataType = {
    componentId: string;
    destinationComponentId?: string;
    destinationPosition?: 'before' | 'after' | 'inside';
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
    getAll: string;
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