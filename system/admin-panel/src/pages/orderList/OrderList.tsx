import { getBlockInstance, TOrder, TOrderFilter, TPagedParams } from '@cromwell/core';
import { CList, getGraphQLClient, TCList } from '@cromwell/core-frontend';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Autocomplete, Checkbox, IconButton, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { connect, PropsType } from 'react-redux-ts';
import { debounce } from 'throttle-debounce';

import SortBy, { TSortOption } from '../../components/entity/sort/Sort';
import { LoadingStatus } from '../../components/loadBox/LoadingStatus';
import ConfirmationModal from '../../components/modal/Confirmation';
import Pagination from '../../components/pagination/Pagination';
import { listPreloader } from '../../components/skeleton/SkeletonPreloader';
import { toast } from '../../components/toast/toast';
import { orderStatuses } from '../../constants/order';
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
import styles from './OrderList.module.scss';
import OrderListItem from './OrderListItem';

export type ListItemProps = {
    handleDeleteBtnClick: (id: number) => void;
    toggleSelection: (data: TOrder) => void;
}


const mapStateToProps = (state: TAppState) => {
    return {
        allSelected: state.allSelected,
    }
}

type TPropsType = PropsType<TAppState, unknown,
    ReturnType<typeof mapStateToProps>>;


const OrderList = (props: TPropsType) => {
    const client = getGraphQLClient();
    const listId = "Admin_OrderList";
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const totalElements = useRef<number | null>(null);
    const [deleteSelectedOpen, setDeleteSelectedOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const filterInput = useRef<TOrderFilter>({});
    const orderByRef = useRef<keyof TOrder | null>(null);
    const orderRef = useRef<'ASC' | 'DESC' | null>(null);
    const forceUpdate = useForceUpdate();

    const availableSorts: TSortOption<TOrder>[] = [
        {
            key: 'id',
            label: 'ID'
        },
        {
            key: 'createDate',
            label: 'Created'
        },
        {
            key: 'orderTotalPrice',
            label: 'Total price'
        },
        {
            key: 'status',
            label: 'Status',
        },
        {
            key: 'customerName',
            label: 'Name',
        },
    ]

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

    const handleGetOrders = async (params?: TPagedParams<TOrder>) => {
        if (!params) params = {};
        params.orderBy = orderByRef.current ?? 'id';
        params.order = orderRef.current ?? 'DESC';
        const data = await client?.getFilteredOrders({
            pagedParams: params,
            filterParams: filterInput.current,
        });

        if (data.pagedMeta?.totalElements) totalElements.current = data.pagedMeta?.totalElements;
        return data;
    }

    const handleDeleteBtnClick = (id: number) => {
        setItemToDelete(id);
    }

    const handleToggleItemSelection = (data: TOrder) => {
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
            await client?.deleteManyFilteredOrders(getSelectedInput(), filterInput.current);
            toast.success('Orders deleted');
        } catch (e) {
            console.error(e);
            toast.error('Failed to delete orders');
        }
        setDeleteSelectedOpen(false);
        setIsLoading(false);
        updateList();
        resetSelected();
    }


    const handleDelete = async () => {
        if (itemToDelete) {
            try {
                await client?.deleteOrder(itemToDelete)
                toast.success('Order deleted');
            } catch (e) {
                console.error(e);
                toast.error('Failed to delete order');
            }
        }
        setItemToDelete(null);
        updateList();
    }

    const handleFilterInput = debounce(400, () => {
        resetList();
    });

    const handleChangeOrder = (key: keyof TOrder, order: 'ASC' | 'DESC') => {
        orderByRef.current = key;
        orderRef.current = order;
        resetList();
        forceUpdate();
    }

    return (
        <div className={styles.OrderList}>
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
                    <Autocomplete
                        onChange={(event: any, newValue: string | null) => {
                            filterInput.current.status = newValue;
                            resetList();
                        }}
                        options={orderStatuses}
                        getOptionLabel={(option) => option}
                        className={styles.filterItem}
                        renderInput={(params) => <TextField {...params}
                            variant="standard"
                            placeholder="Status"
                        />}
                    />
                    <TextField
                        className={styles.filterItem}
                        style={{ width: '70px' }}
                        placeholder="Order id"
                        variant="standard"
                        onChange={(event) => {
                            filterInput.current.orderId = event.target.value;
                            handleFilterInput();
                        }}
                    />
                    <TextField
                        className={styles.filterItem}
                        placeholder="Name"
                        style={{ width: '100px' }}
                        variant="standard"
                        onChange={(event) => {
                            filterInput.current.customerName = event.target.value;
                            handleFilterInput();
                        }}
                    />
                    <TextField
                        className={styles.filterItem}
                        placeholder="Phone"
                        style={{ width: '100px' }}
                        variant="standard"
                        onChange={(event) => {
                            filterInput.current.customerPhone = event.target.value;
                            handleFilterInput();
                        }}
                    />
                    <TextField
                        className={styles.filterItem}
                        placeholder="Email"
                        variant="standard"
                        onChange={(event) => {
                            filterInput.current.customerEmail = event.target.value;
                            handleFilterInput();
                        }}
                    />
                </div>
                <div className={styles.pageActions} >
                    <SortBy<TOrder>
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
            <CList<TOrder, ListItemProps>
                className={styles.listWrapper}
                id={listId}
                ListItem={OrderListItem}
                useAutoLoading
                usePagination
                useQueryPagination
                listItemProps={{ handleDeleteBtnClick, toggleSelection: handleToggleItemSelection }}
                loader={handleGetOrders}
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
                title="Delete order?"
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

export default connect(mapStateToProps)(OrderList);
