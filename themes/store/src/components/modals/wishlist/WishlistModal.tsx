import { getCStore } from '@cromwell/core-frontend';
import { TStoreListItem } from '@cromwell/core';
import { Modal } from '@material-ui/core';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';

import { productListStore } from '../../../helpers/ProductListStore';
import commonStyles from '../../../styles/common.module.scss';
import { ProductCard } from '../../productCard/ProductCard';
import styles from './WishlistModal.module.scss';

export const WishlistModal = observer(() => {
    const handleCartClose = () => {
        productListStore.isWishlistOpen = false;
    }

    const [wishlist, setWishlist] = useState<TStoreListItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const cstore = getCStore();

    const handleDeleteItem = (item: TStoreListItem) => {
        cstore.removeFromCart(item);
        setWishlist(cstore.getWishlist());
    }

    useEffect(() => {
        /**
         * Since getCart method wll retrieve products from local storage and 
         * after a while products can be modified at the server, we need to refresh cart first  
         */
        if (productListStore.isWishlistOpen) {
            (async () => {
                setIsLoading(true);
                await cstore.updateWishlist();
                const wishlist = cstore.getWishlist()
                setWishlist(wishlist);
                setIsLoading(false);
            })();
        }
    }, [productListStore.isWishlistOpen]);

    return (
        <Modal
            className={clsx(commonStyles.center)}
            open={productListStore.isWishlistOpen}
            onClose={handleCartClose}
        >
            <div className={clsx(commonStyles.content, styles.wishlistModal)}>
                <div className={styles.wishList}>
                    {wishlist.map((it, i) => {
                        return (
                            <ProductCard key={i} data={it.product} variant='list' />
                        )
                    })}
                </div>
            </div>
        </Modal>
    )
});