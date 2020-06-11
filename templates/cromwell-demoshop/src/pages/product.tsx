import React from 'react';
import { CromwellPageType, ProductType, getGraphQLClient, GetStaticPropsType, Link, GraphQLPaths, CromwellBlock } from '@cromwell/core';

interface ProductProps {
    data?: {
        product: ProductType;
    };
}
const Product: CromwellPageType<ProductProps> = (props) => {
    console.log('ProductTemplate props', props);
    const product = props.data ? props.data.product : undefined;
    return (
        <div>ProductTemp
            <Link href='/'><a>HOME</a></Link>
            {
                product && (
                    <div>
                        {product.name}
                        <p></p>
                        <CromwellBlock id="3" />
                    </div>
                )
            }
        </div>
    );
}

export const getStaticProps: GetStaticPropsType = async (context) => {
    console.log('context', context)
    const slug = (context && context.params) ? context.params.slug : null;
    console.log('pid', slug, 'context.params', context.params)
    let data = null;
    if (slug) {
        try {
            data = await getGraphQLClient().request(`
                query getproduct {
                    ${GraphQLPaths.Product.getOneBySlug}(slug: "${slug}") {
                        id
                        slug
                        name
                        pageTitle
                        price
                        mainImage
                    }
                }
            `);
        } catch (e) {
            console.error(e)
        }
    } else {
        console.error('Product::getStaticProps: !pid')
    }

    return {
        data
    }

}

export default Product;
