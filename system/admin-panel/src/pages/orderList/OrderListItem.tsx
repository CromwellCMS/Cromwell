import { TOrder } from '@cromwell/core';
import { getCStore } from '@cromwell/core-frontend';
import { Checkbox, Grid, IconButton } from '@material-ui/core';
import { DeleteForever as DeleteForeverIcon, Edit as EditIcon } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { connect, PropsType } from 'react-redux-ts';
import { Link } from 'react-router-dom';

import { orderPageInfo } from '../../constants/PageInfos';
import { TAppState } from '../../redux/store';
import commonStyles from '../../styles/common.module.scss';
import styles from './OrderListItem.module.scss';
import { ListItemProps } from './OrderListPage';

type TListItemProps = {
    data?: TOrder;
    listItemProps: ListItemProps;
}

const mapStateToProps = (state: TAppState, ownProps: TListItemProps) => {
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
                            <p className={styles.itemTitle}>{props.data?.customerName}</p>
                            <p className={styles.itemAuthor}>{props.data?.customerPhone}</p>
                        </div>
                    </Grid>
                    <Grid item xs={2} className={styles.itemSubInfo}>
                        <p className={styles.status}>{props.data?.status ?? 'New'}</p>
                        <p className={styles.address}>{cstore.getPriceWithCurrency(props.data?.totalPrice)}</p>
                    </Grid>
                    <Grid item xs={5} className={styles.itemSubInfo}>
                        <p className={styles.orderCreate}>{toLocaleDateString(props.data?.createDate)}</p>
                        <p className={styles.address}>{props.data?.customerAddress}</p>
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
