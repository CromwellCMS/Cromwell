import { TAttribute, TProduct, TStoreListItem } from '@cromwell/core';
import { getCStore, Link } from '@cromwell/core-frontend';
import { IconButton, Tooltip, useMediaQuery, useTheme } from '@material-ui/core';
import {
    AddShoppingCart as AddShoppingCartIcon,
    Equalizer as EqualizerIcon,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    ShoppingCart as ShoppingCartIcon,
} from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
import clsx from 'clsx';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';

import { appState } from '../../helpers/AppState';
import { useForceUpdate } from '../../helpers/forceUpdate';
import commonStyles from '../../styles/common.module.scss';
import { toast } from '../toast/toast';
import styles from './ProductCard.module.scss';

export const ProductCard = (props?: {
    data?: TProduct;
    attributes?: TAttribute[];
    className?: string;
    variant?: 'grid' | 'list';
}) => {
    const data = props?.data;
    const forceUpdate = useForceUpdate();
    const productLink = `/product/${data?.slug ?? data?.id}`;
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [imageHeigth, setImageHeigth] = useState<number | null>(null);
    const cstore = getCStore();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
    const product = props?.data;

    const item: TStoreListItem = {
        product: props?.data ?? undefined,
        pickedAttributes: {},
        amount: 1,
    }
    const inCart = cstore.isInCart(item);
    const inWishlist = cstore.isInWishlist({ product });
    const inCompare = cstore.isInCompare({ product });

    const onResize = useCallback(() => {
        // on resize logic
        if (wrapperRef && wrapperRef.current) {
            if (props?.variant === 'list') {
                setImageHeigth(wrapperRef.current.offsetHeight);
            }
        }
    }, []);

    useResizeDetector({
        handleHeight: false,
        refreshMode: 'debounce',
        refreshRate: 1000,
        onResize,
    });


    useEffect(() => {
        onResize();
        cstore.onCartUpdate(() => {
            forceUpdate();
        }, 'ProductActions');

        cstore.onWishlistUpdate(() => {
            if (inWishlist)
                forceUpdate();
        }, 'ProductActions');
    }, []);

    const handleAddToCart = () => {
        if (inCart) {
            appState.isCartOpen = true;
        } else {
            const result = cstore.addToCart(item, props?.attributes);
            if (result.success) {
                toast.success("Added! Click here to open cart", {
                    position: toast.POSITION.TOP_RIGHT,
                    onClick: () => {
                        appState.isCartOpen = true;
                    }
                });
            }
            if (result.code === 1) {
                toast.warn("Product is already in your cart!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            if (result.missingAttributes?.length) {
                toast.error(`Please pick following attributes: ${result.missingAttributes.map(attr => attr.key).join(', ')}`, {
                    position: toast.POSITION.TOP_RIGHT
                });
                appState.isQuickViewOpen = true;
                appState.quickViewProductId = product?.id;
            }
            forceUpdate();
        }
    }

    const handleAddToWishlist = () => {
        if (inWishlist) {
            const result = cstore.removeFromWishlist({ product });
            if (result.success) {
                toast.info("Removed", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        } else {
            const result = cstore.addToWishlist({ product });
            if (result.success) {
                toast.success("Added! Click here to open wishlist", {
                    position: toast.POSITION.TOP_RIGHT,
                    onClick: () => {
                        appState.isWishlistOpen = true;
                    }
                });
            }
            if (result.code === 1) {
                toast.warn("Product is already in your wishlist!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }
        forceUpdate();
    }

    const handleAddToCompare = () => {
        if (inCompare) {
            appState.isCompareOpen = true;
        } else {
            const hasBeenAdded = cstore.addToCompare({ product });
            if (hasBeenAdded) {
                toast.success("Added! Click here to compare", {
                    position: toast.POSITION.TOP_RIGHT,
                    onClick: () => {
                        appState.isCompareOpen = true;
                    }
                });
            } else {
                toast.warn("Product is already in your list!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            forceUpdate();
        }
    }

    return (
        <div className={clsx(styles.Product, commonStyles.onHoverLinkContainer,
            props?.className, (props?.variant === 'list' && !isMobile) ? styles.listVariant : null)}
            ref={wrapperRef}>
            <div className={styles.imageBlock}
                style={{ height: isMobile ? 'auto' : imageHeigth + 'px' }}
            >
                <Link href={productLink}>
                    <a><img className={styles.image} src={data?.mainImage} /></a>
                </Link>
            </div>
            <div className={styles.caption}>
                <div>
                    <Link href={productLink}>
                        <a className={clsx(styles.productName, commonStyles.onHoverLink)}>{data?.name}</a>
                    </Link>
                </div>
                {data?.description && (
                    <div className={styles.description}>
                        <div dangerouslySetInnerHTML={{ __html: data?.description }}></div>
                        <div className={styles.descriptionGradient}></div>
                    </div>
                )}
                <div className={styles.priceCartBlock}>
                    <div className={styles.priceBlock}>
                        {(data?.oldPrice !== undefined && data?.oldPrice !== null) && (
                            <p className={styles.oldPrice}>{cstore.getPriceWithCurrency(data.oldPrice)}</p>
                        )}
                        <p className={styles.price}>{cstore.getPriceWithCurrency(data?.price)}</p>
                    </div>
                </div>
                <div>
                    <Tooltip title={inCart ? 'Open cart' : 'Add to cart'}>
                        <IconButton onClick={handleAddToCart}
                        >{inCart ? <ShoppingCartIcon /> : <AddShoppingCartIcon />}</IconButton>
                    </Tooltip>
                    <Tooltip title="Add to wishlist">
                        <IconButton onClick={handleAddToWishlist}>{inWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}</IconButton>
                    </Tooltip>
                    <Tooltip title="Add to compare">
                        <IconButton onClick={handleAddToCompare}>
                            <EqualizerIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <div className={styles.ratingBlock}>
                    <Rating name="read-only" value={data?.rating?.average} precision={0.5} readOnly />
                    {((data?.rating?.reviewsNumber !== undefined && props?.variant === 'list' && data?.rating?.reviewsNumber && !isMobile) && (
                        <p className={styles.ratingCaption}>
                            {data?.rating?.average ? data?.rating?.average.toFixed(2) : ''} based on {data?.rating?.reviewsNumber} reviews.</p>
                    )) || null}
                </div>
            </div>

        </div>
    )
}
