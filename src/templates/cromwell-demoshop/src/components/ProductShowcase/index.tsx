import React, { Component } from 'react';
import { useRouter } from 'next/router';
import { ProductType, StaticPageContext, graphQLClient } from '@cromwell/core';

interface DataProps {
    products?: ProductType[];
}

const ProductShowcase = (props: DataProps) => {
    const router = useRouter()
    const pid = (router && router.query) ? router.query.pid : undefined;
    console.log('ProductShowcase props', props)

    return (
        <main style={{ backgroundColor: "#999" }}>
            <p>pid: {pid}</p>
            <p>Showcase Time!</p>
            {
                props.products && props.products.map(p => (
                    <div id={p.id}>
                        <h1>Name: {p.name}</h1>
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
        products: data
    }
}

export default ProductShowcase;
