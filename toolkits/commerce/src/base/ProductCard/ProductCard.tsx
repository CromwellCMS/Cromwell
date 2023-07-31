import { isServer, TAttribute, TCromwellNotify, TProduct, TStoreListItem } from '@cromwell/core';
import {
  getCStore,
  getThumbnailSrc,
  Link,
  TCStoreOperationResult,
  useAppPropsContext,
  useCart,
  useCurrency,
  useForceUpdate,
  useWishlist,
} from '@cromwell/core-frontend';
import clsx from 'clsx';
import React from 'react';

import { getNotifier, NotifierActionOptions } from '../../helpers/notifier';
import { useProductLink } from '../../helpers/useLinks';
import { useStoreAttributes } from '../../helpers/useStoreAttributes';
import { AddShoppingCartIcon, FavoriteActiveIcon, FavoriteHollowIcon, ShoppingCartIcon } from '../icons';
import { BaseButton, TBaseButtonProps } from '../shared/Button';
import { BaseRating, TBaseRatingProps } from '../shared/Rating';
import { BaseTooltip, TBaseTooltipProps } from '../shared/Tooltip';
import styles from './ProductCard.module.scss';

/** @internal */
const Empty = (props) => props?.children ?? null;

export type ProductCardProps = {
  classes?: Partial<
    Record<
      | 'root'
      | 'horizontal_variant'
      | 'image'
      | 'image_container'
      | 'actions'
      | 'action_button'
      | 'title'
      | 'price_block'
      | 'description'
      | 'rating',
      string
    >
  >;

  elements?: {
    OtherActions?: React.ComponentType<{ cardProps: ProductCardProps }>;
    Rating?: React.ComponentType<TBaseRatingProps>;
    AddCartButton?: React.ComponentType<TBaseButtonProps>;
    AddWishlistButton?: React.ComponentType<TBaseButtonProps>;
    Tooltip?: React.ComponentType<TBaseTooltipProps>;
  };

  text?: {
    addToCart?: string;
    addToWishlist?: string;
    inCart?: string;
    inWishlist?: string;
    openCart?: string;
    reviews?: string;
    clickToOpenCart?: string;
  };

  /** Product data. Required */
  product: TProduct;

  /**
   * All available attributes in DB. If not passed will be fetched and cached automatically.
   */
  attributes?: TAttribute[];

  /**
   * In `vertical` variant image at top and text at bottom (takes more vertical space).
   * In `horizontal` variant image at left and text at right (takes more horizontal space).
   */
  variant?: 'vertical' | 'horizontal';

  /**
   * Action button events
   */
  onOpenCart?: () => void;
  onOpenWishlist?: () => void;
  onAddedToCart?: (item: TStoreListItem, result: TCStoreOperationResult) => void;
  onFailedAddToCart?: (item: TStoreListItem, result: TCStoreOperationResult) => void;

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
   * URL to a placeholder image to use if a product has no primary image set.
   */
  noImagePlaceholderUrl?: string;

  /**
   * Custom link resolver onto product page.
   */
  getProductLink?: (product: TProduct) => string | undefined;

  /**
   * Product link click (image or title). You can prevent navigation event.
   */
  onProductLinkClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, link: string) => any;
};

/**
 * Displays product cart with short product info. Used to display in product list
 * of a product category
 */
export function ProductCard(props: ProductCardProps) {
  const {
    product,
    onOpenCart,
    notifier = getNotifier(),
    notifierOptions = {},
    elements = {},
    classes,
    text,
  } = props ?? {};
  const {
    OtherActions = Empty,
    Rating = BaseRating,
    AddCartButton = BaseButton,
    AddWishlistButton = BaseButton,
    Tooltip = BaseTooltip,
  } = elements;
  const cstore = getCStore();

  const pageContext = useAppPropsContext();
  const attributes = useStoreAttributes(props.attributes);
  const forceUpdate = useForceUpdate();
  const productLink = useProductLink(product, props.getProductLink);
  useCart();
  useWishlist();
  useCurrency();

  const item: TStoreListItem = {
    product: product ?? undefined,
    pickedAttributes: {},
    amount: 1,
  };
  const inCart = cstore.isInCart(item);
  const inWishlist = cstore.isInWishlist({ product });

  const handleAddToCart = () => {
    if (inCart) {
      onOpenCart?.();
    } else {
      const result = cstore.addToCart(item, attributes);
      if (result.success) {
        props?.onAddedToCart?.(item, result);
        notifier?.success?.('Added! Click here to open cart', {
          onClick: () => {
            onOpenCart?.();
          },
          ...notifierOptions,
        });
      } else {
        props?.onFailedAddToCart?.(item, result);
      }
      if (result.code === 1) {
        notifier?.warning?.('Product is already in your cart!', {
          ...notifierOptions,
        });
      }
      if (result.missingAttributes?.length) {
        props?.onFailedAddToCart?.(item, result);
        notifier?.error?.(
          `Please pick following attributes: ${result.missingAttributes
            .map((attr) => attr?.title || attr.key)
            .join(', ')}`,
          {
            ...notifierOptions,
          },
        );
      }
      forceUpdate();
    }
  };

  const handleAddToWishlist = () => {
    if (inWishlist) {
      const result = cstore.removeFromWishlist({ product });
      if (result.success) {
        notifier?.info?.('Removed', {
          ...notifierOptions,
        });
      }
    } else {
      const result = cstore.addToWishlist({ product });
      if (result.success) {
        notifier?.success?.('Added! Click here to open wishlist', {
          onClick: () => {
            props?.onOpenWishlist?.();
          },
          ...notifierOptions,
        });
      }
      if (result.code === 1) {
        notifier?.warning?.('Product is already in your wishlist!', {
          ...notifierOptions,
        });
      }
    }
    forceUpdate();
  };

  let mainImage = product?.mainImage ?? product?.images?.[0] ?? props?.noImagePlaceholderUrl;

  const origin = pageContext.routeInfo?.origin;
  if (mainImage && mainImage.startsWith('/') && origin) {
    mainImage = origin + mainImage;
  }

  const WishlistIcon = inWishlist ? FavoriteActiveIcon : FavoriteHollowIcon;

  return (
    <div
      className={clsx(
        styles.ProductCard,
        classes?.root,
        props?.variant === 'horizontal' && styles.horizontalVariant,
        props?.variant === 'horizontal' && classes?.horizontal_variant,
      )}
    >
      {mainImage !== undefined && mainImage !== null && (
        <div className={clsx(styles.imageBlock, classes?.image_container)}>
          <Link
            href={productLink}
            style={{ position: 'relative' }}
            onClick={(e) => productLink && props.onProductLinkClick?.(e, productLink)}
          >
            <img
              src={getThumbnailSrc({
                src: mainImage,
                width: 300,
                height: 300,
              })}
              alt={product?.name || ''}
              style={{
                objectFit: 'cover',
              }}
              className={clsx(styles.image, classes?.image)}
            />
          </Link>
        </div>
      )}
      <div className={styles.caption}>
        <div className={styles.productNameContainer}>
          <Link
            href={productLink}
            onClick={(e) => productLink && props.onProductLinkClick?.(e, productLink)}
            className={clsx(styles.productName, classes?.title)}
          >
            {product?.name}
          </Link>
        </div>
        {product?.description && (
          <div className={clsx(styles.description, classes?.description)}>
            <div dangerouslySetInnerHTML={{ __html: product?.description }}></div>
            <div className={styles.descriptionGradient}></div>
          </div>
        )}
        <div className={styles.priceBlock}>
          {product?.oldPrice !== undefined && product?.oldPrice !== null && (
            <p className={styles.oldPrice}>{cstore.getPriceWithCurrency(product.oldPrice)}</p>
          )}
          <p className={styles.price}>{cstore.getPriceWithCurrency(product?.price)}</p>
        </div>
        <div className={clsx(styles.actions, classes?.actions)}>
          <Tooltip title={inCart ? text?.openCart ?? 'Open cart' : text?.addToCart ?? 'Add to cart'}>
            <AddCartButton
              onClick={handleAddToCart}
              aria-label={text?.addToCart ?? 'Add product to cart'}
              className={clsx(styles.actionBtn, classes?.action_button)}
            >
              {inCart ? <ShoppingCartIcon /> : <AddShoppingCartIcon />}
            </AddCartButton>
          </Tooltip>
          <Tooltip title={text?.addToWishlist ?? 'Add to wishlist'}>
            <AddWishlistButton
              onClick={handleAddToWishlist}
              aria-label={text?.addToWishlist ?? 'Add product to wishlist'}
              className={clsx(styles.actionBtn, classes?.action_button)}
            >
              {!isServer() && <WishlistIcon />}
            </AddWishlistButton>
          </Tooltip>
          <OtherActions cardProps={props} />
        </div>
        <div className={clsx(styles.ratingBlock, classes?.rating)}>
          <Rating name="read-only" value={product?.rating?.average} precision={0.5} readOnly />
          {
            !!(
              product?.rating?.reviewsNumber !== undefined &&
              props?.variant === 'horizontal' &&
              product?.rating?.reviewsNumber && (
                <p className={styles.ratingCaption}>
                  ({product?.rating?.average ? product?.rating?.average.toFixed(2) : ''}){' '}
                  {product?.rating?.reviewsNumber} {text?.reviews ?? 'reviews'}
                </p>
              )
            )
          }
        </div>
      </div>
    </div>
  );
}
