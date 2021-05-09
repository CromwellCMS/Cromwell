import { TAttribute, TStoreListItem } from '@cromwell/core';
import { getCStore, getGraphQLClient } from '@cromwell/core-frontend';
import { IconButton } from '@material-ui/core';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';

import { appState } from '../../../helpers/AppState';
import { useForceUpdate } from '../../../helpers/forceUpdate';
import commonStyles from '../../../styles/common.module.scss';
import { CloseIcon } from '../../icons';
import { LoadBox } from '../../loadbox/Loadbox';
import { ProductCard } from '../../productCard/ProductCard';
import Modal from '../baseModal/Modal';
import styles from './WishlistModal.module.scss';

export const WishlistModal = observer(() => {
    const forceUpdate = useForceUpdate();
    const handleClose = () => {
        appState.isWishlistOpen = false;
    }

    const [wishlist, setWishlist] = useState<TStoreListItem[]>([]);
    const [attributes, setAttributes] = useState<TAttribute[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const cstore = getCStore();

    const updateAttributes = async () => {
        try {
            const data = await getGraphQLClient()?.getAttributes();
            if (data) setAttributes(data);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        /**
         * Since getCart method wll retrieve products from local storage and 
         * after a while products can be modified at the server, we need to refresh cart first  
         */
        if (appState.isWishlistOpen) {
            (async () => {
                setIsLoading(true);
                await Promise.all([cstore.updateWishlist(), updateAttributes()])
                const wishlist = cstore.getWishlist()
                setWishlist(wishlist);
                setIsLoading(false);
            })();
        }
    }, [appState.isWishlistOpen]);

    useEffect(() => {
        cstore.onWishlistUpdate(() => {
            const wishlist = cstore.getWishlist();
            setWishlist(wishlist);
            forceUpdate();
        }, 'WishlistModal');
    }, []);

    return (
        <Modal
            className={clsx(commonStyles.center)}
            open={appState.isWishlistOpen}
            onClose={handleClose}
            blurSelector={"#CB_root"}
        >
            <div className={clsx(styles.wishlistModal)}>
                <IconButton onClick={handleClose} className={styles.closeBtn}>
                    <CloseIcon />
                </IconButton>
                {isLoading && (
                    <LoadBox />
                )}
                {!isLoading && (
                    <div className={styles.wishList}>
                        <h3 className={styles.modalTitle}>Wishlist</h3>
                        {[...wishlist].reverse().map((it, i) => {
                            return (
                                <ProductCard
                                    className={styles.prductCard}
                                    attributes={attributes}
                                    key={i}
                                    data={it.product}
                                    variant='list'
                                />
                            )
                        })}
                    </div>
                )}
            </div>
        </Modal>
    )
});