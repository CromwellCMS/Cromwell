import { TProduct, TStoreListItem } from '@cromwell/core';
import { getCStore, Link } from '@cromwell/core-frontend';
import { Collapse, Grid, IconButton, Theme, useMediaQuery } from '@mui/material';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';

import { useForceUpdate } from '../../helpers/forceUpdate';
import commonStyles from '../../styles/common.module.scss';
import { DeleteForeverIcon, ExpandMoreIcon } from '../icons';
import { LoadBox } from '../loadbox/Loadbox';
import styles from './CartProductList.module.scss';

/**
 * Displays cart in the global store by default (cart manager)
 * or cart passed in props (static cart view).
 */
export const CartProductList = (props: {
    onProductOpen?: (product: TProduct) => void;
    collapsedByDefault?: boolean;
    cart?: TStoreListItem[];
}) => {
    const [cart, setCart] = useState<TStoreListItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const forceUpdate = useForceUpdate();
    const _collapsedByDefault = useRef<boolean>(!!props.collapsedByDefault);
    const isCollapsed = useRef<boolean>(!!props.collapsedByDefault);
    const cstore = getCStore();
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const isStatic = !!props.cart;

    if (_collapsedByDefault.current !== props.collapsedByDefault) {
        isCollapsed.current = !!props.collapsedByDefault;
        _collapsedByDefault.current = !!props.collapsedByDefault
    }

    const handleDeleteItem = (item: TStoreListItem) => {
        cstore.removeFromCart(item);
        setCart(cstore.getCart());
    }

    useEffect(() => {
        /**
         * Since getCart method wll retrieve products from local storage and 
         * after a while products can be modified at the server, we need to refresh cart first  
         */
        if (!isStatic) {
            (async () => {
                setIsLoading(true);
                await cstore.updateCart();
                const cart = cstore.getCart();
                setCart(cart);
                setIsLoading(false);
            })();

            cstore.onCartUpdate(() => {
                forceUpdate();
            }, 'ProductActions');
        }
    }, []);


    const handleCollapse = () => {
        if (isMobile) {
            isCollapsed.current = !isCollapsed.current;
            forceUpdate();
        }
    }

    const viewCart = props.cart ?? cart;
    const cartInfo = cstore.getCartTotal(viewCart);
    const cartTotal = cartInfo.total
    const cartTotalOldPrice = cartInfo.totalOld;


    const productList = (
        <div className={styles.productList}>
            {isLoading && (
                <LoadBox />
            )}
            {!isLoading && viewCart.map((it, i) => {
                const product = it.product;
                const checkedAttrKeys = Object.keys(it.pickedAttributes || {});
                if (product) {
                    const productLink = `/product/${product.slug}`;
                    return (
                        <Grid key={i} className={clsx(styles.listItem, commonStyles.onHoverLinkContainer)} container>
                            <Grid item xs={3} className={styles.itemBlock}>
                                <Link href={productLink}>
                                    <a onClick={() => props?.onProductOpen?.(product)}>
                                        <img src={product.mainImage ?? undefined} className={styles.mainImage} />
                                    </a>
                                </Link>
                            </Grid>
                            <Grid item xs={4} className={clsx(styles.itemBlock, styles.caption)}>
                                <Link href={productLink}>
                                    <a onClick={() => props?.onProductOpen?.(product)}
                                        className={clsx(commonStyles.onHoverLink, styles.productName)}>{product.name}</a>
                                </Link>
                                <div className={styles.priceBlock}>
                                    {(product?.oldPrice !== undefined && product?.oldPrice !== null) && (
                                        <p className={styles.oldPrice}>{cstore.getPriceWithCurrency(product.oldPrice)}</p>
                                    )}
                                    <p className={styles.price}>{cstore.getPriceWithCurrency(product?.price)}</p>
                                </div>
                            </Grid>
                            <Grid item xs={3} className={styles.itemBlock}>
                                {checkedAttrKeys.map(key => {
                                    const vals = it.pickedAttributes ? it.pickedAttributes[key] : [];
                                    const valsStr = vals.join(', ');
                                    return <p key={key}>{key}: {valsStr}</p>
                                })}
                                <p>Qty: {it.amount}</p>
                            </Grid>
                            <Grid item xs={2} className={styles.itemBlock} style={{ marginLeft: 'auto', paddingRight: '0px' }}>
                                <div className={styles.actions} >
                                    {!isStatic && (
                                        <IconButton
                                            aria-label="Delete from cart"
                                            onClick={() => { handleDeleteItem(it); }}
                                        >
                                            <DeleteForeverIcon />
                                        </IconButton>
                                    )}
                                </div>
                            </Grid>
                        </Grid>
                    )
                }
            })}
        </div>
    );

    return (
        <div className={styles.CartProductList} >
            <div className={styles.cartHeader} onClick={handleCollapse}>
                <div className={styles.cartInfo}>
                    <p className={styles.priceBlock} >
                        <span className={styles.cartTotalText}>Cart total:</span>
                        {(cartTotalOldPrice !== cartTotal) && (
                            <span className={styles.oldPrice}>{cstore.getPriceWithCurrency(cartTotalOldPrice)}</span>
                        )}
                        <span className={styles.price}>{cstore.getPriceWithCurrency(cartTotal)}</span>
                    </p>
                    <div></div>
                    {/* <p className={styles.itemsText}>Items: {amount}</p> */}
                </div>
                {isMobile && !!_collapsedByDefault.current && (
                    <IconButton
                        aria-label="Expand cart"
                    >
                        <ExpandMoreIcon
                            // className={classes.expandMoreIcon}
                            color="#111"
                            style={{ transform: !isCollapsed.current ? 'rotate(180deg)' : '' }}
                        />
                    </IconButton>
                )}
            </div>
            {(isMobile && _collapsedByDefault.current) ? (
                <Collapse in={!isCollapsed.current} timeout="auto" unmountOnExit>
                    {productList}
                </Collapse>
            ) : productList}
        </div >
    )
}
