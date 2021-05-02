import { getBlockInstance, TPagedParams, TProduct, TProductReview, TProductReviewFilter } from '@cromwell/core';
import { CList, getGraphQLClient, TCList } from '@cromwell/core-frontend';
import { Checkbox, IconButton, MenuItem, Select, TextField, Tooltip } from '@material-ui/core';
import { Delete as DeleteIcon, ThumbUp as ThumbUpIcon } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
import React, { useEffect, useRef, useState } from 'react';
import { connect, PropsType } from 'react-redux-ts';
import { debounce } from 'throttle-debounce';

import { LoadingStatus } from '../../components/loadBox/LoadingStatus';
import ConfirmationModal from '../../components/modal/Confirmation';
import Modal from '../../components/modal/Modal';
import Pagination from '../../components/pagination/Pagination';
import { listPreloader } from '../../components/SkeletonPreloader';
import { toast } from '../../components/toast/toast';
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
    handleDeleteBtnClick: (id: string) => void;
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
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const totalElements = useRef<number | null>(null);
    const [deleteSelectedOpen, setDeleteSelectedOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const filterInput = useRef<TProductReviewFilter>({});
    const [itemToView, setItemToView] = useState<TProductReview | null>(null);
    const [productToView, setProductToView] = useState<TProduct | null>(null);
    const approvedToast = useRef<number | string | null>(null);

    useEffect(() => {
        resetSelected();
        return () => {
            resetSelected();
        }
    }, []);

    const resetList = () => {
        const list: TCList | undefined = getBlockInstance(listId)?.getContentInstance() as any;
        list?.clearState();
        list?.init();
    }

    const handleGetReview = async (params?: TPagedParams<TProductReview>) => {
        if (!params) params = {};
        params.orderBy = 'createDate';
        params.order = 'DESC';
        const data = await client?.getFilteredProductReviews({
            pagedParams: params,
            filterParams: filterInput.current,
        });

        if (data.pagedMeta?.totalElements) totalElements.current = data.pagedMeta?.totalElements;
        return data;
    }

    const handleDeleteBtnClick = (id: string) => {
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
        resetList();
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
        resetList();
    }

    const handleFilterInput = debounce(1000, () => {
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
                        onChange={handleChangeApproved}
                    >
                        <MenuItem value={'all'}>All</MenuItem>
                        <MenuItem value={'approved'}>Approved</MenuItem>
                        <MenuItem value={'pending'}>Pending</MenuItem>
                    </Select>
                    <TextField
                        className={styles.filterItem}
                        placeholder="Customer name"
                        onChange={(event) => {
                            filterInput.current.userName = event.target.value;
                            handleFilterInput();
                        }}
                    />
                    <TextField
                        className={styles.filterItem}
                        placeholder="Product id"
                        onChange={(event) => {
                            filterInput.current.productId = event.target.value;
                            handleFilterInput();
                        }}
                    />
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
                cssClasses={{ scrollBox: styles.list }}
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
                        <Rating name="read-only" value={itemToView?.rating} precision={0.5} readOnly />
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
                                        resetList();
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
