import React, { Component } from 'react';
import { ProductType, StaticPageContext, Link, DBEntity, GraphQLPaths } from '@cromwell/core';
import { getGraphQLClient, FrontendPlugin } from '@cromwell/core-frontend';

interface ProductShowcaseProps {
    products?: ProductType[];
}

const ProductShowcaseDemo = (props: ProductShowcaseProps) => {
    return (
        <div style={{ backgroundColor: "#999" }}>
            <p>ProductShowcaseDemo::Showcase Time!</p>
            {
                props.products && props.products.map(p => (
                    <div key={p.id}>
                        <Link href="/product/[slug]" as={`/product/${p.slug}`}><a>Name: {p.name}</a></Link>
                        <p>Price: {p.price}</p>
                        <h1>id: {p.id}</h1>
                    </div>
                ))
            }
        </div>
    )
}

export const getStaticProps = async (context: StaticPageContext): Promise<ProductShowcaseProps> => {
    let data = {};
    const limit = 20;
    try {
        data = await getGraphQLClient().request(`
            query getProducts {
                ${GraphQLPaths.Product.getMany}(pagedParams: {pageNumber: 1, pageSize: ${limit}}) {
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
        console.error('ProductShowcaseDemo', e)
    }

    return {
        ...data
    }
}

export default FrontendPlugin<ProductShowcaseProps>(ProductShowcaseDemo, 'ProductShowcaseDemo');
