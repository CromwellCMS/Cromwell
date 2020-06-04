
type ParsedUrlQuery = NodeJS.Dict<string | string[]>;
export type StaticPageContext<Q extends ParsedUrlQuery = ParsedUrlQuery> = {
    params?: Q;
    preview?: boolean;
    previewData?: any;
    moduleConfig?: Record<string, any>;
}
export type GetStaticPropsType<
    P extends { [key: string]: any } = { [key: string]: any },
    Q extends ParsedUrlQuery = ParsedUrlQuery> = (ctx: StaticPageContext) => Promise<P>;
export * from './src/types';
export * from './src/constants';
export * from './src/DataModule';
export * from './src/CromwellBlock';
export * from './src/GraphQLClient';
export * from './src/GlobalStore';
export { default as Link } from 'next/link';