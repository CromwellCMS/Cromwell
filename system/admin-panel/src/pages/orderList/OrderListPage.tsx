import { getBlockInstance, TOrder, TPagedParams } from '@cromwell/core';
import { CList, getGraphQLClient, TCList } from '@cromwell/core-frontend';
import { Checkbox, IconButton, Tooltip } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { connect, PropsType } from 'react-redux-ts';
import { useHistory } from 'react-router-dom';

import { LoadingStatus } from '../../components/loadBox/LoadingStatus';
import ConfirmationModal from '../../components/modal/Confirmation';
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
import OrderListItem from './OrderListItem';
import styles from './OrderListPage.module.scss';

export type ListItemProps = {
    handleDeleteBtnClick: (id: string) => void;
    toggleSelection: (data: TOrder) => void;
}


const mapStateToProps = (state: TAppState) => {
    return {
        allSelected: state.allSelected,
    }
}

type TPropsType = PropsType<TAppState, {},
    ReturnType<typeof mapStateToProps>>;


const OrderList = (props: TPropsType) => {
    const client = getGraphQLClient();
    const listId = "Admin_OrderList";
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const history = useHistory();
    const totalElements = useRef<number | null>(null);
    const [deleteSelectedOpen, setDeleteSelectedOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        resetSelected();
        return () => {
            resetSelected();
        }
    }, []);

    const resetList = () => {
        const list: TCList | undefined = getBlockInstance(listId)?.getContentInstance() as any;
        list.clearState();
        list.init();
    }

    const handleGetOrders = async (params?: TPagedParams<TOrder>) => {
        if (!params) params = {};
        params.orderBy = 'createDate';
        params.order = 'ASC';
        const data = await client?.getOrders(params);

        if (data.pagedMeta?.totalElements) totalElements.current = data.pagedMeta?.totalElements;
        return data;
    }

    const handleDeleteBtnClick = (id: string) => {
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
            await client?.deleteManyOrders(getSelectedInput());
            toast.success('Orders deleted');
        } catch (e) {
            console.error(e);
            toast.success('Failed to delete orders');
        }
        setDeleteSelectedOpen(false);
        setIsLoading(false);
        resetList();
        resetSelected();
    }


    const handleDelete = async () => {
        if (itemToDelete) {
            try {
                await client?.deleteOrder(itemToDelete)
                toast.success('Order deleted');
            } catch (e) {
                console.error(e);
                toast.success('Failed to delete order');
            }
        }
        setItemToDelete(null);
        resetList();
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
            <CList<TOrder, ListItemProps>
                className={styles.listWrapper}
                id={listId}
                ListItem={OrderListItem}
                useAutoLoading
                usePagination
                useQueryPagination
                listItemProps={{ handleDeleteBtnClick, toggleSelection: handleToggleItemSelection }}
                loader={handleGetOrders}
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
