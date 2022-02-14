import { gql } from '@apollo/client';
import { TOrder, TOrderInput, TStoreListItem } from '@cromwell/core';
import { getCStore, getGraphQLClient } from '@cromwell/core-frontend';
import { ArrowBack as ArrowBackIcon, Close as CloseIcon, DeleteForever as DeleteForeverIcon } from '@mui/icons-material';
import { Autocomplete, Box, Button, Grid, IconButton, Skeleton, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { toast } from '../../components/toast/toast';
import { orderStatuses } from '../../constants/order';
import { couponPageInfo, productPageInfo } from '../../constants/PageInfos';
import { parseAddress } from '../../helpers/addressParser';
import { useForceUpdate } from '../../helpers/forceUpdate';
import { NumberFormatCustom } from '../../helpers/NumberFormatCustom';
import { toLocaleDateTimeString } from '../../helpers/time';
import commonStyles from '../../styles/common.module.scss';
import styles from './Order.module.scss';

const OrderPage = () => {
    const { id: orderId } = useParams<{ id: string }>();
    const client = getGraphQLClient();
    const [data, setData] = useState<TOrder | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [isCartUpdated, setIsCartUpdated] = useState(false);
    const [orderLoading, setOrderLoading] = useState<boolean>(false);
    const forceUpdate = useForceUpdate();
    const cstoreRef = useRef(getCStore({ local: true }));
    const cstore = cstoreRef.current;
    const cart = cstore.getCart();

    const cartInfo = cstore.getCartTotal();
    const updatedCartTotal = cartInfo.total ?? 0;
    const updatedOrderTotalPrice = parseFloat((updatedCartTotal +
        (data?.shippingPrice ?? 0)).toFixed(2));

    // Support old and new address format
    const { addressString, addressJson } = parseAddress(data?.customerAddress);

    useEffect(() => {
        getOrderData();
    }, []);

    const getOrderData = async () => {
        let orderData: TOrder;
        setOrderLoading(true);
        try {
            orderData = await client.getOrderById(parseInt(orderId), gql`
            fragment AdminOrderFragment on Order {
                ...OrderFragment
                coupons {
                    ...CouponFragment
                }
            }
            ${client.CouponFragment}
            ${client.OrderFragment}
        `, 'AdminOrderFragment');
            if (orderData) {
                setData(orderData);
                updateCart(orderData);
            }
        } catch (e) {
            console.error(e)
        }
        setOrderLoading(false);

        if (!orderData) {
            setNotFound(true);
        }
    }

    const updateCart = async (order: TOrder) => {
        let oldCart = order.cart;
        if (typeof oldCart === 'string') {
            try {
                oldCart = JSON.parse(oldCart);
            } catch (e) { console.error(e); }
        }
        if (!Array.isArray(oldCart) || oldCart.length === 0) {
            oldCart = [];
        }

        oldCart.forEach(product => cstore.addToCart(product));

        if (order?.coupons?.length) {
            cstore.setCoupons(order.coupons);
        }

        const cart = cstore.getCart();
        return cart;
    }

    const handleDeleteFromCart = (item: TStoreListItem) => {
        cstore.removeFromCart(item);
        setIsCartUpdated(true);
        forceUpdate();
    }

    const handleSave = async () => {
        if (data) {
            const inputData: TOrderInput = {
                status: data.status,
                cart: JSON.stringify(cart),
                orderTotalPrice: isCartUpdated ? updatedOrderTotalPrice : data.orderTotalPrice,
                cartTotalPrice: isCartUpdated ? updatedCartTotal : data.cartTotalPrice,
                cartOldTotalPrice: data.cartOldTotalPrice,
                shippingPrice: data.shippingPrice,
                totalQnt: data.totalQnt,
                userId: data.userId,
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                customerEmail: data.customerEmail,
                customerAddress: data.customerAddress,
                customerComment: data.customerComment,
                shippingMethod: data.shippingMethod,
                paymentMethod: data.paymentMethod,
                currency: data.currency,
                couponCodes: cstore.getCoupons()?.map(c => c.code) ?? [],
            }
            try {
                await client?.updateOrder(data.id, inputData);
                await getOrderData();
                toast.success('Saved!');
            } catch (e) {
                toast.error('Failed to save');
                console.error(e)
            }
        }
    }

    const handleInputChange = (prop: keyof TOrder, val: any) => {
        if (data) {
            setData((prevData) => {
                const newData = Object.assign({}, prevData);
                (newData[prop] as any) = val;
                return newData;
            });
        }
    }

    if (notFound) {
        return (
            <div className={styles.OrderPage}>
                <div className={styles.notFoundPage}>
                    <p className={styles.notFoundText}>Order not found</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.OrderPage}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <IconButton
                        onClick={() => window.history.back()}
                    >
                        <ArrowBackIcon style={{ fontSize: '18px' }} />
                    </IconButton>
                    <p className={commonStyles.pageTitle}>order</p>
                </div>
                <div className={styles.headerActions}>
                    <Button variant="contained" color="primary"
                        className={styles.saveBtn}
                        size="small"
                        onClick={handleSave}>Update</Button>
                </div>
            </div>
            <div className={styles.content}>

                <div className={styles.fields}>
                    {orderLoading && (
                        Array(8).fill(1).map((it, index) => (
                            <Skeleton style={{ marginBottom: '10px' }} key={index} height={"50px"} />
                        ))
                    )}
                    {!orderLoading && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    value={data?.status ?? orderStatuses[0]}
                                    onChange={(event: any, newValue: string | null) => {
                                        handleInputChange('status', newValue);
                                    }}
                                    classes={{ paper: styles.popper }}
                                    options={orderStatuses}
                                    getOptionLabel={(option) => option}
                                    className={styles.textField}
                                    fullWidth
                                    renderInput={(params) => <TextField {...params}
                                        label="Status"
                                        variant="standard"
                                        fullWidth
                                    />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Name"
                                    value={data?.customerName || ''}
                                    fullWidth
                                    variant="standard"
                                    className={styles.textField}
                                    onChange={(e) => { handleInputChange('customerName', e.target.value) }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Phone"
                                    value={data?.customerPhone || ''}
                                    fullWidth
                                    variant="standard"
                                    className={styles.textField}
                                    onChange={(e) => { handleInputChange('customerPhone', e.target.value) }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Email"
                                    value={data?.customerEmail || ''}
                                    fullWidth
                                    variant="standard"
                                    className={styles.textField}
                                    onChange={(e) => { handleInputChange('customerEmail', e.target.value) }}
                                />
                            </Grid>
                            {!addressJson && (
                                <Grid item xs={12} sm={12}>
                                    <TextField label="Address"
                                        value={addressString || ''}
                                        fullWidth
                                        variant="standard"
                                        className={styles.textField}
                                        onChange={(e) => { handleInputChange('customerAddress', e.target.value) }}
                                    />
                                </Grid>
                            )}
                            {addressJson && (
                                Object.entries<any>(addressJson).map(([fieldKey, value]) => {
                                    return (
                                        <Grid item xs={12} sm={6} key={fieldKey}>
                                            <TextField label={fieldKey}
                                                value={value || ''}
                                                fullWidth
                                                variant="standard"
                                                className={styles.textField}
                                                onChange={(e) => {
                                                    const newVal = e.target.value;
                                                    handleInputChange('customerAddress', JSON.stringify({
                                                        ...addressJson,
                                                        [fieldKey]: newVal,
                                                    }))
                                                }}
                                            />
                                        </Grid>
                                    )
                                }))}
                            <Grid item xs={12} sm={12}>
                                <TextField label="Comment"
                                    value={data?.customerComment || ''}
                                    fullWidth
                                    variant="standard"
                                    className={styles.textField}
                                    onChange={(e) => { handleInputChange('customerComment', e.target.value) }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Payment method"
                                    disabled
                                    value={data?.paymentMethod}
                                    fullWidth
                                    variant="standard"
                                    className={styles.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Shipping method"
                                    disabled
                                    value={data?.shippingMethod}
                                    fullWidth
                                    variant="standard"
                                    className={styles.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Shipping price"
                                    value={data?.shippingPrice ?? 0}
                                    className={styles.textField}
                                    variant="standard"
                                    onChange={(e) => {
                                        let newPrice = Number(e.target.value);
                                        if (!e.target.value) newPrice = 0;
                                        if (!isNaN(newPrice)) handleInputChange('shippingPrice',
                                            newPrice);
                                        setIsCartUpdated(true);
                                    }}
                                    fullWidth
                                    InputProps={{
                                        inputComponent: NumberFormatCustom as any,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Created"
                                    value={toLocaleDateTimeString(data?.createDate)}
                                    fullWidth
                                    variant="standard"
                                    className={styles.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Last updated"
                                    value={toLocaleDateTimeString(data?.updateDate)}
                                    fullWidth
                                    variant="standard"
                                    className={styles.textField}
                                />
                            </Grid>
                        </Grid>
                    )}
                </div>
                {!!cstore.getCoupons()?.length && (
                    <div className={styles.fields}>
                        <p>Applied coupons</p>
                        {cstore.getCoupons().map(coupon => (
                            <Box key={coupon.id}
                                sx={{ display: 'flex', alignItems: 'center', mt: 2, }}
                            >
                                <Link to={`${couponPageInfo.baseRoute}/${coupon.id}`} >
                                    <Box sx={{ mr: 2, border: '1px dashed #222', py: '5px', px: '10px', borderRadius: '6px', cursor: 'pointer' }}
                                    >{coupon.code}</Box>
                                </Link>
                                {coupon.discountType === 'fixed' && (
                                    <Box>{cstore.getPriceWithCurrency(coupon.value)}</Box>
                                )}
                                {coupon.discountType === 'percentage' && (
                                    <Box>{coupon.value}%</Box>
                                )}
                                <IconButton onClick={() => {
                                    cstore.setCoupons(cstore.getCoupons()
                                        .filter(c => c.id !== coupon.id));
                                    setIsCartUpdated(true);
                                    forceUpdate();
                                }}
                                    sx={{ ml: 2 }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        ))}
                    </div>
                )}
                <div className={styles.sums}>
                    {!orderLoading && data && (
                        <>
                            <p>Cart total: <b>{cstore.getPriceWithCurrency(isCartUpdated ?
                                updatedCartTotal : data.cartTotalPrice)}</b></p>
                            <p>Shipping: <b>{cstore.getPriceWithCurrency(data.shippingPrice ?? 0)}</b></p>
                            <p>Order total: <b>{cstore.getPriceWithCurrency(isCartUpdated ?
                                updatedOrderTotalPrice : data.orderTotalPrice)}</b></p>
                        </>
                    )}
                    {orderLoading && (
                        Array(4).fill(1).map((it, index) => (
                            <Skeleton style={{ marginBottom: '3px' }} key={index} height={"20px"} />
                        ))
                    )}
                </div>
                <div className={styles.cart}>
                    {!orderLoading && cart.map((it, i) => {
                        const product = it.product;
                        const checkedAttrKeys = Object.keys(it.pickedAttributes || {});
                        if (product) {
                            const productLink = `${productPageInfo.baseRoute}/${product.id}`;
                            return (
                                <Grid key={i} className={styles.cartItem} container>
                                    <Grid item xs={2} className={styles.itemBlock}>
                                        <Link to={productLink}>
                                            <img src={product.mainImage} className={styles.mainImage} />
                                        </Link>
                                    </Grid>
                                    <Grid item xs={4} className={styles.itemBlock}>
                                        <Link to={productLink} className={styles.productName}>{product.name}</Link>
                                        <div className={styles.priceBlock}>
                                            {(product?.oldPrice !== undefined && product?.oldPrice !== null) && (
                                                <p className={styles.oldPrice}>{cstore.getPriceWithCurrency(product.oldPrice)}</p>
                                            )}
                                            <p className={styles.price}>{cstore.getPriceWithCurrency(product?.price)}</p>
                                        </div>
                                    </Grid>
                                    <Grid item xs={3} className={styles.itemBlock}>
                                        {checkedAttrKeys.map(key => {
                                            const vals = it.pickedAttributes ? it.pickedAttributes[key] : [];
                                            const valsStr = vals.join(', ');
                                            return <p key={key}>{key}: {valsStr}</p>
                                        })}
                                    </Grid>
                                    <Grid item xs={2} className={styles.itemBlock}>
                                        <p>Qty: {it.amount}</p>
                                    </Grid>
                                    <Grid item xs={1} className={styles.itemBlock} style={{ marginLeft: 'auto', paddingRight: '0px' }}>
                                        <div>
                                            <IconButton
                                                aria-label="Delete"
                                                onClick={() => { handleDeleteFromCart(it); }}
                                            >
                                                <DeleteForeverIcon />
                                            </IconButton>
                                        </div>
                                    </Grid>
                                </Grid>
                            )
                        }
                    })}
                    {orderLoading && (
                        Array(2).fill(1).map((it, index) => (
                            <Skeleton style={{ margin: '0 20px 5px 20px' }} key={index} height={"60px"} />
                        ))
                    )}
                </div>
            </div>
        </div >
    )
}


export default OrderPage;
