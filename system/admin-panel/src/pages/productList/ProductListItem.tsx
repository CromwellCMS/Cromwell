import { TProduct } from '@cromwell/core';
import { getCStore } from '@cromwell/core-frontend';
import { Grid, IconButton } from '@material-ui/core';
import { DeleteForever as DeleteForeverIcon, Edit as EditIcon } from '@material-ui/icons';
import React from 'react';
import { Link } from 'react-router-dom';

import { productPageInfo } from '../../constants/PageInfos';
import { ListItemProps } from './ProductList';
import styles from './ProductList.module.scss';


export type TProductItemProps = {
    data?: TProduct;
    listItemProps: ListItemProps;
}

export const ProductListItem = (props: TProductItemProps) => {
    // console.log('ProductItem::props', props)
    const cstore = getCStore();
    const { data } = props;
    return (
        <Grid container className={styles.listItem}>
            {props.data && (
                <>
                    <Grid item xs={5} className={styles.itemMain}>
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
                    <Grid item xs={3}></Grid>
                    <Grid item xs={4} className={styles.listItemActions}>
                        <Link to={`${productPageInfo.baseRoute}/${props.data?.id}`}>
                            <IconButton
                                aria-label="edit"
                            >
                                <EditIcon />
                            </IconButton>
                        </Link>
                        <IconButton
                            aria-label="delete"
                            onClick={() => props.listItemProps.handleDeleteProductBtnClick(props.data)}
                        >
                            <DeleteForeverIcon />
                        </IconButton>
                    </Grid>
                </>
            )}
        </Grid>
    )
}