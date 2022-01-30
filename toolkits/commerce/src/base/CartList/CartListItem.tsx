import { TStoreListItem } from '@cromwell/core';
import { getCStore, Link } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React from 'react';

import { useProductLink } from '../../helpers/useLinks';
import { DeleteForeverIcon as BaseDeleteForeverIcon } from '../icons';
import { BaseButton } from '../shared/Button';
import { CartListProps } from './CartList';
import styles from './CartListItem.module.scss';

/** @internal */
export type CartListItemProps = {
  item: TStoreListItem;
  cartProps: CartListProps
}

/** @internal */
export function CartListItem(props: CartListItemProps) {
  const { item, cartProps } = props;
  const product = item.product;
  const { classes, onProductClick } = cartProps;
  const checkedAttrKeys = Object.keys(item.pickedAttributes || {});
  const cstore = getCStore();
  const { Button = BaseButton, DeleteIcon = BaseDeleteForeverIcon } = cartProps.elements ?? {};

  const productLink = useProductLink(product, cartProps.getProductLink);
  if (!product) {
    return null;
  }

  const handleDeleteItem = (item: TStoreListItem) => {
    cstore.removeFromCart(item);
  }

  return (
    <div key={item.product?.id}
      className={clsx(styles.CartListItem, classes?.listItem)}
    >
      <div className={clsx(styles.imageBlock, classes?.imageBlock)}>
        <Link href={productLink}
          className={clsx(styles.imageLink, classes?.imageLink)}
          onClick={(event) => onProductClick?.(event, product)}
        >
          <img src={product.mainImage ?? undefined}
            className={clsx(styles.image, classes?.image)}
          />
        </Link>
      </div>
      <div className={clsx(styles.captionBlock, classes?.captionBlock)}>
        <Link href={productLink}
          onClick={(event) => onProductClick?.(event, product)}
          className={clsx(styles.productName, classes?.productName)}
        >{product.name}</Link>
        <div className={clsx(styles.priceBlock, classes?.priceBlock)}>
          {(product?.oldPrice !== undefined && product?.oldPrice !== null) && (
            <p className={clsx(styles.oldPrice, classes?.oldPrice)}>{cstore.getPriceWithCurrency(product.oldPrice)}</p>
          )}
          <p className={clsx(styles.price, classes?.price)}>{cstore.getPriceWithCurrency(product?.price)}</p>
        </div>
      </div>
      <div className={clsx(styles.attributesBlock, classes?.attributesBlock)}>
        {checkedAttrKeys.map(key => {
          const values = item.pickedAttributes?.[key];
          if (!values?.length || !key) return null;
          const valuesStr = values.join(', ');
          return <p key={key}>{key}: {valuesStr}</p>
        })}
      </div>
      <div className={clsx(styles.actionsBlock, classes?.actionsBlock)}>
        {!cartProps.hideDelete && (
          <Button
            aria-label="Delete from cart"
            onClick={() => { handleDeleteItem(item); }}
          >
            <DeleteIcon />
          </Button>
        )}
      </div>
    </div >
  )
}