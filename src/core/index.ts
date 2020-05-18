
interface ParsedUrlQuery extends NodeJS.Dict<string | string[]> { };
export type StaticPageContext<Q extends ParsedUrlQuery = ParsedUrlQuery> = {
    params?: Q;
    preview?: boolean;
    previewData?: any;
    moduleConfig?: Object;
}
export type GetStaticPropsType<
    P extends { [key: string]: any } = { [key: string]: any },
    Q extends ParsedUrlQuery = ParsedUrlQuery> = (ctx: StaticPageContext) => Promise<P>;
export * from './src/types';
export {
    CromwellPageType, CromwellPageCoreProps, PageName, DataComponentProps,
    DBEntity, GraphQLPathsType
} from './src/types';
export { DataModule, getModulesData, setModulesData } from './src/DataModule';
// export { Store } from '../../Store';
export { graphQLClient } from './src/graphQLClient';
export { GraphQLPaths, componentsCachePath } from './src/constants';
export { default as Link } from 'next/link';

declare global {
    namespace NodeJS {
        interface Global {
            cromwellData: {
                modulesData: Object;
            }
        }
    }
}
declare global {
    interface Window {
        cromwellData: {
            modulesData: Object;
        }
    }
}