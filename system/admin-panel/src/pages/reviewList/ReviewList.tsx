import { getBlockInstance, TPagedParams, TProduct, TProductReview, TProductReviewFilter } from '@cromwell/core';
import { CList, getGraphQLClient, TCList } from '@cromwell/core-frontend';
import { Delete as DeleteIcon, ThumbUp as ThumbUpIcon } from '@mui/icons-material';
import { Checkbox, IconButton, MenuItem, Rating, Select, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { connect, PropsType } from 'react-redux-ts';
import { debounce } from 'throttle-debounce';

import SortBy, { TSortOption } from '../../components/entity/sort/Sort';
import { LoadingStatus } from '../../components/loadBox/LoadingStatus';
import ConfirmationModal from '../../components/modal/Confirmation';
import Modal from '../../components/modal/Modal';
import Pagination from '../../components/pagination/Pagination';
import { listPreloader } from '../../components/skeleton/SkeletonPreloader';
import { toast } from '../../components/toast/toast';
import { useForceUpdate } from '../../helpers/forceUpdate';
import {
    countSelectedItems,
    getSelectedInput,
    resetSelected,
    toggleItemSelection,
    toggleSelectAll,
} from '../../redux/helpers';
import { TAppState } from '../../redux/store';
import commonStyles from '../../styles/common.module.scss';
import ProductListItem from '../productList/ProductListItem';
import styles from './ReviewList.module.scss';
import ReviewListItem from './ReviewListItem';

export type ListItemProps = {
    handleDeleteBtnClick: (id: number) => void;
    handleOpenReview: (data: TProductReview) => void;
    toggleSelection: (data: TProductReview) => void;
    handleApproveReview: (data: TProductReview) => Promise<boolean>;
}


const mapStateToProps = (state: TAppState) => {
    return {
        allSelected: state.allSelected,
    }
}

type TPropsType = PropsType<TAppState, unknown,
    ReturnType<typeof mapStateToProps>>;


const ReviewList = (props: TPropsType) => {
    const client = getGraphQLClient();
    const listId = "Admin_ReviewList";
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const totalElements = useRef<number | null>(null);
    const [deleteSelectedOpen, setDeleteSelectedOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const filterInput = useRef<TProductReviewFilter>({});
    const [itemToView, setItemToView] = useState<TProductReview | null>(null);
    const [productToView, setProductToView] = useState<TProduct | null>(null);
    const approvedToast = useRef<number | string | null>(null);
    const orderByRef = useRef<keyof TProductReview | null>(null);
    const orderRef = useRef<'ASC' | 'DESC' | null>(null);
    const forceUpdate = useForceUpdate();

    const availableSorts: TSortOption<TProductReview>[] = [
        {
            key: 'id',
            label: 'ID'
        },
        {
            key: 'productId',
            label: 'Product ID'
        },
        {
            key: 'approved',
            label: 'Approved'
        },
        {
            key: 'rating',
            label: 'Rating'
        },
        {
            key: 'userName',
            label: 'User name'
        },
        {
            key: 'createDate',
            label: 'Created'
        },
    ];

    useEffect(() => {
        resetSelected();
        return () => {
            resetSelected();
        }
    }, []);

    const resetList = () => {
        const list = getBlockInstance<TCList>(listId)?.getContentInstance();
        list?.clearState();
        list?.init();
    }

    const updateList = () => {
        const list = getBlockInstance<TCList>(listId)?.getContentInstance();
        list?.updateData();
    }

    const handleGetReview = async (params?: TPagedParams<TProductReview>) => {
        if (!params) params = {};
        params.orderBy = orderByRef.current ?? 'id';
        params.order = orderRef.current ?? 'DESC';
        const data = await client?.getFilteredProductReviews({
            pagedParams: params,
            filterParams: filterInput.current,
        });

        if (data.pagedMeta?.totalElements) totalElements.current = data.pagedMeta?.totalElements;
        return data;
    }

    const handleDeleteBtnClick = (id: number) => {
        setItemToDelete(id);
    }

    const handleToggleItemSelection = (data: TProductReview) => {
        toggleItemSelection(data.id);
    }

    const handleToggleSelectAll = () => {
        toggleSelectAll()
    }

    const handleDeleteSelectedBtnClick = () => {
        if (countSelectedItems(totalElements.current) > 0)
            setDeleteSelectedOpen(true);
    }

    const handleDeleteSelected = async () => {
        setIsLoading(true);
        try {
            await client?.deleteManyFilteredProductReviews(getSelectedInput(), filterInput.current);
            toast.success('Reviews deleted');
        } catch (e) {
            console.error(e);
            toast.error('Failed to delete reviews');
        }
        setDeleteSelectedOpen(false);
        setIsLoading(false);
        updateList();
        resetSelected();
    }


    const handleDelete = async () => {
        if (itemToDelete) {
            try {
                await client?.deleteProductReview(itemToDelete)
                toast.success('Review deleted');
            } catch (e) {
                console.error(e);
                toast.error('Failed to delete review');
            }
        }
        setItemToDelete(null);
        updateList();
    }

    const handleFilterInput = debounce(400, () => {
        resetList();
    });

    const handleChangeApproved = (event) => {
        switch (event.target.value as string) {
            case 'all':
                filterInput.current.approved = undefined;
                break;
            case 'approved':
                filterInput.current.approved = true;
                break;
            case 'pending':
                filterInput.current.approved = false;
                break;
        }
        resetList();
    }

    const handleOpenReview = async (data: TProductReview) => {
        setItemToView(data);
        const product = await client.getProductById(data.productId);
        if (product) {
            setProductToView(product);
        }
    }

    const handleApproveReview = async (data: TProductReview): Promise<boolean> => {
        try {
            await client?.updateProductReview(data.id, {
                productId: data.productId,
                title: data.title,
                description: data.description,
                rating: data.rating,
                userName: data.userName,
                userId: data.userId,
                approved: true,
            });
            if (approvedToast.current) {
                toast.dismiss(approvedToast.current);
            }
            approvedToast.current = toast.success('Approved!');
            return true;
        } catch (e) {
            toast.error('Failed to save');
            console.error(e);
            return false;
        }
    }

    const handleChangeOrder = (key: keyof TProductReview, order: 'ASC' | 'DESC') => {
        orderByRef.current = key;
        orderRef.current = order;
        resetList();
        forceUpdate();
    }

    return (
        <div className={styles.ProductReviewList}>
            <div className={styles.listHeader}>
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
                    <Select
                        defaultValue="all"
                        variant="standard"
                        onChange={handleChangeApproved}
                    >
                        <MenuItem value={'all'}>All</MenuItem>
                        <MenuItem value={'approved'}>Approved</MenuItem>
                        <MenuItem value={'pending'}>Pending</MenuItem>
                    </Select>
                    <TextField
                        className={styles.filterItem}
                        placeholder="Customer name"
                        variant="standard"
                        onChange={(event) => {
                            filterInput.current.userName = event.target.value;
                            handleFilterInput();
                        }}
                    />
                    <TextField
                        className={styles.filterItem}
                        placeholder="Product id"
                        variant="standard"
                        onChange={(event) => {
                            filterInput.current.productId = parseInt(event.target.value);
                            if (isNaN(filterInput.current.productId)) filterInput.current.productId = undefined;
                            handleFilterInput();
                        }}
                    />
                </div>
                <div className={styles.pageActions} >
                    <SortBy<TProductReview>
                        options={availableSorts}
                        onChange={handleChangeOrder}
                    />
                    <Tooltip title="Delete selected">
                        <IconButton
                            onClick={handleDeleteSelectedBtnClick}
                            aria-label="Delete selected"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <CList<TProductReview, ListItemProps>
                className={styles.listWrapper}
                id={listId}
                ListItem={ReviewListItem}
                useAutoLoading
                usePagination
                useQueryPagination
                listItemProps={{
                    handleDeleteBtnClick,
                    toggleSelection: handleToggleItemSelection,
                    handleOpenReview,
                    handleApproveReview,
                }}
                loader={handleGetReview}
                cssClasses={{
                    scrollBox: styles.list,
                    contentWrapper: styles.listContent,
                }}
                elements={{
                    pagination: Pagination,
                    preloader: listPreloader
                }}
            />
            <ConfirmationModal
                open={Boolean(itemToDelete)}
                onClose={() => setItemToDelete(null)}
                onConfirm={handleDelete}
                title="Delete review?"
            />
            <ConfirmationModal
                open={deleteSelectedOpen}
                onClose={() => setDeleteSelectedOpen(false)}
                onConfirm={handleDeleteSelected}
                title={`Delete ${countSelectedItems(totalElements.current)} item(s)?`}
                disabled={isLoading}
            />
            <Modal
                open={!!itemToView}
                onClose={() => {
                    setItemToView(null);
                    setProductToView(null);
                }}
                blurSelector="#root"
            >
                <div className={styles.itemToView}>
                    <div className={styles.itemToViewHeader}>
                        <p className={styles.userName}>{itemToView?.userName}</p>
                        <Rating name="read-only"
                            className={styles.rating}
                            value={itemToView?.rating}
                            precision={0.5}
                            readOnly />
                    </div>
                    <h4 className={styles.title}>{itemToView?.title}</h4>
                    <p className={styles.description}>{itemToView?.description}</p>
                    {!itemToView?.approved && (
                        <Tooltip title="Approve">
                            <IconButton
                                className={styles.approveBtn}
                                aria-label="view"
                                onClick={async () => {
                                    const success = await handleApproveReview(itemToView);
                                    if (success) {
                                        itemToView.approved = true;
                                        setItemToView({ ...itemToView });
                                        updateList();
                                    }
                                }}
                            >
                                <ThumbUpIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {productToView && (
                        <div className={styles.productToView}>
                            <ProductListItem
                                embedded={true}
                                data={productToView}
                                listItemProps={{
                                    handleDeleteProductBtnClick: () => null,
                                    toggleSelection: () => null,
                                }}
                            />
                        </div>
                    )}

                </div>
            </Modal>
            <LoadingStatus isActive={isLoading} />
        </div>
    )
}

export default connect(mapStateToProps)(ReviewList);
