import { NextPage } from 'next';

export type CromwellPage<Props = {}> = NextPage<Props & CromwellPageCoreProps>;

export type CromwellPageCoreProps = {
    componentsData: Object;
    childStaticProps: Object;
}

export type PageName = keyof {
    index,
    product,
    blog
}

export interface DataComponentProps<Data> {
    componetName: string;
    component: React.ComponentType<Data>;
}

export type DBEntity = keyof {
    Post,
    Product
}

export type GraphQLPathsType = { [K in DBEntity]: GraphQLNode };

export type GraphQLNode = {
    getOne: string;
    getAll: string;
    create: string;
    update: string;
    delete: string;
}

export interface ProductType {
    // DB id
    id: string;
    // Slug for page route
    slug: string;
    // Page SEO title
    pageTitle: string;
    // Name of the product (h1)
    name: string;
    // Price. Will be discount price if oldPrice is specified
    price: string;
    // Price before sale, optional
    oldPrice?: string | null;
    // Href of main image
    mainImage: string;
    // Hrefs of iamges
    images: string;
    // Description (HTML allowed)
    description: string;
    // Is displaying at frontend
    isEnabled: boolean;
}

export interface PostType {
    // DB id
    id: string;
    // Slug for page route
    slug: string;
    // Page SEO title
    pageTitle: string;
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
    // Is displaying at frontend
    isEnabled: boolean;
}

export interface AuthorType {

    id: string;

    name: string;
}