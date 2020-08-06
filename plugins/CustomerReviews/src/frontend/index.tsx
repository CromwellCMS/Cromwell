import React, { Component } from 'react';
import { StaticPageContext, TProductCategory } from '@cromwell/core';
import { getGraphQLClient, FrontendPlugin, Link } from '@cromwell/core-frontend';
import { ProductShowcaseReviewsType } from '../backend/entities/ProductShowcaseReviews';
import { useStyles } from './styles';
import { gql } from '@apollo/client';

interface ProductShowcaseProps {
    productShowcase?: TProductCategory;
    productShowcaseReviews?: ProductShowcaseReviewsType[];
}

const ProductShowcase = (props: ProductShowcaseProps) => {
    const classes = useStyles();
    // console.log('ProductShowcase props', props)
    return (
        <div className={classes.wrapper}>
            <h3>Featured items</h3>
            <div className={classes.list}>

            </div>
            {
                props.productShowcaseReviews && props.productShowcaseReviews.map(review => {
                    return (
                        <div key={review.id} className={classes.listItem}>
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
        const products = await getGraphQLClient().query({
            query: gql`
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
            `
        });

        const reviews = await getGraphQLClient().query({
            query: gql`
                 query productShowcaseReviews {
                    productShowcaseReviews {
                        id,
                        title,
                        text,
                        rating
                    }
                }
            `
        });

        data = {
            productShowcase: products?.data?.productShowcase,
            productShowcaseReviews: reviews?.data?.productShowcaseReviews
        }
    } catch (e) {
        console.error('ProductShowcase::getStaticProps', e)
    }

    return {
        ...data
    }
}

export default FrontendPlugin<ProductShowcaseProps>(ProductShowcase, 'ProductShowcase');
