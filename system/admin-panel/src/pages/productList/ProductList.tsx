import React from 'react';
import InfiniteLoader from '../../components/infinityLoader/InfiniteLoader';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { TProduct, TPagedList } from '@cromwell/core';

const ProductList = () => {
    const client = getGraphQLClient();

    return (
        <div style={{ height: '500px', width: '800px' }}>
            <InfiniteLoader<TProduct>
                ListItem={ProductItem}
                loader={(pageNumber: number) => {
                    return client.getProducts(pageNumber);
                }}
            />
        </div>
    )
}

export default ProductList;

type TProductItemProps = {
    data: TProduct;
}

const ProductItem = (props: TProductItemProps) => {
    console.log('ProductItem::props', props)
    return (
        <div>
            <p>Product</p>
            <p>{props.data?.id + '_' + props.data?.name}</p>
        </div>
    )
}