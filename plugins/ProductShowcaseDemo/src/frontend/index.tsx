import React, { Component } from 'react';
import { TProduct, StaticPageContext, TPagedList } from '@cromwell/core';
import { getGraphQLClient, FrontendPlugin, Link } from '@cromwell/core-frontend';

interface ProductShowcaseProps {
    products?: TPagedList<TProduct>;
}

const ProductShowcaseDemo = (props: ProductShowcaseProps) => {
    return (
        <div style={{ backgroundColor: "#999" }}>
            <p>ProductShowcaseDemo::Showcase Time!</p>
            {
                (props.products && props.products.elements) && props.products.elements.map(p => (
                    <div key={p.id}>
                        <Link href="/product/[slug]"><a>Name: {p.name}</a></Link>
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
        data = await getGraphQLClient().getProducts({ pageSize: 10 })
    } catch (e) {
        console.error('ProductShowcaseDemo', e)
    }

    return {
        ...data
    }
}

export default FrontendPlugin<ProductShowcaseProps>(ProductShowcaseDemo, 'ProductShowcaseDemo');
