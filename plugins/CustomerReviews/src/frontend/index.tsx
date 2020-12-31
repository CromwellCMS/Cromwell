import React, { Component } from 'react';
import { StaticPageContext, TProductCategory, TFrontendPluginProps } from '@cromwell/core';
import { getGraphQLClient, Link } from '@cromwell/core-frontend';
import { ProductShowcaseReviewsType } from '../backend/entities/ProductShowcaseReviews';
import { useStyles } from './styles';
import { gql } from '@apollo/client';

interface CustomerReviewsProps {
    productShowcase?: TProductCategory;
    productShowcaseReviews?: ProductShowcaseReviewsType[];
}

const CustomerReviews = (props: TFrontendPluginProps<CustomerReviewsProps>): JSX.Element => {
    const classes = useStyles();
    const { productShowcase, productShowcaseReviews } = props.data ?? {};
    // console.log('ProductShowcase props', props)
    return (
        <div className={classes.wrapper}>
            <h3>Featured items</h3>
            <div className={classes.list}>

            </div>
            {
                productShowcaseReviews && productShowcaseReviews.map(review => {
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
                productShowcase && productShowcase.products && productShowcase.products.elements &&
                productShowcase.products.elements.map(p => (
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

export const getStaticProps = async (context: StaticPageContext): Promise<CustomerReviewsProps> => {
    let data = {};
    const limit = 20;
    try {
        const products = await getGraphQLClient()?.query({
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

        const reviews = await getGraphQLClient()?.query({
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
        console.error('CustomerReviews::getStaticProps', e)
    }

    return {
        ...data
    }
}

export default CustomerReviews;
