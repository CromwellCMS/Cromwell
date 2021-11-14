import { TCromwellPage, TStaticPageContext } from '@cromwell/core';

export type TPageExports = {
    default: TCromwellPage;
    getStaticProps?: ((context: TStaticPageContext) => any) | null;
    getStaticPaths?: any;
} | undefined | null;