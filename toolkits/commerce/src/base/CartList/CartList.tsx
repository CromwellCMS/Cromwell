import { TProduct, TStoreListItem } from '@cromwell/core';
import { getCStore, LoadBox as BaseLoadBox, useCart } from '@cromwell/core-frontend';
import React, { useEffect, useState } from 'react';

import { TBaseButton } from '../shared/Button';
import styles from './CartList.module.scss';
import { CartListItem, CartListItemProps } from './CartListItem';
import clsx from 'clsx';

export type CartListProps = {
  classes?: Partial<Record<'root' | 'list' | 'listItem' | 'cartHeader' | 'cartTotal' | 'cartTotalText'
    | 'productList' | 'imageBlock' | 'imageLink' | 'image' | 'captionBlock' | 'productName'
    | 'priceBlock' | 'oldPrice' | 'price' | 'attributesBlock' | 'actionsBlock', string>>;
  elements?: {
    Loadbox?: React.ComponentType;
    Button?: TBaseButton;
    DeleteIcon?: React.ComponentType;
    ListItem?: React.ComponentType<CartListItemProps>;
    HeaderActions?: React.ComponentType;
  }
  onProductClick?: (event: React.MouseEvent, product: TProduct) => void;
  collapsedByDefault?: boolean;
  cart?: TStoreListItem[];
  hideDelete?: boolean;
  getProductLink?: (product: TProduct) => string;
  totalPosition?: 'top' | 'bottom' | 'none';
}

export const CartList = (props: CartListProps) => {
  const { elements, classes, totalPosition = 'top' } = props;
  const { Loadbox = BaseLoadBox,
    ListItem = CartListItem, HeaderActions } = elements ?? {};
  const cstore = getCStore();

  const cart = useCart();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const viewCart = props.cart ?? cart;
  const cartInfo = cstore.getCartTotal(viewCart);
  const cartTotal = cartInfo.total;
  const cartTotalOldPrice = cartInfo.totalOld;

  useEffect(() => {
    /**
     * Since getCart method wll retrieve products from local storage and 
     * after a while products can be modified at the server, we need to refresh cart first  
     */
    if (!props.cart) {
      (async () => {
        setIsLoading(true);
        await cstore.updateCart();
        setIsLoading(false);
      })();
    }
  }, []);


  const listJsx = (
    <div className={clsx(styles.productList, classes?.productList)}>
      {isLoading && (
        <Loadbox />
      )}
      {!isLoading && viewCart.map((item, i) => (
        <ListItem item={item}
          key={item?.product?.id ?? i}
          cartProps={props}
        />
      ))}
    </div>
  );

  const headerJsx = (
    <div className={clsx(styles.cartHeader, classes?.cartHeader)}>
      <div className={clsx(styles.cartTotal, classes?.cartTotal)}>
        <p className={clsx(styles.cartTotalText, classes?.cartTotalText)}>Total</p>
        {(cartTotalOldPrice !== cartTotal) && (
          <p className={clsx(styles.oldPrice, classes?.oldPrice)}>{cstore.getPriceWithCurrency(cartTotalOldPrice)}</p>
        )}
        <span className={clsx(styles.price, classes?.price)}>{cstore.getPriceWithCurrency(cartTotal)}</span>
      </div>
      {HeaderActions && <HeaderActions />}
    </div>
  )

  return (
    <div className={clsx(styles.CartList, classes?.root)} >
      {totalPosition === 'top' && headerJsx}
      {listJsx}
      {totalPosition === 'bottom' && headerJsx}
    </div>
  )
}
