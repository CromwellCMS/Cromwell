
interface ParsedUrlQuery extends NodeJS.Dict<string | string[]> { };
export type GetStaticProps<
    P extends { [key: string]: any } = { [key: string]: any },
    Q extends ParsedUrlQuery = ParsedUrlQuery
    > = (ctx: {
        params?: Q
        preview?: boolean
        previewData?: any
    }) => Promise<P>;
export { ProductType, PostType } from './src/types';
export { CromwellPage, PageName, DataComponentProps } from './src/types';
export { DataComponent } from './src/DataComponent';
export { graphQLClient } from './src/graphQLClient';