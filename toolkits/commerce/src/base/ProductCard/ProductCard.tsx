import {
  onStoreChange,
  removeOnStoreChange,
  TAttribute,
  TCromwellNotify,
  TDefaultPageName,
  TProduct,
  TStoreListItem,
  resolvePageRoute
} from '@cromwell/core';
import { getCStore, Link, TCStoreOperationResult, usePagePropsContext } from '@cromwell/core-frontend';
import clsx from 'clsx';
import Image, { ImageProps } from 'next/image';
import React, { useEffect } from 'react';

import { useForceUpdate } from '../../helpers/forceUpdate';
import { notifier as baseNotifier, NotifierActionOptions } from '../../helpers/notifier';
import { AddShoppingCartIcon, FavoriteBorderIcon, FavoriteIcon, ShoppingCartIcon } from '../icons';
import { BaseButton, TBaseButtonProps } from '../shared/Button';
import { BaseRating, TBaseRatingProps } from '../shared/Rating';
import { BaseTooltip, TBaseTooltipProps } from '../shared/Tooltip';
import styles from './ProductCard.module.scss';

const Empty = (props) => props?.children ?? null;

export type ProductCardProps = {
  data?: TProduct;
  attributes?: TAttribute[];
  classes?: Partial<Record<'root' | 'horizontal_variant' | 'image' | 'image_container' | 'actions' | 'action_button'
    | 'title' | 'price_block' | 'description' | 'rating', string>>;
  style?: React.CSSProperties;
  variant?: 'vertical' | 'horizontal';
  onOpenCart?: () => void;
  onOpenWishlist?: () => void;
  onAddedToCart?: (item: TStoreListItem, result: TCStoreOperationResult) => void;
  onFailedAddToCart?: (item: TStoreListItem, result: TCStoreOperationResult) => void;
  /**
   * Notifier tool. Will show notifications when user adds a product to the cart or
   * wishlist. To disable pass an empty object
   */
  notifier?: TCromwellNotify<NotifierActionOptions>;
  /**
   * Notifier options
   */
  notifierOptions?: NotifierActionOptions;
  elements?: {
    OtherActions?: React.ComponentType<{ cardProps: ProductCardProps }>;
    Rating?: React.ComponentType<TBaseRatingProps & { cardProps: ProductCardProps }>;
    AddCartButton?: React.ComponentType<TBaseButtonProps & {
      cardProps: ProductCardProps;
    }>;
    AddWishlistButton?: React.ComponentType<TBaseButtonProps & {
      cardProps: ProductCardProps;
    }>;
    Tooltip?: React.ComponentType<TBaseTooltipProps & {
      cardProps: ProductCardProps;
    }>;
  }
  imageProps?: Partial<ImageProps>;
  noImagePlaceholder?: string;
  getProductLink?: (product: TProduct) => string;
  text?: {
    addToCart?: string;
    addToWishlist?: string;
    inCart?: string;
    inWishlist?: string;
    openCart?: string;
    reviews?: string;
  }
  onProductLinkClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, link: string) => any;
}

export const ProductCard = (props: ProductCardProps) => {
  const { data: product, onOpenCart, notifier = baseNotifier, notifierOptions = {},
    elements = {}, imageProps, getProductLink, classes, text } = props ?? {};
  const { OtherActions = Empty, Rating = BaseRating,
    AddCartButton = BaseButton, AddWishlistButton = BaseButton,
    Tooltip = BaseTooltip } = elements;
  const forceUpdate = useForceUpdate();
  const pageContext = usePagePropsContext();
  const productBaseRoute = pageContext.pageProps?.cmsProps?.defaultPages?.['product' as TDefaultPageName];
  if (!productBaseRoute && !getProductLink) {
    console.error('ProductCard: cannot define product link. Configure `defaultPages` in cromwell.config.js ' +
      'https://cromwellcms.com/docs/development/theme-development/#default-pages' +
      ' or provide `getProductLink` prop');
  }
  const productLink = product && (getProductLink ? getProductLink(product) :
    productBaseRoute && resolvePageRoute(productBaseRoute, { slug: product?.slug ?? product?.id }));
  const cstore = getCStore();

  const item: TStoreListItem = {
    product: product ?? undefined,
    pickedAttributes: {},
    amount: 1,
  }
  const inCart = cstore.isInCart(item);
  const inWishlist = cstore.isInWishlist({ product });

  const imageLoader = ({ src }: {
    src: string;
    width: number;
    quality?: number;
  }) => {
    const origin = pageContext.routeInfo?.origin;
    if (src.startsWith('/') && origin) {
      src = origin + src;
    }
    return src;
  }

  useEffect(() => {
    if (product?.id) {
      const cbId = 'ccom_product_card' + product.id;
      const onDataChange = () => {
        forceUpdate();
      }

      cstore.onCartUpdate(onDataChange, cbId);
      cstore.onWishlistUpdate(onDataChange, cbId);
      onStoreChange('currency', onDataChange);

      return () => {
        cstore.removeOnCartUpdate(cbId);
        cstore.removeOnWishlistUpdate(cbId);
        removeOnStoreChange('currency', onDataChange);
      }
    }
  }, []);


  const handleAddToCart = () => {
    if (inCart) {
      onOpenCart?.();
    } else {
      const result = cstore.addToCart(item, props?.attributes);
      if (result.success) {
        props?.onAddedToCart?.(item, result);
        notifier?.success?.("Added! Click here to open cart", {
          onClick: () => {
            onOpenCart?.();
          },
          ...notifierOptions,
        });
      } else {
        props?.onFailedAddToCart?.(item, result);
      }
      if (result.code === 1) {
        notifier?.warning?.("Product is already in your cart!", {
          ...notifierOptions,
        });
      }
      if (result.missingAttributes?.length) {
        props?.onFailedAddToCart?.(item, result);
        notifier?.error?.(`Please pick following attributes: ${result.missingAttributes.map(attr => attr?.title || attr.key).join(', ')}`, {
          ...notifierOptions,
        });
      }
      forceUpdate();
    }
  }

  const handleAddToWishlist = () => {
    if (inWishlist) {
      const result = cstore.removeFromWishlist({ product });
      if (result.success) {
        notifier?.info?.("Removed", {
          ...notifierOptions,
        });
      }
    } else {
      const result = cstore.addToWishlist({ product });
      if (result.success) {
        notifier?.success?.("Added! Click here to open wishlist", {
          onClick: () => {
            props?.onOpenWishlist?.();
          },
          ...notifierOptions,
        });
      }
      if (result.code === 1) {
        notifier?.warning?.("Product is already in your wishlist!", {
          ...notifierOptions,
        });
      }
    }
    forceUpdate();
  }

  const mainImage = product?.mainImage ?? product?.images?.[0] ?? props?.noImagePlaceholder;

  return (
    <div className={clsx(styles.ProductCard, classes?.root,
      props?.variant === 'horizontal' && styles.horizontalVariant,
      props?.variant === 'horizontal' && classes?.horizontal_variant,
    )}
      style={props.style}
    >
      <div className={clsx(styles.imageBlock, classes?.image_container)}>
        <Link href={productLink}
          style={{ position: 'relative' }}
          onClick={e => productLink && props.onProductLinkClick?.(e, productLink)}
        >
          <Image
            alt={product?.name ?? undefined}
            loader={imageLoader}
            objectFit="contain"
            layout="fill"
            {...(imageProps ?? {})}
            className={clsx(classes?.image, imageProps?.className)}
            src={imageProps?.src !== undefined ? imageProps?.src : mainImage}
          />
        </Link>
      </div>
      <div className={styles.caption}>
        <div className={styles.productNameContainer}>
          <Link href={productLink}
            onClick={e => productLink && props.onProductLinkClick?.(e, productLink)}
            className={clsx(styles.productName, classes?.title)}
          >{product?.name}</Link>
        </div>
        {product?.description && (
          <div className={clsx(styles.description, classes?.description)}>
            <div dangerouslySetInnerHTML={{ __html: product?.description }}></div>
            <div className={styles.descriptionGradient}></div>
          </div>
        )}
        <div className={styles.priceBlock}>
          {(product?.oldPrice !== undefined && product?.oldPrice !== null) && (
            <p className={styles.oldPrice}>{cstore.getPriceWithCurrency(product.oldPrice)}</p>
          )}
          <p className={styles.price}>{cstore.getPriceWithCurrency(product?.price)}</p>
        </div>
        <div className={clsx(styles.actions, classes?.actions)}>
          <Tooltip cardProps={props}
            title={inCart ? (text?.openCart ?? 'Open cart') : (text?.addToCart ?? 'Add to cart')}>
            <AddCartButton
              cardProps={props}
              onClick={handleAddToCart}
              aria-label={text?.addToCart ?? "Add product to cart"}
              className={clsx(styles.actionBtn, classes?.action_button)}
            >
              {inCart ? <ShoppingCartIcon /> : <AddShoppingCartIcon />}
            </AddCartButton>
          </Tooltip>
          <Tooltip cardProps={props}
            title={text?.addToWishlist ?? "Add to wishlist"}>
            <AddWishlistButton
              cardProps={props}
              onClick={handleAddToWishlist}
              aria-label={text?.addToWishlist ?? "Add product to wishlist"}
              className={clsx(styles.actionBtn, classes?.action_button)}
            >
              {inWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </AddWishlistButton>
          </Tooltip>
          <OtherActions cardProps={props} />
        </div>
        <div className={clsx(styles.ratingBlock, classes?.rating)}>
          <Rating name="read-only"
            value={product?.rating?.average}
            cardProps={props}
            precision={0.5}
            readOnly
          />
          {!!((product?.rating?.reviewsNumber !== undefined && props?.variant === 'horizontal'
            && product?.rating?.reviewsNumber) && (
              <p className={styles.ratingCaption}>
                ({product?.rating?.average ? product?.rating?.average.toFixed(2)
                  : ''}) {product?.rating?.reviewsNumber} {text?.reviews ?? 'reviews'}</p>
            ))}
        </div>
      </div>
    </div>
  )
}