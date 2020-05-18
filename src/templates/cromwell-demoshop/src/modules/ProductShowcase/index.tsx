import React, { Component } from 'react';
import { ProductType, StaticPageContext, graphQLClient, Link, DBEntity, GraphQLPaths } from '@cromwell/core';

interface DataProps {
    products?: ProductType[];
    children?: React.ReactNode;
}

const ProductShowcase = (props: DataProps) => {
    console.log('ProductShowcase props', props)
    return (
        <div style={{ backgroundColor: "#999" }}>
            <p>Showcase Time!</p>
            {
                props.products && props.products.map(p => (
                    <div key={p.id}>
                        <Link href="/product/[slug]" as={`/product/${p.slug}`}><a>Name: {p.name}</a></Link>
                        <h1>Price: {p.price}</h1>
                        <h1>id: {p.id}</h1>
                    </div>
                ))
            }
        </div>
    )
}

export const getStaticProps = async (context: StaticPageContext): Promise<DataProps> => {
    let data = {};
    try {
        data = await graphQLClient.request(`
            query getProducts {
                ${GraphQLPaths.Product.getAll} {
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

    return {
        ...data
    }
}

export default ProductShowcase;
