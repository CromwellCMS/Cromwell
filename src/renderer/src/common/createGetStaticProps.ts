import { PageName, StaticPageContext } from "@cromwell/core";
import { componentDataFetcher } from './componentDataFetcher';
import { getTemplateStaticProps } from './getTemplateStaticProps';

export const createGetStaticProps = (pageName: PageName) => {
    return async function (context: StaticPageContext) {
        const componentsData = await componentDataFetcher(pageName, context);
        const childStaticProps = await getTemplateStaticProps(pageName, context);
        return {
            props: {
                componentsData,
                childStaticProps
            }
        }
    }
}