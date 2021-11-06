import { TOrder } from '@cromwell/core';
import { getCStore } from '@cromwell/core-frontend';
import { DeleteForever as DeleteForeverIcon, Edit as EditIcon } from '@mui/icons-material';
import { Checkbox, Grid, IconButton } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { connect, PropsType } from 'react-redux-ts';
import { Link } from 'react-router-dom';

import { orderStatuses } from '../../constants/order';
import { orderPageInfo } from '../../constants/PageInfos';
import { TAppState } from '../../redux/store';
import commonStyles from '../../styles/common.module.scss';
import { ListItemProps } from './OrderList';
import styles from './OrderListItem.module.scss';

type TListItemProps = {
    data?: TOrder;
    listItemProps: ListItemProps;
}

const mapStateToProps = (state: TAppState) => {
    return {
        selectedItems: state.selectedItems,
        allSelected: state.allSelected,
    }
}

type TPropsType = PropsType<PropsType, TListItemProps,
    ReturnType<typeof mapStateToProps>>;



const OrderListItem = (props: TPropsType) => {
    const { data } = props;
    const cstore = getCStore();

    let selected = false;
    if (props.allSelected && !props.selectedItems[data.id]) selected = true;
    if (!props.allSelected && props.selectedItems[data.id]) selected = true;

    return (
        <Grid container className={styles.listItem}>
            {props.data && (
                <>
                    <Grid item xs={3} className={styles.itemMain}>
                        <div className={commonStyles.center}>
                            <Checkbox
                                checked={selected}
                                onChange={() => props.listItemProps.toggleSelection(data)} />
                        </div>
                        <div className={styles.itemMainInfo}>
                            <p className={clsx(styles.itemTitle, styles.ellipsis)}>#{props.data?.id}</p>
                            <p className={clsx(styles.customerName, styles.ellipsis)}>{props.data?.customerName}</p>
                        </div>
                    </Grid>
                    <Grid item xs={2} className={styles.itemSubInfo}>
                        <p className={clsx(styles.status)}>{props.data?.status ?? orderStatuses[0]}</p>
                        <p className={clsx(styles.address, styles.ellipsis)}>{cstore.getPriceWithCurrency(props.data?.orderTotalPrice)}</p>
                    </Grid>
                    <Grid item xs={5} className={styles.itemSubInfo}>
                        <p className={styles.orderCreate}>{toLocaleDateString(props.data?.createDate)}</p>
                        <p className={clsx(styles.address, styles.ellipsis)}>{props.data?.customerAddress}</p>
                    </Grid>
                    <Grid item xs={2} className={styles.listItemActions}>
                        <Link to={`${orderPageInfo.baseRoute}/${props.data?.id}`}>
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

export default connect(mapStateToProps)(OrderListItem);

const toLocaleDateString = (date: Date | string | undefined) => {
    if (!date) return '';
    if (typeof date === 'string') date = new Date(date);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}
