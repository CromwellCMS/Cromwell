import React, { Component } from 'react';
import { StaticPageContext, ProductCategoryType } from '@cromwell/core';
import { getGraphQLClient, FrontendPlugin, Link } from '@cromwell/core-frontend';
import { ProductShowcaseReviewsType } from '../backend/entities/ProductShowcaseReviews';

interface ProductShowcaseProps {
    productShowcase?: ProductCategoryType;
    productShowcaseReviews?: ProductShowcaseReviewsType[];
}

const ProductShowcase = (props: ProductShowcaseProps) => {
    // console.log('ProductShowcase props', props)
    return (
        <div style={{ backgroundColor: "#999" }}>
            <p>ProductShowcase Reviews</p>
            {
                props.productShowcaseReviews && props.productShowcaseReviews.map(review => {
                    return (
                        <div key={review.id}>
                            <p>Title: {review.title}</p>
                            <p>text: {review.text}</p>
                        </div>
                    )
                })
            }
            <p>Showcase time!</p>
            {
                props.productShowcase && props.productShowcase.products && props.productShowcase.products.map(p => (
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
        const products = await getGraphQLClient().request(`
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
        const reviews = await getGraphQLClient().request(`
        query productShowcaseReviews {
            productShowcaseReviews {
                id,
                title,
                text,
                rating
            }
        }
        `);
        data = {
            productShowcase: products.productShowcase,
            productShowcaseReviews: reviews.productShowcaseReviews
        }
    } catch (e) {
        console.error('ProductShowcase::getStaticProps', e)
    }

    return {
        ...data
    }
}

export default FrontendPlugin<ProductShowcaseProps>(ProductShowcase, 'ProductShowcase');
