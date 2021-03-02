import { gql } from '@apollo/client';
import { getBlockInstance, TPagedParams, TProduct, TProductFilter } from '@cromwell/core';
import { CList, getGraphQLClient, TCList } from '@cromwell/core-frontend';
import { IconButton, TextField, Tooltip } from '@material-ui/core';
import { AddCircle as AddCircleIcon } from '@material-ui/icons';
import { Pagination } from '@material-ui/lab';
import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { debounce } from 'throttle-debounce';

import ConfirmationModal from '../../components/modal/Confirmation';
import { toast } from '../../components/toast/toast';
import { listPreloader } from '../../components/SkeletonPreloader';
import { productPageInfo } from '../../constants/PageInfos';
import styles from './ProductList.module.scss';
import { ProductListItem } from './ProductListItem';

export type ListItemProps = {
    handleDeleteProductBtnClick: (product: TProduct) => void;
}



const ProductList = () => {
    const client = getGraphQLClient();
    const titleSearchId = "product-filter-search";
    const filterInput = useRef<TProductFilter>({});
    const listId = "Admin_ProductsList";
    const history = useHistory();
    const [productToDelete, setProductToDelete] = useState<TProduct | null>(null);

    const handleGetProducts = async (params: TPagedParams<TProduct>) => {
        return client?.getFilteredProducts({
            pagedParams: params,
            customFragment: gql`
                fragment ProductListFragment on Product {
                    id
                    slug
                    pageTitle
                    name
                    price
                    oldPrice
                    mainImage
                }
            `,
            customFragmentName: 'ProductListFragment',
            filterParams: filterInput.current,
        });
    }

    const handleFilterInput = debounce(1000, () => {
        filterInput.current.nameSearch = (document.getElementById(titleSearchId) as HTMLInputElement)?.value ?? undefined;

        const list: TCList | undefined = getBlockInstance(listId)?.getContentInstance() as any;
        list.clearState();
        list.init();
    });


    const handleDeleteProductBtnClick = (product: TProduct) => {
        setProductToDelete(product);
    }

    const handleDeleteProduct = async () => {
        if (productToDelete?.id) {
            try {
                await client?.deleteProduct(productToDelete.id)
                toast.success('Product deleted');
            } catch (e) {
                console.error(e);
                toast.success('Failed to delete product');
            }
        }
        setProductToDelete(null);

        const list: TCList | undefined = getBlockInstance(listId)?.getContentInstance() as any;
        list.clearState();
        list.init();
    }

    const handleCreateProduct = () => {
        history.push(`${productPageInfo.baseRoute}/new`);
    }





    return (
        <div className={styles.ProductList}>
            <div className={styles.listHeader}>
                <div className={styles.filter}>
                    <TextField
                        className={styles.filterItem}
                        id={titleSearchId}
                        placeholder="Search by title"
                        onChange={handleFilterInput}
                    />
                </div>
                <div className={styles.pageActions} >
                    <Tooltip title="Create new product">
                        <IconButton
                            onClick={handleCreateProduct}
                            aria-label="create product"
                        >
                            <AddCircleIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <CList<TProduct>
                className={styles.listWrapper}
                id={listId}
                ListItem={ProductListItem}
                useAutoLoading
                usePagination
                listItemProps={{ handleDeleteProductBtnClick }}
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
                    preloader: listPreloader
                }}
            />
            <ConfirmationModal
                open={Boolean(productToDelete)}
                onClose={() => setProductToDelete(null)}
                onConfirm={handleDeleteProduct}
                title={`Delete product ${productToDelete?.name ?? ''}?`}
            />
        </div>
    )
}

export default ProductList;
