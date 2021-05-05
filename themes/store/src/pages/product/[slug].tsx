import { TAttribute, TCromwellPage, TGetStaticProps, TProduct } from '@cromwell/core';
import { CContainer, getGraphQLClient } from '@cromwell/core-frontend';
import React from 'react';

import Layout from '../../components/layout/Layout';
import ProductDetails from '../../components/productDetails/ProductDetails';
import commonStyles from '../../styles/common.module.scss';

interface ProductProps {
    product?: TProduct | null;
    attributes?: TAttribute[];
}
const Product: TCromwellPage<ProductProps> = (props) => {
    // console.log('ProductThemePage props', props);

    return (
        <Layout>
            <div className={commonStyles.content}>
                <ProductDetails {...props} />
                <CContainer id="Product_ProductShowcase" />
            </div>
        </Layout>
    );
}

export default Product;

export const getStaticProps: TGetStaticProps = async (context): Promise<ProductProps> => {
    // console.log('context', context)
    const slug = context?.params?.slug ?? null;
    console.log('ProductThemePage::getStaticProps: pid', slug, 'context.params', context?.params)
    const client = getGraphQLClient();
    let product: TProduct | undefined = undefined;
    if (slug && typeof slug === 'string') {
        try {
            product = await client?.getProductBySlug(slug);
        } catch (e) {
            console.error('Product::getStaticProps', e)
        }
    } else {
        console.error('Product::getStaticProps: !pid')
    }


    let attributes: TAttribute[] | undefined;

    try {
        attributes = await client?.getAttributes();
    } catch (e) {
        console.error('Product::getStaticProps', e)
    }

    return {
        product,
        attributes
    }

}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: true
    };
}
