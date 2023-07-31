import { getCStore, LoadBox as BaseLoadBox, useWishlist } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { useStoreAttributes } from '../../helpers/useStoreAttributes';
import { ProductCard as BaseProductCard, ProductCardProps } from '../ProductCard/ProductCard';
import styles from './Wishlist.module.scss';

export type WishlistProps = {
  classes?: Partial<Record<'root' | 'product', string>>;
  elements?: {
    ProductCard?: React.ComponentType<ProductCardProps>;
    Loadbox?: React.ComponentType;
  };
};

/**
 * List of products that have been added into `Wishlist` of `CStore`
 */
export function Wishlist(props: WishlistProps) {
  const cstore = getCStore();
  const { classes } = props;
  const { ProductCard = BaseProductCard, Loadbox = BaseLoadBox } = props.elements ?? {};

  const attributes = useStoreAttributes();
  const list = useWishlist();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    /**
     * Since getCart method wll retrieve products from local storage and
     * after a while products can be modified at the server, we need to refresh cart first
     */
    (async () => {
      setIsLoading(true);
      await cstore.updateWishlist(attributes || []);
      setIsLoading(false);
    })();
  }, []);

  return (
    <div className={clsx(styles.Wishlist, classes?.root)}>
      {isLoading && <Loadbox />}
      {!isLoading &&
        [...list].reverse().map((it, i) => {
          if (!it.product) return null;
          return (
            <div key={i} className={clsx(styles.wishlistProduct, classes?.product)}>
              <ProductCard attributes={attributes} product={it.product} variant="horizontal" />
            </div>
          );
        })}
    </div>
  );
}
