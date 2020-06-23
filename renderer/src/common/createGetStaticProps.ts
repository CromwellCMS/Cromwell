import { StaticPageContext, CromwellPageCoreProps, BasePageNames } from "@cromwell/core";
import { getRestAPIClient } from '@cromwell/core-frontend';
import { pluginsDataFetcher } from './pluginsDataFetcher';
import { getThemeStaticProps } from './getThemeStaticProps';
import { resolve } from 'path';

export const createGetStaticProps = (pageName: BasePageNames | string) => {
    return async function (context: StaticPageContext): Promise<
        { props: CromwellPageCoreProps; unstable_revalidate: number | undefined }> {
        const pluginsData = await pluginsDataFetcher(pageName, context);
        const childStaticProps = await getThemeStaticProps(pageName, context);
        const cromwellBlocksData = await getRestAPIClient().getThemeModifications(pageName);
        // if (context && context.params && context.params.slug) {
        //     pageRoute += '/' + context.params.slug;
        // }
        console.log('createGetStaticProps', 'pageName', pageName, 'context', context)
        // console.log('pluginssData', pluginsData, 'childStaticProps', childStaticProps);
        return {
            props: {
                pluginsData,
                childStaticProps,
                cromwellBlocksData
            },
            /* eslint-disable @typescript-eslint/camelcase */
            unstable_revalidate: process.env.isProd ? 1 : undefined
        }
    }
}