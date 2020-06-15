import { StaticPageContext, CromwellPageCoreProps, BasePageNames, getRestAPIClient } from "@cromwell/core";
import { modulesDataFetcher } from './modulesDataFetcher';
import { getTemplateStaticProps } from './getTemplateStaticProps';
import { resolve } from 'path';

export const createGetStaticProps = (pageName: BasePageNames | string, pageRoute: string) => {
    return async function (context: StaticPageContext): Promise<{ props: CromwellPageCoreProps }> {
        const modulesData = await modulesDataFetcher(pageName, context);
        const childStaticProps = await getTemplateStaticProps(pageName, context);
        const cromwellBlocksData = await getRestAPIClient().getUserModifications(pageName);
        if (context && context.params && context.params.slug) {
            pageRoute += '/' + context.params.slug;
        }

        console.log('createGetStaticProps', 'pageName', pageName, 'context', context, 'modulesData', modulesData, 'childStaticProps', childStaticProps, 'pageRoute', pageRoute)
        return {
            props: {
                modulesData,
                childStaticProps,
                cromwellBlocksData
            }
        }
    }
}