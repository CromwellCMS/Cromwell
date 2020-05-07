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

    id: string;

    pageTitle: string;

    name: string;

    price: string;

    mainImage: string;

    isPublished: boolean;
}

export interface PostType {
    id: string;

    title: string;

    authorId: string;

    author: AuthorType;

    content: string;

    isPublished: boolean;
}

export interface AuthorType {

    id: string;

    name: string;
}