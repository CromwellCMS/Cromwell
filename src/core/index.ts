
interface ParsedUrlQuery extends NodeJS.Dict<string | string[]> { };
export type StaticPageContext<Q extends ParsedUrlQuery = ParsedUrlQuery> = {
    params?: Q
    preview?: boolean
    previewData?: any
}
export type GetStaticProps<
    P extends { [key: string]: any } = { [key: string]: any },
    Q extends ParsedUrlQuery = ParsedUrlQuery> = (ctx: StaticPageContext) => Promise<P>;
export { ProductType, PostType } from './src/types';
export {
    CromwellPage, CromwellPageCoreProps, PageName, DataComponentProps,
    DBEntity, GraphQLPathsType
} from './src/types';
export { DataComponent } from './src/DataComponent';
export { ComponentsContext } from './src/ComponentsContext';
// export { Store } from '../../Store';
export { graphQLClient } from './src/graphQLClient';
export { GraphQLPaths, componentsCachePath } from './src/constants';