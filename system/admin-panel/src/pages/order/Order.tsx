import { TOrder, TOrderInput, TStoreListItem } from '@cromwell/core';
import { getGraphQLClient, getCStore } from '@cromwell/core-frontend';
import { Button, TextField, IconButton, Grid } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderListPageInfo, productPageInfo } from '../../constants/PageInfos';
import { DeleteForever as DeleteForeverIcon, ExpandMore as ExpandMoreIcon, WarningRounded as WarningRoundedIcon } from '@material-ui/icons';
import { toast } from '../../components/toast/toast';
import styles from './Order.module.scss';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import NumberFormat from 'react-number-format';
import { orderStatuses } from '../../constants/order';

const OrderPage = () => {
    const { id: orderId } = useParams<{ id: string }>();
    const client = getGraphQLClient();
    const [data, setData] = useState<TOrder | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [cart, setCart] = useState<TStoreListItem[]>([]);
    const [cartLoading, setCartLoading] = useState<boolean>(false);
    const [orderLoading, setOrderLoading] = useState<boolean>(false);
    const cstore = getCStore();

    const getOrderData = async () => {
        let orderData: TOrder;
        setOrderLoading(true);
        setCartLoading(true);
        try {
            orderData = await client.getOrderById(orderId);
            if (orderData) {
                setData(orderData);
                updateCart(orderData.cart);
            }
        } catch (e) {
            console.error(e)
        }
        setOrderLoading(false);

        if (!orderData) {
            setNotFound(true);
        }
    }

    const updateCart = async (oldCart: TOrder['cart']) => {
        if (typeof oldCart === 'string') {
            try {
                oldCart = JSON.parse(oldCart);
            } catch (e) { console.error(e); }
        }
        if (!Array.isArray(oldCart) || oldCart.length === 0) {
            setCart([]);
            return;
        }
        oldCart.forEach(product => cstore.addToCart(product));
        setCartLoading(true);

        await cstore.updateCart();
        const cart = cstore.getCart();
        setCart(cart);
        setCartLoading(false);
    }

    const handleDeleteFromCart = (item: TStoreListItem) => {
        cstore.removeFromCart(item);
        setCart(cstore.getCart());
    }

    useEffect(() => {
        cstore.clearCart();

        getOrderData();

        return () => {
            cstore.clearCart();
        }
    }, []);

    const handleSave = async () => {
        if (data) {
            const inputData: TOrderInput = {
                status: data.status,
                cart: JSON.stringify(cart),
                orderTotalPrice: data.orderTotalPrice,
                cartTotalPrice: data.cartTotalPrice,
                cartOldTotalPrice: data.cartOldTotalPrice,
                deliveryPrice: data.deliveryPrice,
                totalQnt: data.totalQnt,
                userId: data.userId,
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                customerAddress: data.customerAddress,
                customerComment: data.customerComment,
                shippingMethod: data.shippingMethod,
            }
            try {
                await client?.updateOrder(data.id, inputData);
                await getOrderData();
                toast.success('Saved!');
            } catch (e) {
                toast.error('Falied to save');
                console.error(e)
            }
        }
    }

    const handleInputChange = (prop: keyof TOrder, val: any) => {
        if (data) {
            const newData = Object.assign({}, data);
            (newData[prop] as any) = val;
            setData(newData);
        }
    }

    if (notFound) {
        return (
            <div className={styles.OrderPage}>
                <div className={styles.notFoundPage}>
                    <p className={styles.notFoundText}>Post not found</p>
                </div>
            </div>
        )
    }

    const cartInfo = cstore.getCartTotal();
    const cartNewTotal = cartInfo.total;
    const cartNewTotalOldPrice = cartInfo.totalOld;
    const cartAmount = cartInfo.amount
    const orderTotalPriceRecalc = (data?.cartTotalPrice ?? 0) + (data?.deliveryPrice ?? 0);

    return (
        <div className={styles.OrderPage}>
            <div className={styles.header}>
                <div>
                    <Link to={orderListPageInfo.route}>
                        <IconButton
                        >
                            <ArrowBackIcon />
                        </IconButton>
                    </Link>
                </div>
                <div className={styles.headerActions}>
                    <Button variant="contained" color="primary"
                        className={styles.saveBtn}
                        size="small"
                        onClick={handleSave}>Update</Button>
                </div>
            </div>
            <div className={styles.fields}>
                {orderLoading && (
                    Array(8).fill(1).map((it, index) => (
                        <Skeleton style={{ marginBottom: '10px' }} key={index} height={"50px"} />
                    ))
                )}
                {!orderLoading && (
                    <>
                        <Autocomplete
                            value={data?.status ?? orderStatuses[0]}
                            onChange={(event: any, newValue: string | null) => {
                                handleInputChange('status', newValue);
                            }}
                            options={orderStatuses}
                            getOptionLabel={(option) => option}
                            className={styles.textField}
                            fullWidth
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params}
                                label="Status"
                                fullWidth
                            />}
                        />
                        <TextField label="Name"
                            value={data?.customerName || ''}
                            fullWidth
                            className={styles.textField}
                            onChange={(e) => { handleInputChange('customerName', e.target.value) }}
                        />
                        <TextField label="Phone"
                            value={data?.customerPhone || ''}
                            fullWidth
                            className={styles.textField}
                            onChange={(e) => { handleInputChange('customerPhone', e.target.value) }}
                        />
                        <TextField label="Address"
                            value={data?.customerAddress || ''}
                            fullWidth
                            className={styles.textField}
                            onChange={(e) => { handleInputChange('customerAddress', e.target.value) }}
                        />
                        <TextField label="Comment"
                            value={data?.customerComment || ''}
                            fullWidth
                            className={styles.textField}
                            onChange={(e) => { handleInputChange('customerComment', e.target.value) }}
                        />
                        <TextField label="Delivery price"
                            value={data?.deliveryPrice ?? 0}
                            className={styles.textField}
                            onChange={(e) => {
                                let newPrice = parseInt(e.target.value);
                                if (isNaN(newPrice)) newPrice = 0;
                                handleInputChange('deliveryPrice', newPrice);
                            }}
                            fullWidth
                            InputProps={{
                                inputComponent: NumberFormatCustom as any,
                            }}
                        />
                        <TextField label="Created"
                            value={toLocaleDateString(data?.createDate)}
                            fullWidth
                            className={styles.textField}
                        />
                        <TextField label="Last updated"
                            value={toLocaleDateString(data?.updateDate)}
                            fullWidth
                            className={styles.textField}
                        />
                    </>
                )}
            </div>
            <div className={styles.sums}>
                {!cartLoading && data && (
                    <>
                        <p>Cart total: <b>{cstore.getPriceWithCurrency(data.cartTotalPrice)}</b></p>
                        <p>Delivery: <b>{cstore.getPriceWithCurrency(data.deliveryPrice)}</b></p>
                        <p>{data.orderTotalPrice !== orderTotalPriceRecalc ? 'Initial ' : ''}Order total: <b>{cstore.getPriceWithCurrency(data.orderTotalPrice)}</b></p>
                        {data.orderTotalPrice !== orderTotalPriceRecalc && (
                            <p>Order total: <b>{cstore.getPriceWithCurrency(orderTotalPriceRecalc)}</b></p>
                        )}
                        {(cartNewTotal !== data.cartTotalPrice) && (
                            <div className={styles.totalChangedBlock}>
                                <div className={styles.totalChangedWarning}>
                                    <WarningRoundedIcon />
                                    <p style={{ margin: '0 0 0 5px' }}>Price has changed for some products since this order was created!</p>
                                </div>
                                <p>Updated cart total: <b>{cstore.getPriceWithCurrency(cartNewTotal)}</b></p>
                                <p>Updated order total: <b>{cstore.getPriceWithCurrency(cartNewTotal + (data.deliveryPrice ?? 0))}</b></p>
                            </div>
                        )}
                    </>
                )}
                {cartLoading && (
                    Array(4).fill(1).map((it, index) => (
                        <Skeleton style={{ marginBottom: '3px' }} key={index} height={"20px"} />
                    ))
                )}
            </div>
            <div className={styles.cart}>
                {!cartLoading && cart.map((it, i) => {
                    const product = it.product;
                    const checkedAttrKeys = Object.keys(it.pickedAttributes || {});
                    if (product) {
                        const productLink = `${productPageInfo.baseRoute}/${product.id}`;
                        return (
                            <Grid key={i} className={styles.cartItem} container>
                                <Grid item xs={3} className={styles.itemBlock}>
                                    <Link to={productLink}>
                                        <img src={product.mainImage} className={styles.mainImage} />
                                    </Link>
                                </Grid>
                                <Grid item xs={3} className={styles.itemBlock}>
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
                {cartLoading && (
                    Array(2).fill(1).map((it, index) => (
                        <Skeleton style={{ margin: '0 20px 5px 20px' }} key={index} height={"60px"} />
                    ))
                )}
            </div>
        </div>
    )
}


export default OrderPage;

const toLocaleDateString = (date: Date | string | undefined) => {
    if (!date) return '';
    if (typeof date === 'string') date = new Date(date);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}


interface NumberFormatCustomProps {
    inputRef: (instance: NumberFormat | null) => void;
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

function NumberFormatCustom(props: NumberFormatCustomProps) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            isNumericString
            prefix={getCStore().getActiveCurrencySymbol()}
        />
    );
}