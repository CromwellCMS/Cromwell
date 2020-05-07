import React from 'react';
import { CromwellPage, ProductType, graphQLClient, GetStaticProps } from '@cromwell/core';

interface ProductProps {
    data?: {
        product: ProductType
    };
}
const Product: CromwellPage<ProductProps> = (props) => {
    console.log('ProductTemplate props', props);
    const product = props.data ? props.data.product : undefined;
    return (
        <div>ProductTemp
            {
                product && (
                    <div>
                        {product.name}
                        <p></p>
                    </div>
                )
            }
        </div>
    );
}

export const getStaticProps: GetStaticProps = async (context) => {
    const pid = (context && context.params) ? context.params.pid : null;
    console.log('pid', pid)
    let data = null;
    if (pid) {
        try {
            data = await graphQLClient.request(`
                query getproduct {
                    product(id: "${pid}") {
                        id
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
