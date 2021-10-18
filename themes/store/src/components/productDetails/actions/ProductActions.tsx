import { TAttribute, TProduct, TStoreListItem } from '@cromwell/core';
import { getCStore, ProductAttributes } from '@cromwell/core-frontend';
import { Button, IconButton, Input } from '@material-ui/core';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { appState } from '../../../helpers/AppState';
import { useForceUpdate } from '../../../helpers/forceUpdate';
import commonStyles from '../../../styles/common.module.scss';
import { AddIcon, AddShoppingCartIcon, FavoriteIcon, RemoveIcon, ShoppingCartIcon } from '../../icons';
import { toast } from '../../toast/toast';
import styles from './ProductActions.module.scss';

// import { EqualizerIcon } from '../icons';

export const ProductActions = (props: {
    product: TProduct;
    attributes?: TAttribute[];
    onAttrChange: (attrs: any, modified: any) => void;
}) => {
    const forceUpdate = useForceUpdate();
    const [amount, setAmount] = useState(1);
    const [canValidate, setCanValidate] = useState(false);
    const [pickedAttributes, setPickedAttributes] = useState<Record<string, string[]>>({});
    const { product, attributes } = props;
    const item: TStoreListItem = {
        product: product ?? undefined,
        pickedAttributes: pickedAttributes,
        amount,
    };
    const cstore = getCStore();
    const inCart = cstore.isInCart(item);
    const sameQntInCart = cstore.hasSameQntInCart(item);
    const inWishlist = cstore.isInWishlist({ product });
    // const inCompare = cstore.isInCompare({ product });

    useEffect(() => {
        cstore.onCartUpdate(() => {
            forceUpdate();
        }, 'ProductActions');
    }, []);

    const handleAddToCart = () => {
        if (inCart) {
            if (sameQntInCart) {
                appState.isCartOpen = true;
            } else {
                cstore.updateQntInCart(item);
                forceUpdate();
            }
        } else {
            const result = cstore.addToCart(item, attributes);
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
                setCanValidate(true);
            }
            forceUpdate();
        }
    }

    const handleAddToWishlist = () => {
        if (inWishlist) {
            appState.isWishlistOpen = true;
        } else {
            const hasBeenAdded = cstore.addToWishlist({ product });
            if (hasBeenAdded) {
                toast.success("Added! Click here to open wishlist", {
                    position: toast.POSITION.TOP_RIGHT,
                    onClick: () => {
                        appState.isWishlistOpen = true;
                    }
                });
            } else {
                toast.warn("Product is already in your wishlist!", {
                    position: toast.POSITION.TOP_RIGHT
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

    return (
        <div className={styles.ProductActions}>
            <div className={clsx(styles.productAttributesBlock, canValidate && styles.validateAttributes)}>
                {product && props.attributes && (
                    <ProductAttributes
                        attributes={props.attributes}
                        product={product}
                        onChange={(attrs, modified) => {
                            props.onAttrChange(attrs, modified);
                            setPickedAttributes(attrs);
                        }}
                        elements={{
                            attributeValue: (attrProps) => {
                                let isValid = true;
                                if (attrProps.attribute?.required) {
                                    if (!pickedAttributes || !pickedAttributes[attrProps.attribute.key]
                                        || !pickedAttributes[attrProps.attribute.key].length)
                                        isValid = false;
                                }

                                return (
                                    <Button
                                        onClick={attrProps.onClick}
                                        aria-label={`Attribute ${attrProps?.attribute?.key} - value: ${attrProps?.value}`}
                                        variant={attrProps.isChecked ? 'contained' : 'outlined'}
                                        className={clsx(styles.attrValue, !isValid && styles.invalidAttrValue,
                                            attrProps.isChecked && styles.attrValueChecked)}
                                    >
                                        {attrProps.icon && (
                                            <div
                                                style={{ backgroundImage: `url(${attrProps.icon}` }}
                                                className={styles.attrValueIcon}></div>
                                        )}
                                        <p className={styles.attrValueText} style={{ textTransform: 'none' }}>{attrProps.value}</p>
                                    </Button>
                                )
                            },
                            attributeTitle: (props) => {
                                let isValid = true;
                                if (props.attribute?.required) {
                                    if (!pickedAttributes || !pickedAttributes[props.attribute.key]
                                        || !pickedAttributes[props.attribute.key].length)
                                        isValid = false;
                                }
                                return <p className={clsx(styles.attrTitle, !isValid && styles.invalidAttrTitle)}>{props.attribute?.key}</p>
                            }
                        }}
                    />
                )}
            </div>
            <div className={styles.cartAndAMountBlock}>
                <Button
                    onClick={handleAddToCart}
                    variant="contained"
                    color="primary"
                    size="large"
                    className={clsx(styles.actionButton, commonStyles.button)}
                    startIcon={inCart ? <ShoppingCartIcon /> : <AddShoppingCartIcon />}
                >{inCart ? sameQntInCart ? 'Open cart' : 'Update qty' : 'Add to cart'}</Button>
                <div className={styles.amountPicker}>
                    <Input
                        className={styles.amountInput}
                        value={amount}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val && !isNaN(val) && val > 0) setAmount(val)
                        }}
                        startAdornment={
                            <IconButton
                                aria-label="Decrease amount"
                                onClick={() => {
                                    if (amount > 1) {
                                        setAmount(amount - 1)
                                    }
                                }}
                            >
                                <RemoveIcon />
                            </IconButton>
                        }
                        endAdornment={
                            <IconButton
                                aria-label="Increase amount"
                                onClick={() => {
                                    setAmount(amount + 1)
                                }}
                            >
                                <AddIcon />
                            </IconButton>
                        }
                    />
                </div>
            </div>
            <div>
                <Button
                    onClick={handleAddToWishlist}
                    variant="outlined"
                    color="primary"
                    size="large"
                    className={clsx(styles.actionButton, commonStyles.button)}
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
            </div>

        </div>
    )
}