import { PageName, StaticPageContext, CromwellPageCoreProps } from "@cromwell/core";
import { modulesDataFetcher } from './modulesDataFetcher';
import { getTemplateStaticProps } from './getTemplateStaticProps';

export const createGetStaticProps = (pageName: PageName) => {
    return async function (context: StaticPageContext): Promise<{ props: CromwellPageCoreProps }> {
        const modulesData = await modulesDataFetcher(pageName, context);
        const childStaticProps = await getTemplateStaticProps(pageName, context);
        // console.log('createGetStaticProps', 'pageName', pageName, context, 'modulesData', modulesData, 'childStaticProps', childStaticProps)
        return {
            props: {
                modulesData,
                childStaticProps
            }
        }
    }
}