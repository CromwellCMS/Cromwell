import React, { Component } from 'react';
import { ProductType, StaticPageContext, graphQLClient, Link } from '@cromwell/core';

interface DataProps {
    products?: ProductType[];
}

const ProductShowcase = (props: DataProps) => {
    console.log('ProductShowcase props', props)

    return (
        <main style={{ backgroundColor: "#999" }}>
            <p>Showcase Time!</p>
            {
                props.products && props.products.map(p => (
                    <div id={p.id}>
                        <Link href="/product/[slug]" as={`/product/${p.id}`}><a>Name: {p.name}</a></Link>
                        <h1>Price: {p.price}</h1>
                        <h1>id: {p.id}</h1>
                    </div>
                ))
            }
        </main>
    )
}

export const getStaticProps = async (context: StaticPageContext): Promise<DataProps> => {
    let data = null;
    try {
        data = await graphQLClient.request(`
                query getProducts {
                    products {
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

    return {
        ...data
    }
}

export default ProductShowcase;
