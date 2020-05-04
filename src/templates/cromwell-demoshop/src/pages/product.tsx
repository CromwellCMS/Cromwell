import React from 'react';
import { CromwellPage, graphQLClient  } from 'cromwell-core';

interface ProductProps {
    // data: ProductType
}
const Product: CromwellPage<ProductProps> = (props) => {
    return (
        <div>
            {/* {props.data.name} */}
        </div>
    );
}

export const getStaticProps = async (context) => {
    const pid = (context && context.params) ? context.params.pid : null;
    let data;
    if (pid) {
        try {
            data = await graphQLClient.request(`
                query getproduct {
                    product(id: ${pid}) {
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