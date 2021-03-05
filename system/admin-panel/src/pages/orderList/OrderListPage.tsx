import { getBlockInstance, TOrder, TPagedParams } from '@cromwell/core';
import { CList, getGraphQLClient, TCList } from '@cromwell/core-frontend';
import { Select } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import ConfirmationModal from '../../components/modal/Confirmation';
import { listPreloader } from '../../components/SkeletonPreloader';
import { toast } from '../../components/toast/toast';
import OrderListItem from './OrderListItem';
import styles from './OrderListPage.module.scss';

export type ListItemProps = {
    handleDeleteBtnClick: (id: string) => void;
}

const OrderList = () => {
    const client = getGraphQLClient();
    const listId = "Admin_OrderList";
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const history = useHistory();

    const handleGetOrders = async (params?: TPagedParams<TOrder>) => {
        if (!params) params = {};
        params.orderBy = 'createDate';
        params.order = 'ASC';
        return client?.getOrders(params);
    }

    const handleDeleteBtnClick = (id: string) => {
        setItemToDelete(id);
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

        const list: TCList | undefined = getBlockInstance(listId)?.getContentInstance() as any;
        list.clearState();
        list.init();
    }

    return (
        <div className={styles.OrderList}>
            <div className={styles.listHeader}>
                <div className={styles.filter}>
                    {/* <Select /> */}

                </div>
            </div>
            <CList<TOrder, ListItemProps>
                className={styles.listWrapper}
                id={listId}
                ListItem={OrderListItem}
                useAutoLoading
                usePagination
                useQueryPagination
                listItemProps={{ handleDeleteBtnClick }}
                loader={handleGetOrders}
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
                open={Boolean(itemToDelete)}
                onClose={() => setItemToDelete(null)}
                onConfirm={handleDelete}
                title="Delete order?"
            />
        </div>
    )
}

export default OrderList;
