import { EntityCustomFields } from '@components/entity/entityEdit/components/EntityCustomFields';
import { TOrder, TProduct, TStoreListItem } from '@cromwell/core';
import { getCStore, getGraphQLClient } from '@cromwell/core-frontend';
import { Close as CloseIcon, DeleteForever as DeleteForeverIcon } from '@mui/icons-material';
import { Box, Grid, IconButton, Skeleton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { TFieldsComponentProps } from '../../../components/entity/types';
import { AutocompleteInput } from '../../../components/inputs/AutocompleteInput';
import { TextInput } from '../../../components/inputs/TextInput/TextInput';
import { orderStatuses } from '../../../constants/order';
import { couponPageInfo, productPageInfo } from '../../../constants/PageInfos';
import { parseAddress } from '../../../helpers/addressParser';
import { useForceUpdate } from '../../../helpers/forceUpdate';
import { toLocaleDateTimeString } from '../../../helpers/time';
import styles from '../Order.module.scss';

export function PageContent(
  props: TFieldsComponentProps<TOrder> & {
    cstoreRef: React.MutableRefObject<ReturnType<typeof getCStore>>;
    dataRef: React.MutableRefObject<TOrder | null>;
    cartUpdatedRef: React.MutableRefObject<boolean>;
  },
) {
  const { cartUpdatedRef } = props;
  const forceUpdate = useForceUpdate();
  const cstore = props.cstoreRef.current;
  const cart = cstore.getCart();
  const [data, setData] = useState<TOrder | null>(props.entityData);
  const [cartLoading, setCartLoading] = useState<boolean>(false);
  const [cartProducts, setCartProducts] = useState<TProduct[]>([]);
  const location = useLocation();

  const cartInfo = cstore.getCartTotal();
  const updatedCartTotal = cartInfo.total ?? 0;
  const updatedOrderTotalPrice = parseFloat((updatedCartTotal + (data?.shippingPrice ?? 0)).toFixed(2));

  // Support old and new address format
  const { addressString, addressJson } = parseAddress(data?.customerAddress);

  useEffect(() => {
    updateCart(props.entityData);
    props.dataRef.current = props.entityData;
  }, [props.entityData]);

  const updateCart = async (order: TOrder) => {
    setCartLoading(true);
    let oldCart = order.cart;
    if (typeof oldCart === 'string') {
      try {
        oldCart = JSON.parse(oldCart);
      } catch (e) {
        console.error(e);
      }
    }
    if (!Array.isArray(oldCart) || oldCart.length === 0) {
      oldCart = [];
    }

    oldCart.forEach((product) => cstore.addToCart(product));

    if (order?.coupons?.length) {
      cstore.setCoupons(order.coupons);
    }

    const cart = cstore.getCart();
    const client = getGraphQLClient();

    const products = (
      await Promise.all(
        cart.map(async (item) => {
          if (!item.product?.id) return;
          return client.getProductById(item.product.id).catch(console.error);
        }),
      )
    ).filter(Boolean) as TProduct[];

    setCartProducts(products);
    setCartLoading(false);
    return cart;
  };

  const handleDeleteFromCart = (item: TStoreListItem) => {
    cstore.removeFromCart(item);
    cartUpdatedRef.current = true;
    forceUpdate();
  };

  const handleInputChange = (prop: keyof TOrder, val: any) => {
    if (data) {
      setData((prevData) => {
        const newData = Object.assign({}, prevData);
        (newData[prop] as any) = val;
        props.dataRef.current = newData;
        return newData;
      });
    }
  };

  const onPriceChange = (value: string) => {
    let newPrice = Number(value);
    if (!value) newPrice = 0;
    if (!isNaN(newPrice)) {
      cartUpdatedRef.current = true;
      handleInputChange('shippingPrice', newPrice);
    }
  };

  return (
    <div className={styles.OrderPage}>
      <div className={styles.content}>
        <div className={styles.fields}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <AutocompleteInput
                value={data?.status ?? orderStatuses[0]}
                onChange={(event: any, newValue: string | null) => {
                  handleInputChange('status', newValue);
                }}
                classes={{ paper: styles.popper }}
                options={orderStatuses}
                getOptionLabel={(option) => option}
                className={styles.textField}
                label="Status"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextInput
                label="Name"
                value={data?.customerName || ''}
                className={styles.textField}
                onChange={(e) => {
                  handleInputChange('customerName', e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextInput
                label="Phone"
                value={data?.customerPhone || ''}
                className={styles.textField}
                onChange={(e) => {
                  handleInputChange('customerPhone', e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextInput
                label="Email"
                value={data?.customerEmail || ''}
                className={styles.textField}
                onChange={(e) => {
                  handleInputChange('customerEmail', e.target.value);
                }}
              />
            </Grid>
            {!addressJson && (
              <Grid item xs={12} sm={12}>
                <TextInput
                  label="Address"
                  value={addressString || ''}
                  className={styles.textField}
                  onChange={(e) => {
                    handleInputChange('customerAddress', e.target.value);
                  }}
                />
              </Grid>
            )}
            {addressJson &&
              Object.entries<any>(addressJson).map(([fieldKey, value]) => {
                return (
                  <Grid item xs={12} sm={6} key={fieldKey}>
                    <TextInput
                      label={fieldKey}
                      value={value || ''}
                      className={styles.textField}
                      onChange={(e) => {
                        const newVal = e.target.value;
                        handleInputChange(
                          'customerAddress',
                          JSON.stringify({
                            ...addressJson,
                            [fieldKey]: newVal,
                          }),
                        );
                      }}
                    />
                  </Grid>
                );
              })}
            <Grid item xs={12} sm={12}>
              <TextInput
                label="Comment"
                value={data?.customerComment || ''}
                className={styles.textField}
                onChange={(e) => {
                  handleInputChange('customerComment', e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextInput label="Payment method" disabled value={data?.paymentMethod} className={styles.textField} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextInput label="Shipping method" disabled value={data?.shippingMethod} className={styles.textField} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextInput
                label="Shipping price"
                value={data?.shippingPrice ?? 0}
                className={styles.textField}
                type="currency"
                onChange={(e) => onPriceChange(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}></Grid>
            <Grid item xs={12} sm={6}>
              <TextInput
                label="Created"
                value={toLocaleDateTimeString(data?.createDate)}
                className={styles.textField}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextInput
                label="Last updated"
                value={toLocaleDateTimeString(data?.updateDate)}
                className={styles.textField}
                disabled
              />
            </Grid>
            <EntityCustomFields />
          </Grid>
        </div>
        {!!cstore.getCoupons()?.length && (
          <div className={styles.fields}>
            <p>Applied coupons</p>
            {cstore.getCoupons().map((coupon) => (
              <Box key={coupon.id} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Link to={`${couponPageInfo.baseRoute}/${coupon.id}`}>
                  <Box
                    sx={{
                      mr: 2,
                      border: '1px dashed #222',
                      py: '5px',
                      px: '10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    {coupon.code}
                  </Box>
                </Link>
                {coupon.discountType === 'fixed' && <Box>{cstore.getPriceWithCurrency(coupon.value)}</Box>}
                {coupon.discountType === 'percentage' && <Box>{coupon.value}%</Box>}
                <IconButton
                  sx={{ ml: 2 }}
                  onClick={() => {
                    cstore.setCoupons(cstore.getCoupons().filter((c) => c.id !== coupon.id));
                    cartUpdatedRef.current = true;
                    forceUpdate();
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ))}
          </div>
        )}
        <div className={styles.sums}>
          {data && !cartLoading && (
            <>
              <p>
                Cart total:{' '}
                <b>{cstore.getPriceWithCurrency(cartUpdatedRef.current ? updatedCartTotal : data.cartTotalPrice)}</b>
              </p>
              <p>
                Shipping: <b>{cstore.getPriceWithCurrency(data.shippingPrice ?? 0)}</b>
              </p>
              <p>
                Order total:{' '}
                <b>
                  {cstore.getPriceWithCurrency(cartUpdatedRef.current ? updatedOrderTotalPrice : data.orderTotalPrice)}
                </b>
              </p>
            </>
          )}
          {cartLoading &&
            Array(4)
              .fill(1)
              .map((it, index) => <Skeleton style={{ marginBottom: '3px' }} key={index} height={'20px'} />)}
        </div>
        <div className={styles.cart}>
          {!cartLoading &&
            cart?.map((it, i) => {
              const product = Object.assign(
                {},
                cartProducts.find((p) => p.id === it?.product?.id),
                it.product,
              );
              const checkedAttrKeys = Object.keys(it.pickedAttributes || {});
              if (product) {
                const productLink = `${productPageInfo.baseRoute}/${product.id}`;
                return (
                  <Grid key={i} className={styles.cartItem} container>
                    <Grid item xs={1} className={styles.itemBlock}>
                      <Link to={productLink} state={{ prevRoute: location.pathname + location.search }}>
                        <img src={product.mainImage} className={styles.mainImage} />
                      </Link>
                    </Grid>
                    <Grid item xs={4}>
                      <div className={styles.itemBlock}>
                        <Link
                          className={styles.productName}
                          to={productLink}
                          state={{ prevRoute: location.pathname + location.search }}
                        >
                          {product.name}
                        </Link>
                        <div className={styles.priceBlock}>
                          {product?.oldPrice !== undefined && product?.oldPrice !== null && (
                            <p className={styles.oldPrice}>{cstore.getPriceWithCurrency(product.oldPrice)}</p>
                          )}
                          <p className={styles.price}>{cstore.getPriceWithCurrency(product?.price)}</p>
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={3} className={styles.itemBlock}>
                      <div className={styles.itemBlock}>
                        {checkedAttrKeys.map((key) => {
                          const vals = it.pickedAttributes ? it.pickedAttributes[key] : [];
                          const valsStr = vals.join(', ');
                          return (
                            <p key={key}>
                              {key}: {valsStr}
                            </p>
                          );
                        })}
                      </div>
                    </Grid>
                    <Grid item xs={2} className={styles.itemBlock}>
                      <div className={styles.itemBlock}>
                        <p>Qty: {it.amount ?? 1}</p>
                      </div>
                    </Grid>
                    <Grid item xs={1} className={styles.itemBlock} style={{ marginLeft: 'auto', paddingRight: '0px' }}>
                      <div className={styles.itemBlock}>
                        <IconButton
                          aria-label="Delete"
                          onClick={() => {
                            handleDeleteFromCart(it);
                          }}
                        >
                          <DeleteForeverIcon />
                        </IconButton>
                      </div>
                    </Grid>
                  </Grid>
                );
              }
            })}
          {cartLoading &&
            Array(2)
              .fill(1)
              .map((it, index) => <Skeleton style={{ margin: '0 20px 5px 20px' }} key={index} height={'60px'} />)}
        </div>
      </div>
    </div>
  );
}
