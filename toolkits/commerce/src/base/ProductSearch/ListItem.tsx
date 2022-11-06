import { TProduct } from '@cromwell/core';
import { getCStore, Link } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React from 'react';

import { ProductSearchProps } from './ProductSearch';
import styles from './ProductSearch.module.scss';

/** @internal */
export type ListItemProps = {
  product: TProduct;
  searchProps: ProductSearchProps;
};

/** @internal */
export const DefaultListItem = (props: ListItemProps) => {
  const { product, searchProps } = props;
  const { classes } = searchProps;
  const cstore = getCStore();
  return (
    <Link href={`/product/${product.slug}`} key={product.id} className={clsx(styles.searchItem, classes?.item)}>
      <div
        style={{ backgroundImage: `url(${product?.mainImage})` }}
        className={clsx(styles.searchItemImage, classes?.itemImage)}
      ></div>
      <p className={clsx(styles.searchItemTitle, classes?.itemTitle)}>{product.name}</p>
      <div className={clsx(styles.searchPriceBlock, classes?.priceBlock)}>
        {!!product.oldPrice && (
          <p className={clsx(styles.searchItemOldPrice, classes?.oldPrice)}>
            {cstore.getPriceWithCurrency(product.oldPrice)}
          </p>
        )}
        <p className={clsx(styles.searchItemPrice, classes?.price)}>{cstore.getPriceWithCurrency(product.price)}</p>
      </div>
    </Link>
  );
};
