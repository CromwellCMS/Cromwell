import { TAttribute, TCromwellNotify, TProduct, TStoreListItem } from '@cromwell/core';
import { CContainer, getCStore, useForceUpdate } from '@cromwell/core-frontend';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { notifier as baseNotifier, NotifierActionOptions } from '../../helpers/notifier';
import { useModuleState } from '../../helpers/state';
import { useStoreAttributes } from '../../helpers/useStoreAttributes';
import {
  AddShoppingCartIcon as BaseAddShoppingCartIcon,
  FavoriteActiveIcon as BaseFavoriteIcon,
  ShoppingCartIcon as BaseShoppingCartIcon,
} from '../icons';
import { TBaseAlert } from '../shared/Alert';
import { BaseButton, TBaseButton } from '../shared/Button';
import styles from './ProductActions.module.scss';

export type ProductActionsProps = {
  classes?: Partial<Record<'root' | 'actionsCartBlock' | 'actionButton'
    | 'actionsWishlistBlock', string>>;

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

  text?: {
    addedClickToOpenCart?: string;
    productIsInCart?: string;
    productIsInWishlist?: string;
    pickFollowingAttributes?: string;
    addedClickToOpenWishlist?: string;
    addToCart?: string;
    addToWishlist?: string;
    outOfStock?: string;
    onBackorder?: string;
    updateQuantity?: string;
    openCart?: string;
    openWishlist?: string;
  }

  /** Product data. Required */
  product: TProduct;

  /**
   * All available attributes in DB. If not passed will be fetched and cached automatically.
   */
  attributes?: TAttribute[];

  /**
   * Action events
   */
  onCartOpen?: () => any;
  onWishlistOpen?: () => any;

  /**
   * Notifier tool. Will show notifications when user adds a product to the cart or  
   * wishlist. To disable notifications pass an empty object
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

  /**
   * Disable editing of inner blocks in Theme editor 
   */
  disableEdit?: boolean;
}

/**
 * Displays actions (buttons) on product page such as: add to cart/wishlist,
 * amount picker. Handles cart and shows notifications.
 */
export function ProductActions(props: ProductActionsProps) {
  const moduleState = useModuleState();
  const { product, onCartOpen,
    modifiedProduct = (product?.id ? moduleState.products[product?.id]?.modifiedProduct
      : undefined) ?? product,
    onWishlistOpen, notifier = baseNotifier, notifierOptions = {},
    elements = {}, disableEdit, classes, text
  } = props;

  // Custom / default elements
  const { Button = BaseButton,
    AddShoppingCartIcon = BaseAddShoppingCartIcon,
    ShoppingCartIcon = BaseShoppingCartIcon,
    FavoriteIcon = BaseFavoriteIcon,
    QuantityField = DefaultQuantityField,
  } = elements;

  const forceUpdate = useForceUpdate();
  const attributes = useStoreAttributes(props.attributes);
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
        notifier?.success?.(text?.addedClickToOpenCart ?? "Added! Click here to open cart", {
          onClick: () => {
            onCartOpen?.();
          },
          ...notifierOptions,
        });
      }
      if (result.code === 1) {
        notifier?.warning?.(text?.productIsInCart ?? "Product is already in your cart!", {
          ...notifierOptions,
        });
      }
      if (result.missingAttributes?.length) {
        notifier?.error?.(`${text?.pickFollowingAttributes ??
          'Please pick following attributes:'} ${result
            .missingAttributes.map(attr => attr.key).join(', ')}`, {
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
        notifier?.success?.(text?.addedClickToOpenWishlist ?? "Added! Click here to open wishlist", {
          onClick: () => {
            onWishlistOpen?.();
          },
          ...notifierOptions,
        });
      } else {
        notifier?.warning?.(text?.productIsInWishlist ?? "Product is already in your wishlist!", {
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

  const outOfStock = !!((modifiedProduct?.stockStatus === 'Out of stock' ||
    modifiedProduct?.stockStatus === 'On backorder') ||
    (modifiedProduct?.manageStock && modifiedProduct?.stockAmount && modifiedProduct?.stockAmount < amount));

  let cartButtonText = text?.addToCart ?? 'Add to cart';
  if (inCart) {
    if (sameQntInCart) {
      cartButtonText = text?.openCart ?? 'Open cart';
    } else {
      cartButtonText = text?.updateQuantity ?? 'Update qty';
    }
  }

  if (outOfStock) {
    cartButtonText = text?.outOfStock ?? 'Out of stock';
  }

  return (
    <CContainer className={clsx(styles.ProductActions, classes?.root)}
      id="ccom_product_actions"
      editorHidden={disableEdit}
    >
      <CContainer className={clsx(styles.actionsCartBlock, classes?.actionsCartBlock)}
        id="ccom_product_actions_cart"
        editorHidden={disableEdit}
      >
        <Button
          onClick={handleAddToCart}
          variant="contained"
          color="primary"
          size="large"
          className={clsx(styles.actionButton, classes?.actionButton)}
          disabled={outOfStock}
          startIcon={inCart ? <ShoppingCartIcon /> : <AddShoppingCartIcon />}
        >{cartButtonText}</Button>
        <QuantityField
          className={clsx(styles.actionButton, classes?.actionButton)}
          value={amount}
          onChange={(value) => {
            const valNum = Number(value);
            if (valNum && !isNaN(valNum)) setAmount(valNum)
          }}
        />
      </CContainer>
      <CContainer className={clsx(styles.actionsWishlistBlock, classes?.actionsWishlistBlock)}
        id="ccom_product_actions_wishlist"
        editorHidden={disableEdit}
      >
        <Button
          onClick={handleAddToWishlist}
          variant="outlined"
          color="primary"
          size="large"
          className={clsx(styles.actionButton, classes?.actionButton)}
          startIcon={<FavoriteIcon />}
        >{inWishlist ? (text?.openWishlist ?? 'Open Wishlist') :
          (text?.addToWishlist ?? 'Add to wishlist')}</Button>
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

/** @internal */
const DefaultQuantityField = (props) => {
  return <input value={props.value + ''}
    type="number"
    min="1"
    style={{ maxWidth: '50px' }}
    onChange={(event) => props.onChange(Number(event.target.value))}
  />;
}