import { TStoreListItem } from '@cromwell/core';
import { getCStore, LoadBox as BaseLoadBox } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { useForceUpdate } from '../../helpers/forceUpdate';
import { useStoreAttributes } from '../../helpers/useStoreAttributes';
import { ProductCard as BaseProductCard, ProductCardProps } from '../ProductCard/ProductCard';
import styles from './ViewedItems.module.scss';

export type ViewedItemsProps = {
  classes?: Partial<Record<'root' | 'product', string>>;
  elements?: {
    ProductCard?: React.ComponentType<ProductCardProps>;
    Loadbox?: React.ComponentType;
  }
}

export const ViewedItems = (props: ViewedItemsProps) => {
  const forceUpdate = useForceUpdate();
  const attributes = useStoreAttributes();
  const [list, setList] = useState<TStoreListItem[]>([]);
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
      const viewed = cstore.getViewedItems()
      setList(viewed);
      setIsLoading(false);
    })();

    const viewedUpdatedId = cstore.onViewedItemsUpdate(() => {
      const viewed = cstore.getViewedItems();
      setList(viewed);
      forceUpdate();
    });

    return () => {
      cstore.removeOnViewedItemsUpdate(viewedUpdatedId);
    }
  }, []);

  return (
    <div className={clsx(styles.ViewedItems, classes?.root)}>
      {isLoading && (
        <Loadbox />
      )}
      {!isLoading && (
        [...list].reverse().map((it, i) => {
          return (
            <div key={i}
              className={clsx(styles.viewedItemsProduct, classes?.product)}
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