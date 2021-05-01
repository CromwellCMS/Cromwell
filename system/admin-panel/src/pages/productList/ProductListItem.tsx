import { TProduct } from '@cromwell/core';
import { getCStore } from '@cromwell/core-frontend';
import { Checkbox, Grid, IconButton } from '@material-ui/core';
import { DeleteForever as DeleteForeverIcon, Edit as EditIcon } from '@material-ui/icons';
import React from 'react';
import { connect, PropsType } from 'react-redux-ts';
import { Link } from 'react-router-dom';

import { productPageInfo } from '../../constants/PageInfos';
import { TAppState } from '../../redux/store';
import commonStyles from '../../styles/common.module.scss';
import { ListItemProps } from './ProductList';
import styles from './ProductList.module.scss';

export type TProductItemProps = {
    data?: TProduct;
    listItemProps: ListItemProps;
    embedded?: boolean;
}

const mapStateToProps = (state: TAppState, ownProps: TProductItemProps) => {
    return {
        selectedItems: state.selectedItems,
        allSelected: state.allSelected,
    }
}

type TPropsType = PropsType<PropsType, TProductItemProps,
    ReturnType<typeof mapStateToProps>>;

const ProductListItem = (props: TPropsType) => {
    const cstore = getCStore();
    const { data } = props;

    let selected = false;
    if (props.allSelected && !props.selectedItems[data.id]) selected = true;
    if (!props.allSelected && props.selectedItems[data.id]) selected = true;

    return (
        <Grid container className={styles.listItem}>
            {props.data && (
                <>
                    <Grid item xs={6} className={styles.itemMain}>
                        {!props.embedded && (
                            <div className={commonStyles.center}>
                                <Checkbox
                                    checked={selected}
                                    onChange={() => props.listItemProps.toggleSelection(data)} />
                            </div>
                        )}
                        <div
                            style={{ backgroundImage: `url(${props?.data?.mainImage})` }}
                            className={styles.itemImage}
                        ></div>
                        <div className={styles.itemMainInfo}>
                            <p className={styles.itemTitle}>{props.data?.name}</p>
                            <div className={styles.priceBlock}>
                                {(data?.oldPrice !== undefined && data?.oldPrice !== null) && (
                                    <p className={styles.oldPrice}>{cstore.getPriceWithCurrency(data.oldPrice)}</p>
                                )}
                                <p className={styles.price}>{cstore.getPriceWithCurrency(data?.price)}</p>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={4} className={styles.listItemActions}>
                        <Link to={`${productPageInfo.baseRoute}/${props.data?.id}`}>
                            <IconButton
                                aria-label="edit"
                            >
                                <EditIcon />
                            </IconButton>
                        </Link>
                        {!props.embedded && (
                            <IconButton
                                aria-label="delete"
                                onClick={() => props.listItemProps.handleDeleteProductBtnClick(props.data)}
                            >
                                <DeleteForeverIcon />
                            </IconButton>
                        )}
                    </Grid>
                </>
            )}
        </Grid>
    )
}

const connectedComponent = connect(mapStateToProps)(ProductListItem);

export default connectedComponent;