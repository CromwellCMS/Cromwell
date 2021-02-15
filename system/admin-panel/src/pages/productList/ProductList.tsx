import { gql } from '@apollo/client';
import { TPagedParams, TProduct } from '@cromwell/core';
import { CList, getGraphQLClient } from '@cromwell/core-frontend';
import { IconButton } from '@material-ui/core';
import { AddCircle as AddCircleIcon } from '@material-ui/icons';
import { Pagination } from '@material-ui/lab';
import React from 'react';

import LoadBox from '../../components/loadBox/LoadBox';
import styles from './ProductList.module.scss';
import { ProductListItem } from './ProductListItem';


const ProductList = () => {
    const client = getGraphQLClient();

    const handleGetProducts = async (params: TPagedParams<TProduct>) => {
        return client?.getProducts(params, gql`
            fragment ProductListFragment on Product {
                id
                slug
                pageTitle
                name
                price
                oldPrice
                mainImage
            }
        `, 'ProductListFragment');
    }

    return (
        <div className={styles.ProductList}>
            <div className={styles.listHeader}>
                <div style={{ width: '10%' }}>
                    <p>id</p>
                </div>
                <div style={{ width: '100%' }}>
                    <p>title</p>
                </div>
                <div style={{ width: '10%' }}>
                    <IconButton
                        aria-label="add"
                    >
                        <AddCircleIcon />
                    </IconButton>
                </div>
            </div>
            <CList<TProduct>
                className={styles.listWrapper}
                id="Admin_ProductsList"
                ListItem={ProductListItem}
                useAutoLoading
                usePagination
                useQueryPagination
                loader={handleGetProducts}
                cssClasses={{ scrollBox: styles.list }}
                elements={{
                    pagination: (props) => {
                        return (
                            <div className={styles.paginationContainer}>
                                <Pagination count={props.count} page={props.page}
                                    onChange={(event: React.ChangeEvent<unknown>, value: number) => {
                                        props.onChange(value)
                                    }}
                                    className={styles.pagination}
                                    showFirstButton showLastButton
                                />
                            </div>
                        )
                    },
                    preloader: <LoadBox />
                }}
            />
        </div>
    )
}

export default ProductList;
