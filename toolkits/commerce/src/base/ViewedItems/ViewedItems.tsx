import { getCStore, LoadBox as BaseLoadBox, useViewedItems } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { useStoreAttributes } from '../../helpers/useStoreAttributes';
import { ProductCard as BaseProductCard, ProductCardProps } from '../ProductCard/ProductCard';
import styles from './ViewedItems.module.scss';

export type ViewedItemsProps = {
  classes?: Partial<Record<'root' | 'product', string>>;
  elements?: {
    ProductCard?: React.ComponentType<ProductCardProps>;
    Loadbox?: React.ComponentType;
  };
};

/**
 * List of products that have been added into `ViewedItems` of `CStore`
 */
export function ViewedItems(props: ViewedItemsProps) {
  const cstore = getCStore();
  const { classes } = props;
  const { ProductCard = BaseProductCard, Loadbox = BaseLoadBox } = props.elements ?? {};

  const list = useViewedItems();
  const attributes = useStoreAttributes();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    /**
     * Since getCart method wll retrieve products from local storage and
     * after a while products can be modified at the server, we need to refresh items first
     */
    (async () => {
      setIsLoading(true);
      await cstore.updateViewedItems(attributes || []);
      setIsLoading(false);
    })();
  }, []);

  return (
    <div className={clsx(styles.ViewedItems, classes?.root)}>
      {isLoading && <Loadbox />}
      {!isLoading &&
        [...list].reverse().map((it, i) => {
          if (!it.product) return null;
          return (
            <div key={i} className={clsx(styles.viewedItemsProduct, classes?.product)}>
              <ProductCard attributes={attributes} product={it.product} variant="horizontal" />
            </div>
          );
        })}
    </div>
  );
}
