import { TGetStaticProps, TProductCategory } from '@cromwell/core';
import { FrontendPlugin, getGraphQLClient } from '@cromwell/core-frontend';
import React, { Component, useEffect, useState } from 'react';

import { useStyles } from './styles';


//@ts-ignore
interface ProductFilterProps {
    data?: TProductCategory;
    slug?: string;
}

const ProductFilter = (props: ProductFilterProps) => {
    const classes = useStyles();

    return (
        <div>Filter</div>
    )
}

export const getStaticProps: TGetStaticProps = async (context) => {
    // console.log('context', context)
    const slug = (context && context.params) ? context.params.slug : null;
    console.log('CategoryThemePage::getStaticProps: slug', slug, 'context.params', context.params)
    let data: TProductCategory | undefined = undefined;
    if (slug && typeof slug === 'string') {
        try {
            data = await getGraphQLClient()?.
                getProductCategoryBySlug(slug, { pageSize: 20 });
        } catch (e) {
            console.error('Product::getStaticProps', e)
        }
    } else {
        console.error('Product::getStaticProps: !pid')
    }

    return {
        slug,
        data
    }

}
export default FrontendPlugin<ProductFilterProps>(ProductFilter, 'ProductFilter');
