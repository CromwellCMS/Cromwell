import { StaticPageContext, CromwellPageCoreProps, BasePageNames, getRestAPIClient } from "@cromwell/core";
import { modulesDataFetcher } from './modulesDataFetcher';
import { getTemplateStaticProps } from './getTemplateStaticProps';
import { resolve } from 'path';

export const createGetStaticProps = (pageName: BasePageNames | string, pageRoute: string) => {
    return async function (context: StaticPageContext): Promise<
        { props: CromwellPageCoreProps; unstable_revalidate: number | undefined }> {
        const modulesData = await modulesDataFetcher(pageName, context);
        const childStaticProps = await getTemplateStaticProps(pageName, context);
        const cromwellBlocksData = await getRestAPIClient().getTemplateModifications(pageName);
        // if (context && context.params && context.params.slug) {
        //     pageRoute += '/' + context.params.slug;
        // }
        console.log('createGetStaticProps', 'pageName', pageName, 'context', context, 'pageRoute', pageRoute)
        // console.log('modulesData', modulesData, 'childStaticProps', childStaticProps);
        return {
            props: {
                modulesData,
                childStaticProps,
                cromwellBlocksData
            },
            /* eslint-disable @typescript-eslint/camelcase */
            unstable_revalidate: process.env.isProd ? 1 : undefined
        }
    }
}