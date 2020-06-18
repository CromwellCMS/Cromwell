import React, { Component } from 'react';
import { ProductType, StaticPageContext, Link, GraphQLPaths, ProductCategoryType } from '@cromwell/core';
import { getGraphQLClient, FrontendPlugin } from '@cromwell/core-frontend';

interface ProductShowcaseProps {
    productShowcase?: ProductCategoryType;
}

const ProductShowcase = (props: ProductShowcaseProps) => {
    // console.log('ProductShowcase props', props)
    return (
        <div style={{ backgroundColor: "#999" }}>
            <p>Showcase time!</p>
            {
                props.productShowcase && props.productShowcase.products && props.productShowcase.products.map(p => (
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

export const getStaticProps = async (context: StaticPageContext): Promise<ProductShowcaseProps> => {
    let data = {};
    const limit = 20;
    try {
        data = await getGraphQLClient().request(`
        query productShowcase {
            productShowcase(slug: "1") {
                id
                name
                products(pagedParams: {pageNumber: 1, pageSize: 5}) {
                    id
                    slug
                    name
                    price
              }
            }
          }
        `);
    } catch (e) {
        console.error('ProductShowcase::getStaticProps', e)
    }

    return {
        ...data
    }
}

export default FrontendPlugin<ProductShowcaseProps>(ProductShowcase, 'ProductShowcase');
