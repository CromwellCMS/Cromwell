import { TAttribute, TCromwellNotify, TProduct, TStoreListItem } from '@cromwell/core';
import { CContainer, getCStore } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { useForceUpdate } from '../../helpers/forceUpdate';
import { notifier as baseNotifier, NotifierActionOptions } from '../../helpers/notifier';
import { moduleState } from '../../helpers/state';
import {
  AddShoppingCartIcon as BaseAddShoppingCartIcon,
  FavoriteIcon as BaseFavoriteIcon,
  ShoppingCartIcon as BaseShoppingCartIcon,
} from '../icons';
import { TBaseAlert } from '../shared/Alert';
import { BaseButton, TBaseButton } from '../shared/Button';
import styles from './ProductActions.module.scss';

export type ProductActionsProps = {
  /** Product data. Required */
  product?: TProduct | null;
  className?: string;
  style?: React.CSSProperties;
  /**
   * All available attributes in the store
   */
  attributes?: TAttribute[];

  elements?: {
    Button?: TBaseButton;
    Alert?: TBaseAlert;
    ShoppingCartIcon?: React.ComponentType;
    AddShoppingCartIcon?: React.ComponentType;
    FavoriteIcon?: React.ComponentType;
    QuantityField?: React.ComponentType<{
      value: number;
      onChange: (value: number, event?: any) => any;
      className?: string;
      style?: React.CSSProperties;
    }>;
  }
  onCartOpen?: () => any;
  onWishlistOpen?: () => any;
  /**
   * Notifier tool. Will show notifications when user adds a product to the cart or
   * wishlist. To disable pass an empty object
   */
  notifier?: TCromwellNotify<NotifierActionOptions>;
  /**
   * Notifier options
   */
  notifierOptions?: NotifierActionOptions;
  /**
   * Override modified product by `onChange` of `ProductAttributes` component.
   * (not recommended since modifications already stored in the `moduleState`) 
   */
  modifiedProduct?: TProduct | null;
}

export const ProductActions = (props: ProductActionsProps) => {
  // Props
  const { product, attributes, onCartOpen,
    modifiedProduct = (product?.id ? moduleState.products[product?.id]?.modifiedProduct
      : undefined) ?? product,
    onWishlistOpen, notifier = baseNotifier, notifierOptions = {},
    elements = {}
  } = props;

  // Custom / default elements
  const { Button = BaseButton,
    AddShoppingCartIcon = BaseAddShoppingCartIcon,
    ShoppingCartIcon = BaseShoppingCartIcon,
    FavoriteIcon = BaseFavoriteIcon, QuantityField = ((props) => {
      return <input value={props + ''}
        onChange={(event) => props.onChange(Number(event.target.value))}
      />;
    })
  } = elements;

  const forceUpdate = useForceUpdate();
  const cstore = getCStore();
  const [amount, setAmount] = useState(1);
  const pickedAttributes = product?.id ? moduleState.products[product?.id]?.pickedAttributes : undefined;
  const item: TStoreListItem = {
    product: product ?? undefined,
    pickedAttributes: pickedAttributes,
    amount,
  };
  const inCart = cstore.isInCart(item);
  const sameQntInCart = cstore.hasSameQntInCart(item);
  const inWishlist = product && cstore.isInWishlist({ product });
  // const inCompare = cstore.isInCompare({ product });

  useEffect(() => {
    const onCartUpdateId = cstore.onCartUpdate(() => {
      forceUpdate();
    });

    const onUpdateId = product?.id && moduleState.addOnProductUpdateListener(product.id, () => {
      forceUpdate();
    });

    return () => {
      cstore.removeOnCartUpdate(onCartUpdateId);
      if (product?.id) {
        delete moduleState.products[product?.id];
        if (onUpdateId) moduleState.removeOnProductUpdateListener(product.id, onUpdateId);
      }
    }
  }, []);

  const handleAddToCart = () => {
    if (inCart) {
      if (sameQntInCart) {
        onCartOpen?.();
      } else {
        cstore.updateQntInCart(item);
        forceUpdate();
      }
    } else {
      const result = cstore.addToCart(item, attributes);
      if (result.success) {
        notifier?.success?.("Added! Click here to open cart", {
          onClick: () => {
            onCartOpen?.();
          },
          ...notifierOptions,
        });
      }
      if (result.code === 1) {
        notifier?.warning?.("Product is already in your cart!", {
          ...notifierOptions,
        });
      }
      if (result.missingAttributes?.length) {
        notifier?.error?.(`Please pick following attributes: ${result.missingAttributes.map(attr => attr.key).join(', ')}`, {
          ...notifierOptions,
        });
        if (product?.id) moduleState.setCanValidate(product?.id, true);
      }
      forceUpdate();
    }
  }

  const handleAddToWishlist = () => {
    if (!product) return;
    if (inWishlist) {
      onWishlistOpen?.();
    } else {
      const hasBeenAdded = cstore.addToWishlist({ product });
      if (hasBeenAdded) {
        notifier?.success?.("Added! Click here to open wishlist", {
          onClick: () => {
            onWishlistOpen?.();
          },
          ...notifierOptions,
        });
      } else {
        notifier?.warning?.("Product is already in your wishlist!", {
          ...notifierOptions,
        });
      }
      forceUpdate();
    }
  }

  // const handleAddToCompare = () => {
  //     if (inCompare) {
  //         appState.isCompareOpen = true;
  //     } else {
  //         const hasBeenAdded = cstore.addToCompare({ product });
  //         if (hasBeenAdded) {
  //             toast.success("Added! Click here to compare", {
  //                 position: toast.POSITION.TOP_RIGHT,
  //                 onClick: () => {
  //                     appState.isCompareOpen = true;
  //                 }
  //             });
  //         } else {
  //             toast.warn("Product is already in your list!", {
  //                 position: toast.POSITION.TOP_RIGHT
  //             });
  //         }
  //         forceUpdate();
  //     }
  // }

  const outOfStock = (modifiedProduct?.stockStatus === 'Out of stock' || modifiedProduct?.stockStatus === 'On backorder');

  let cartButtonText = 'Add to cart';
  if (inCart) {
    if (sameQntInCart) {
      cartButtonText = 'Open cart';
    } else {
      cartButtonText = 'Update qty';
    }
  }

  if (outOfStock && modifiedProduct?.stockStatus) {
    cartButtonText = modifiedProduct?.stockStatus;
  }

  return (
    <CContainer className={clsx(styles.ProductActions, props.className)}
      id="ccom_product_actions"
      style={props.style}
    >
      <CContainer className={styles.actionsCartBlock} id="ccom_product_actions_cart">
        <Button
          onClick={handleAddToCart}
          variant="contained"
          color="primary"
          size="large"
          className={styles.actionButton}
          disabled={outOfStock}
          startIcon={inCart ? <ShoppingCartIcon /> : <AddShoppingCartIcon />}
        >{cartButtonText}</Button>
        <QuantityField
          className={styles.actionButton}
          value={amount}
          onChange={(value) => {
            const valNum = Number(value);
            if (valNum && !isNaN(valNum)) setAmount(valNum)
          }}
        />
      </CContainer>
      <CContainer className={styles.actionsWishlistBlock} id="ccom_product_actions_wishlist">
        <Button
          onClick={handleAddToWishlist}
          variant="outlined"
          color="primary"
          size="large"
          className={styles.actionButton}
          startIcon={<FavoriteIcon />}
        >{inWishlist ? 'Open Wishlist' : 'Save'}</Button>
        {/* <Button
          onClick={handleAddToCompare}
          variant="outlined"
          color="primary"
          size="large"
          className={clsx(styles.actionButton, commonStyles.button)}
          startIcon={<EqualizerIcon />}
        >{inCompare ? 'Open comparison list' : 'Compare'}</Button> */}
      </CContainer>
    </CContainer>
  )
}