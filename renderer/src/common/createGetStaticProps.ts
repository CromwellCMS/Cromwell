import { StaticPageContext, CromwellPageCoreProps, BasePageNames, getRestAPIClient } from "@cromwell/core";
import { modulesDataFetcher } from './modulesDataFetcher';
import { getTemplateStaticProps } from './getTemplateStaticProps';
import { resolve } from 'path';

export const createGetStaticProps = (pageName: BasePageNames | string, pageRoute: string) => {
    return async function (context: StaticPageContext): Promise<{ props: CromwellPageCoreProps; unstable_revalidate: number }> {
        const modulesData = await modulesDataFetcher(pageName, context);
        const childStaticProps = await getTemplateStaticProps(pageName, context);
        const cromwellBlocksData = await getRestAPIClient().getUserModifications(pageName);
        // if (context && context.params && context.params.slug) {
        //     pageRoute += '/' + context.params.slug;
        // }
        console.log('createGetStaticProps', 'pageName', pageName, 'context', context, 'pageRoute', pageRoute)
        try {
            console.log('modulesData', modulesData.ProductShowcaseDemo.products[1], 'childStaticProps', childStaticProps);
        } catch (e) { 6 }
        return {
            props: {
                modulesData,
                childStaticProps,
                cromwellBlocksData
            },
            /* eslint-disable @typescript-eslint/camelcase */
            unstable_revalidate: 1
        }
    }
}