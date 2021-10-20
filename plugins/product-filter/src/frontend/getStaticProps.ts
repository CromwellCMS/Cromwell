import { gql } from '@apollo/client';
import { TAttribute, TGetStaticProps, TProductFilterMeta } from '@cromwell/core';
import { getGraphQLClient, getGraphQLErrorInfo } from '@cromwell/core-frontend';

import { TProductFilterData, getFiltered } from './service';

let getLogger: typeof import('@cromwell/core-backend')['getLogger'];

export const getStaticProps: TGetStaticProps = async (context): Promise<TProductFilterData> => {
    if (!getLogger) getLogger = require('@cromwell/core-backend/dist/helpers/logger').getLogger;

    const { pluginSettings } = context ?? {};
    const logger = getLogger();
    const slug = context?.params?.slug ?? null;
    const client = getGraphQLClient();

    const getCategory = async () => {
        if (!slug) return;
        try {
            return await client?.getProductCategoryBySlug(
                slug as string,
                gql`
                    ${client.ProductCategoryFragment}
                    fragment PCategory on ProductCategory {
                        ...ProductCategoryFragment
                        parent {
                            name
                            slug
                            id
                        }
                        children {
                          name
                          slug
                          id
                        }
                    }
                `,
                'PCategory'
            )
        } catch (error) {
            logger.error('ProductFilter::getStaticProps', error);
            logger.error(JSON.stringify(getGraphQLErrorInfo(error), null, 2));
        }
    }
    const productCategory = await getCategory();

    let attributes: TAttribute[] | undefined;
    try {
        attributes = await client?.getAttributes();
    } catch (e: any) {
        logger.error('ProductFilter::getStaticProps getAttributes', e.message)
    }

    let filterMeta: TProductFilterMeta | undefined;

    if (productCategory && productCategory.id) {
        filterMeta = (await getFiltered(client, productCategory.id, { pageSize: 1 }, {}))?.filterMeta;
    }

    return {
        slug,
        productCategory,
        attributes,
        filterMeta,
        pluginSettings,
    }
}