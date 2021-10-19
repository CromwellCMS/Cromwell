import { gql } from '@apollo/client';
import {
    getBlockInstance,
    getStoreItem,
    setStoreItem,
    TFilteredProductList,
    TPagedParams,
    TProduct,
    TProductFilter,
} from '@cromwell/core';
import { CList, CPlugin, getGraphQLClient, TCList } from '@cromwell/core-frontend';
// import { IFrontendFilter, TInstanceSettings } from '@cromwell/plugin-product-filter/build/types/types';
import { Checkbox, Drawer, IconButton, Tooltip } from '@mui/material';
import {
    AddCircle as AddCircleIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
    FilterList as FilterListIcon,
} from '@mui/icons-material';
import React, { useEffect, useRef, useState } from 'react';
import { connect, PropsType } from 'react-redux-ts';
import { useHistory } from 'react-router-dom';

import { LoadingStatus } from '../../components/loadBox/LoadingStatus';
import ConfirmationModal from '../../components/modal/Confirmation';
import Pagination from '../../components/pagination/Pagination';
import { listPreloader } from '../../components/skeleton/SkeletonPreloader';
import { toast } from '../../components/toast/toast';
import { productPageInfo } from '../../constants/PageInfos';
import {
    countSelectedItems,
    getSelectedInput,
    resetSelected,
    toggleItemSelection,
    toggleSelectAll,
} from '../../redux/helpers';
import { TAppState } from '../../redux/store';
import commonStyles from '../../styles/common.module.scss';
import styles from './ProductList.module.scss';
import ProductListItem from './ProductListItem';

export type ListItemProps = {
    handleDeleteProductBtnClick: (product: TProduct) => void;
    toggleSelection: (data: TProduct) => void;
}

const mapStateToProps = (state: TAppState) => {
    return {
        allSelected: state.allSelected,
    }
}

type TPropsType = PropsType<TAppState, Record<string, unknown>,
    ReturnType<typeof mapStateToProps>>;

const ProductList = (props: TPropsType) => {
    const client = getGraphQLClient();
    const filterInput = useRef<TProductFilter>({});
    const listId = "Admin_ProductsList";
    const history = useHistory();
    const [productToDelete, setProductToDelete] = useState<TProduct | null>(null);
    const [deleteSelectedOpen, setDeleteSelectedOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const totalElements = useRef<number | null>(null);
    const filterPluginName = '@cromwell/plugin-product-filter';
    const [showFilter, setShowFilter] = useState(false);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const filterInstRef = useRef</*IFrontendFilter*/ any | null>(null);
    const productsRef = useRef<TFilteredProductList | null>(null);

    useEffect(() => {
        resetSelected();
        init();

        return () => {
            resetSelected();
        }
    }, []);

    const init = async () => {
        const attributes = await client?.getAttributes();
        const plugins = getStoreItem('plugins') ?? {};
        if (!plugins[filterPluginName]) plugins[filterPluginName] = {};
        plugins[filterPluginName].data = {
            ...(plugins[filterPluginName]?.data ?? {}),
            attributes: attributes,
        }
        setStoreItem('plugins', plugins);
    }

    const onFilterChange = (params: TProductFilter) => {
        Object.keys(params).forEach(key => {
            filterInput.current[key] = params[key];
        });
        resetList();
    }

    const onFilterMount = () => {
        filterInstRef.current?.updateFilterMeta(productsRef.current);
    }

    const handleGetProducts = async (params: TPagedParams<TProduct>) => {
        const products = await client?.getFilteredProducts({
            pagedParams: {
                ...params,
                orderBy: 'createDate',
                order: 'DESC',
            },
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
        productsRef.current = products;
        filterInstRef.current?.updateFilterMeta(products);

        if (products?.pagedMeta?.totalElements) {
            totalElements.current = products.pagedMeta?.totalElements;
        }

        const plugins = getStoreItem('plugins') ?? {};
        if (!plugins[filterPluginName]) plugins[filterPluginName] = {};
        plugins[filterPluginName].data = {
            ...(plugins[filterPluginName]?.data ?? {}),
            filterMeta: products.filterMeta,
        }
        setStoreItem('plugins', plugins);

        return products;
    }

    const resetList = () => {
        const list = getBlockInstance<TCList>(listId)?.getContentInstance();
        totalElements.current = null;
        list?.clearState();
        list?.init();
    }

    const updateList = () => {
        totalElements.current = null;
        const list = getBlockInstance<TCList>(listId)?.getContentInstance();
        list?.updateData();
    }

    const handleDeleteProductBtnClick = (product: TProduct) => {
        setProductToDelete(product);
    }

    const handleDeleteProduct = async () => {
        setIsLoading(true);
        if (productToDelete?.id) {
            try {
                await client?.deleteProduct(productToDelete.id)
                toast.success('Product deleted');
            } catch (e) {
                console.error(e);
                toast.error('Failed to delete product');
            }
        }
        setIsLoading(false);
        setProductToDelete(null);
        updateList();
    }

    const handleCreateProduct = () => {
        history.push(`${productPageInfo.baseRoute}/new`);
    }

    const handleToggleItemSelection = (data: TProduct) => {
        toggleItemSelection(data.id);
    }

    const handleToggleSelectAll = () => {
        toggleSelectAll();
    }

    const handleDeleteSelectedBtnClick = () => {
        if (countSelectedItems(totalElements.current) > 0)
            setDeleteSelectedOpen(true);
    }

    const handleDeleteSelected = async () => {
        setIsLoading(true);
        try {
            await client?.deleteManyFilteredProducts(getSelectedInput(), filterInput.current);
            toast.success('Products deleted');
        } catch (e) {
            console.error(e);
            toast.error('Failed to delete products');
        }
        setDeleteSelectedOpen(false);
        setIsLoading(false);
        updateList();
        resetSelected();
    }

    const handleToggleFilter = () => {
        setShowFilter(prev => !prev)
    }

    return (
        <div className={styles.ProductList}>
            <div className={styles.listHeader} ref={headerRef}>
                <div className={styles.filter}>
                    <div className={commonStyles.center}>
                        <Tooltip title="Select all">
                            <Checkbox
                                style={{ marginRight: '10px' }}
                                checked={props.allSelected ?? false}
                                onChange={handleToggleSelectAll}
                            />
                        </Tooltip>
                    </div>
                    <Tooltip title="Show filter">
                        <IconButton
                            onClick={handleToggleFilter}
                            aria-label="show filter"
                        >
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <div className={styles.pageActions} >
                    <Tooltip title="Delete selected">
                        <IconButton
                            onClick={handleDeleteSelectedBtnClick}
                            aria-label="Delete selected"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
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
            <CList<TProduct, ListItemProps>
                className={styles.listWrapper}
                id={listId}
                ListItem={ProductListItem}
                useAutoLoading
                usePagination
                listItemProps={{ handleDeleteProductBtnClick, toggleSelection: handleToggleItemSelection }}
                useQueryPagination
                loader={handleGetProducts}
                cssClasses={{
                    scrollBox: styles.list,
                    contentWrapper: styles.listContent,
                }}
                elements={{
                    pagination: Pagination,
                    preloader: listPreloader
                }}
            />
            <Drawer
                classes={{ paper: styles.filterDrawer }}
                variant="persistent"
                anchor={'left'}
                open={showFilter}
                onClose={() => setShowFilter(false)}>
                <div className={styles.filterHeader}>
                    <h3>Filter</h3>
                    <Tooltip title="Close">
                        <IconButton
                            onClick={handleToggleFilter}
                            aria-label="close filter"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <CPlugin
                    plugin={{
                        instanceSettings: {
                            disableMobile: true,
                            onChange: onFilterChange,
                            getInstance: (inst) => { filterInstRef.current = inst },
                            onMount: onFilterMount,
                        } // as TInstanceSettings
                    }}
                    adminPanel={false}
                    pluginName={filterPluginName}
                    id="product-filter-plugin"
                />
            </Drawer>
            <ConfirmationModal
                open={Boolean(productToDelete)}
                onClose={() => setProductToDelete(null)}
                onConfirm={handleDeleteProduct}
                title={`Delete product ${productToDelete?.name ?? ''}?`}
                disabled={isLoading}
            />
            <ConfirmationModal
                open={deleteSelectedOpen}
                onClose={() => setDeleteSelectedOpen(false)}
                onConfirm={handleDeleteSelected}
                title={`Delete ${countSelectedItems(totalElements.current)} item(s)?`}
                disabled={isLoading}
            />
            <LoadingStatus isActive={isLoading} />
        </div>
    )
}

export default connect(mapStateToProps)(ProductList);
