import React from 'react';
import { getGraphQLClient, CList } from '@cromwell/core-frontend';
import { TProduct, TPagedList } from '@cromwell/core';
import LoadBox from '../../components/loadBox/LoadBox';

const ProductList = () => {
    const client = getGraphQLClient();
    return (
        <div style={{ height: '500px', width: '800px' }}>
            <CList<TProduct>
                ListItem={ProductItem}
                useAutoLoading
                usePagination
                useQueryPagination
                loader={(pageNumber: number) => {
                    return client.getProducts(pageNumber);
                }}
            />
        </div>
    )
}

export default ProductList;

type TProductItemProps = {
    data?: TProduct;
    isLoading?: boolean;
}

const ProductItem = (props: TProductItemProps) => {
    // console.log('ProductItem::props', props)
    return (
        <div>
            {props.isLoading && (
                <LoadBox />
            )}
            {props.data && (
                <>
                    <p>Product</p>
                    <p>{props.data?.id + '_' + props.data?.name}</p>
                </>
            )}
        </div>
    )
}