
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

export { CromwellBlock } from './CromwellBlock';
export * from './GlobalStore';
export * from './types';
export * from './constants';
export * from './DataModule';
export * from './apiClient';
export { default as Link } from 'next/link';