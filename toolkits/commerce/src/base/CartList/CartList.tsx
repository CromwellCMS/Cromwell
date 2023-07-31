import { TAttribute, TProduct, TStoreListItem } from '@cromwell/core';
import { getCStore, LoadBox as BaseLoadBox, useCart } from '@cromwell/core-frontend';
import React, { useEffect, useState } from 'react';

import { TBaseButton } from '../shared/Button';
import styles from './CartList.module.scss';
import { CartListItem, CartListItemProps } from './CartListItem';
import { useModuleState } from '../../helpers/state';
import { useStoreAttributes } from '../../helpers/useStoreAttributes';
import clsx from 'clsx';

export type CartListProps = {
  classes?: Partial<
    Record<
      | 'root'
      | 'list'
      | 'listItem'
      | 'cartHeader'
      | 'cartTotal'
      | 'cartTotalText'
      | 'productList'
      | 'imageBlock'
      | 'imageLink'
      | 'image'
      | 'captionBlock'
      | 'productName'
      | 'priceBlock'
      | 'oldPrice'
      | 'price'
      | 'attributesBlock'
      | 'actionsBlock'
      | 'attributeValue',
      string
    >
  >;
  elements?: {
    Loadbox?: React.ComponentType;
    Button?: TBaseButton;
    DeleteIcon?: React.ComponentType;
    ListItem?: React.ComponentType<CartListItemProps>;
    HeaderActions?: React.ComponentType;
  };
  text?: {
    total?: string;
  };

  /** All available attributes */
  attributes?: TAttribute[];

  /**
   * Fires when clicked link for a product page.
   */
  onProductClick?: (event: React.MouseEvent, product: TProduct) => void;

  /**
   * Pass custom cart to override retrieved cart from CStore
   */
  cart?: TStoreListItem[];

  /**
   * Hide delete button for products from the list?
   */
  hideDelete?: boolean;

  /**
   * Custom resolver of a link to product page
   */
  getProductLink?: (product: TProduct) => string | undefined;

  /**
   * Position of cart header with sums (cart total)
   */
  sumPosition?: 'top' | 'bottom' | 'none';
};

/**
 * Displays product list of user cart. Use CStore API from `@cromwell/core-frontend`
 * package to add products in the list
 */
export function CartList(props: CartListProps) {
  const { elements, classes, text, sumPosition = 'top' } = props;
  const { Loadbox = BaseLoadBox, ListItem = CartListItem, HeaderActions } = elements ?? {};
  const cstore = getCStore();
  const moduleState = useModuleState();
  const attributes = useStoreAttributes(props.attributes);

  const cart = useCart();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  let viewCart = (props.cart ?? moduleState.paymentSession?.cart ?? cart) as TStoreListItem[] | undefined;
  if (typeof viewCart === 'string') {
    try {
      viewCart = JSON.parse(viewCart);
    } catch (error) {
      console.error(error);
      viewCart = undefined;
    }
  }

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
        await cstore.updateCart(attributes || []);
        setIsLoading(false);
      })();
    }
  }, []);

  const listJsx = (
    <div className={clsx(styles.productList, classes?.productList)}>
      {isLoading && <Loadbox />}
      {!isLoading &&
        viewCart?.map((item, i) => <ListItem item={item} key={item?.product?.id ?? i} cartProps={props} />)}
    </div>
  );

  const headerJsx = (
    <div className={clsx(styles.cartHeader, classes?.cartHeader)}>
      <div className={clsx(styles.cartTotal, classes?.cartTotal)}>
        <p className={clsx(styles.cartTotalText, classes?.cartTotalText)}>{text?.total ?? 'Total: '}</p>
        {cartTotalOldPrice !== cartTotal && (
          <p className={clsx(styles.oldPrice, classes?.oldPrice)}>{cstore.getPriceWithCurrency(cartTotalOldPrice)}</p>
        )}
        <span className={clsx(styles.price, classes?.price)}>{cstore.getPriceWithCurrency(cartTotal)}</span>
      </div>
      {HeaderActions && <HeaderActions />}
    </div>
  );

  return (
    <div className={clsx(styles.CartList, classes?.root)}>
      {sumPosition === 'top' && headerJsx}
      {listJsx}
      {sumPosition === 'bottom' && headerJsx}
    </div>
  );
}
