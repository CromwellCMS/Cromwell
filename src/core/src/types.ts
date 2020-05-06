import { NextPage } from 'next';

export type CromwellPage<Props = {}> = NextPage<Props & {
    componentsData: any
}>;

export type PageName = keyof {
    index,
    product,
    blog
}

export interface DataComponentProps<Data> {
    componetName: string;
    component: React.ComponentType<{ data: Data }>;
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

    author: Author;

    content: string;

    isPublished: boolean;
}

export interface Author {

    id: string;

    name: string;
}