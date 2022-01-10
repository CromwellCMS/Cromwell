import { TStoreListItem } from '@cromwell/core';
import { getCStore, LoadBox as BaseLoadBox } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { useForceUpdate } from '../../helpers/forceUpdate';
import { useStoreAttributes } from '../../helpers/useStoreAttributes';
import { ProductCard as BaseProductCard, ProductCardProps } from '../ProductCard/ProductCard';
import styles from './Wishlist.module.scss';

export type WishlistProps = {
  classes?: Partial<Record<'root' | 'product', string>>;
  elements?: {
    ProductCard?: React.ComponentType<ProductCardProps>;
    Loadbox?: React.ComponentType;
  }
}

export const Wishlist = (props: WishlistProps) => {
  const forceUpdate = useForceUpdate();
  const attributes = useStoreAttributes();
  const [wishlist, setWishlist] = useState<TStoreListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const cstore = getCStore();
  const { classes } = props;
  const { ProductCard = BaseProductCard, Loadbox = BaseLoadBox } = props.elements ?? {};

  useEffect(() => {
    /**
     * Since getCart method wll retrieve products from local storage and 
     * after a while products can be modified at the server, we need to refresh cart first  
     */
    (async () => {
      setIsLoading(true);
      await cstore.updateWishlist()
      const wishlist = cstore.getWishlist();
      setWishlist(wishlist);
      setIsLoading(false);
    })();

    const updateId = cstore.onWishlistUpdate(() => {
      const wishlist = cstore.getWishlist();
      setWishlist(wishlist);
      forceUpdate();
    });

    return () => {
      cstore.removeOnWishlistUpdate(updateId);
    }
  }, []);

  return (
    <div className={clsx(styles.Wishlist, classes?.root)}>
      {isLoading && (
        <Loadbox />
      )}
      {!isLoading && (
        [...wishlist].reverse().map((it, i) => {
          return (
            <div key={i}
              className={clsx(styles.wishlistProduct, classes?.product)}
            ><ProductCard
                attributes={attributes}
                data={it.product}
                variant='horizontal'
              />
            </div>
          )
        })
      )}
    </div>
  )
};