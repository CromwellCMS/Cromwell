import { TOrder } from '@cromwell/core';
import { Grid, IconButton } from '@material-ui/core';
import { DeleteForever as DeleteForeverIcon, Edit as EditIcon } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { orderListPagrInfo } from '../../constants/PageInfos';
import styles from './OrderListItem.module.scss';
import { ListItemProps } from './OrderListPage';

type TListItemProps = {
    data?: TOrder;
    listItemProps: ListItemProps;
}


const OrderListItem = (props: TListItemProps) => {
    return (
        <Grid container className={styles.listItem}>
            {props.data && (
                <>
                    <Grid item xs={3} className={styles.itemMain}>
                        <div className={styles.itemMainInfo}>
                            <p className={styles.itemTitle}>{props.data?.customerName}</p>
                            <p className={styles.itemAuthor}>{props.data?.customerPhone}</p>
                        </div>
                    </Grid>
                    <Grid item xs={5} className={styles.itemSubInfo}>
                        <p className={styles.orderCreate}>{toLocaleDateString(props.data?.createDate)}</p>
                        <p className={styles.address}>{props.data?.customerAddress}</p>
                    </Grid>
                    <Grid item xs={2} className={styles.itemSubInfo}>
                        <p className={styles.status}>{props.data?.status ?? 'New'}</p>
                    </Grid>
                    <Grid item xs={2} className={styles.listItemActions}>
                        <Link to={`${orderListPagrInfo.baseRoute}/${props.data?.id}`}>
                            <IconButton
                                aria-label="edit"
                            >
                                <EditIcon />
                            </IconButton>
                        </Link>
                        <IconButton
                            aria-label="delete"
                            onClick={() => props.listItemProps.handleDeleteBtnClick(props.data.id)}
                        >
                            <DeleteForeverIcon />
                        </IconButton>
                    </Grid>
                </>
            )}
        </Grid>
    )

}

export default OrderListItem;

const toLocaleDateString = (date: Date | string | undefined) => {
    if (!date) return '';
    if (typeof date === 'string') date = new Date(date);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}
