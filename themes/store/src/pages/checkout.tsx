import {
    getStoreItem,
    onStoreChange,
    removeOnStoreChange,
    setStoreItem,
    TCromwellPage,
    TOrder,
    TUser,
    isServer,
} from '@cromwell/core';
import { getCStore, getRestAPIClient, LoadBox } from '@cromwell/core-frontend';
import {
    Button,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Tooltip,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';

import Layout from '../components/layout/Layout';
import SignInModal, { TFromType } from '../components/modals/signIn/SignIn';
import { CartProductList } from '../components/productList/CartProductList';
import { toast } from '../components/toast/toast';
import { useForceUpdate } from '../helpers/forceUpdate';
import commonStyles from '../styles/common.module.scss';
import styles from '../styles/pages/Checkout.module.scss';

type PaymentStatus = 'cancelled' | 'success';

const CheckoutPage: TCromwellPage = () => {
    if (!isServer()) {
        // For pop-up payment window after transaction end and redirect with query param
        const parsedUrl = queryString.parseUrl(window.location.href);
        const paymentStatus = parsedUrl.query?.paymentStatus as PaymentStatus;
        if (paymentStatus === 'success') {
            (window.opener as any)?.paySuccess();
            window.close();
        }
        if (paymentStatus === 'cancelled') {
            (window.opener as any)?.payCancel();
            window.close();
        }
    }

    const userInfo = getStoreItem('userInfo');
    const [form, setForm] = useState<{
        email?: string;
        name?: string;
        phone?: string;
        address?: string;
        comment?: string;
        shippingMethod?: number;
        paymentMethod?: string;
    }>({
        email: userInfo?.email,
        name: userInfo?.fullName,
        phone: userInfo?.phone,
        address: userInfo?.address,
        paymentMethod: 'card',
    });
    const cstore = getCStore();
    const forceUpdate = useForceUpdate();
    const [singInOpen, setSingInOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [canValidate, setCanValidate] = useState(false);
    const [singInType, setSingInType] = useState<TFromType>('sign-in');
    const [placedOrder, setPlacedOrder] = useState<TOrder & { checkoutUrl?: string } | null>(null);
    const [orderTotal, setOrderTotal] = useState<TOrder & { checkoutUrl?: string } | null>(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    useEffect(() => {
        const onUserChange = (value: TUser | undefined) => {
            if (value) setForm({
                email: value.email,
                name: value.fullName,
                phone: value.phone,
                address: value.address,
            });
            forceUpdate();
        }

        getOrderTotal();

        cstore.onCartUpdate(getOrderTotal, 'checkout');
        onStoreChange('userInfo', onUserChange);
        onStoreChange('currency', getOrderTotal);

        return () => {
            removeOnStoreChange('userInfo', onUserChange);
            removeOnStoreChange('currency', getOrderTotal);
            cstore.removeOnCartUpdate('checkout');
        }
    }, []);

    const getOrderTotal = async () => {
        setIsLoading(true);
        try {
            const total = await getRestAPIClient()?.createPaymentSession({
                cart: JSON.stringify(cstore.getCart()),
                fromUrl: window.location.origin,
                currency: cstore.getActiveCurrencyTag(),
            });
            if (total) setOrderTotal(total);
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    }


    const changeForm = (key: keyof typeof form, value: any) => {
        setForm(prevState => {
            return {
                ...prevState,
                [key]: value
            }
        })
    }

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = event.target;
        changeForm(name as any, value);
    }

    const handleSignIn = (user: TUser) => {
        if (user) {
            setStoreItem('userInfo', user);
        }
    }

    const handleSignInOpen = () => {
        setSingInType('sign-in');
        setSingInOpen(true);
    }

    const handleSignUpOpen = () => {
        setSingInType('sign-up');
        setSingInOpen(true);
    }

    const validateOrder = () => {
        if (!canValidate) setCanValidate(true);

        if (!form?.name || form.name == '' ||
            !form?.phone || form.phone == '' ||
            !form?.address || form.address == ''
            // || !validateEmail(form.email)
        ) {
            return false;
        }
        return true;
    }

    const handlePlaceOrder = async () => {
        if (!validateOrder()) return;

        let order;
        setIsLoading(true);
        try {
            order = await getRestAPIClient()?.placeOrder({
                customerName: form.name,
                customerPhone: form.phone,
                customerAddress: form.address,
                customerEmail: form.email,
                customerComment: form.comment,
                userId: userInfo?.id,
                cart: JSON.stringify(cstore.getCart()),
                fromUrl: window.location.origin,
                currency: cstore.getActiveCurrencyTag(),
            });
        } catch (e) {
            console.error(e);
            toast.error('Failed to create order');
        }
        setIsLoading(false);

        if (order) {
            setPlacedOrder(order);
            cstore.clearCart();
        }
    }

    const validateEmail = (email) => {
        if (/\S+@\S+\.\S+/.test(email)) {
            return true;
        } else {
            return false;
        }
    }

    const handlePay = async () => {
        if (!validateOrder()) return;
        if (!orderTotal?.checkoutUrl) return;

        setIsLoading(true);

        const popup = window.open(orderTotal.checkoutUrl, 'payment', `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=-1000,top=-1000`);

        const success = await new Promise<boolean>(done => {
            (window as any).paySuccess = () => done(true);
            (window as any).payCancel = () => done(false);

            const timer = setInterval(function () {
                if (popup?.closed) {
                    clearInterval(timer);
                    done(false);
                }
            }, 1000);
        });

        if (success) {
            await handlePlaceOrder();
        }
        setIsLoading(false);
    }

    const wrapContent = (content: JSX.Element | JSX.Element[]) => {
        return (
            <Layout>
                <div className={commonStyles.content}>
                    <div className={styles.CheckoutPage} style={{ filter: isLoading ? 'blur(2px)' : 'none' }}>
                        {isLoading && (
                            <div className={styles.loadBox}><LoadBox /></div>
                        )}
                        {content}
                    </div>
                </div>
            </Layout>
        )
    }

    if (placedOrder) {
        return wrapContent(
            <div className={styles.placedOrderContent}>
                <Alert severity="success">Your order has been placed! Order ID: {placedOrder?.id}</Alert>
            </div>
        );
    }

    return wrapContent(<>
        <div className={styles.inputZone}>
            <h1 className={styles.pageTitle}>Checkout</h1>
            {!userInfo && (
                <div className={styles.signInBlock}>
                    <Button variant="outlined"
                        color="primary"
                        size="small"
                        className={styles.singinBtn}
                        onClick={handleSignInOpen}>
                        Sign in</Button>
                    <Button variant="outlined"
                        color="primary"
                        size="small"
                        className={styles.singinBtn}
                        onClick={handleSignUpOpen}>
                        Sign up</Button>
                    {singInOpen && (
                        <SignInModal
                            type={singInType}
                            open={singInOpen}
                            onClose={() => setSingInOpen(false)}
                            onSignIn={handleSignIn}
                        />
                    )}
                </div>
            )}
            <p></p>
            <div className={styles.delimiter}></div>
            <h2 className={styles.subHeader}>Shipping Address</h2>
            <Tooltip open={canValidate && (!form?.name || form.name == '')} title="This field is required" arrow>
                <TextField label="Name"
                    variant="outlined"
                    name="name"
                    size="small"
                    fullWidth
                    className={styles.input}
                    value={form?.name ?? ''}
                    onChange={handleInput}
                />
            </Tooltip>
            <Tooltip open={canValidate && !validateEmail(form?.email)} title="Invalid e-mail" arrow>
                <TextField label="E-mail"
                    variant="outlined"
                    fullWidth
                    name="email"
                    size="small"
                    className={styles.input}
                    value={form?.email ?? ''}
                    onChange={handleInput}
                    disabled={!!userInfo?.email}
                />
            </Tooltip>
            <Tooltip open={canValidate && (!form?.phone || form.phone == '')} title="This field is required" arrow>
                <TextField label="Phone number"
                    variant="outlined"
                    name="phone"
                    size="small"
                    fullWidth
                    className={styles.input}
                    value={form?.phone ?? ''}
                    onChange={handleInput}
                />
            </Tooltip>
            {/* <br className={styles.delimiter} /> */}
            <Tooltip open={canValidate && (!form?.address || form.address == '')} title="This field is required" arrow>
                <TextField label="Address"
                    variant="outlined"
                    name="address"
                    size="small"
                    fullWidth
                    className={styles.input}
                    value={form?.address ?? ''}
                    onChange={handleInput}
                />
            </Tooltip>
            <TextField label="Comment"
                variant="outlined"
                name="comment"
                size="small"
                fullWidth
                multiline
                className={styles.input}
                value={form?.comment ?? ''}
                onChange={handleInput} />
            <div className={styles.delimiter}></div>

            <h2 className={styles.subHeader}>Shipping Methods</h2>
            <FormControl component="fieldset" className={styles.shippingMethods}>
                <RadioGroup
                    value={form.shippingMethod ?? 0}
                    onChange={(event, value: string) => changeForm('shippingMethod', parseInt(value))}
                >
                    <FormControlLabel value={0} control={<Radio color="primary" />}
                        label={`Standard shipping: ${cstore.getPriceWithCurrency(orderTotal?.shippingPrice)}`} />
                </RadioGroup>
            </FormControl>
            <div className={styles.delimiter}></div>

            <h2 className={styles.subHeader}>Order details</h2>
            <div className={styles.detailsRow}>
                <p>Cart total: </p>
                <b>{cstore.getPriceWithCurrency(orderTotal?.cartTotalPrice)}</b>
            </div>
            <div className={styles.detailsRow}>
                <p>Shipping:</p>
                <b>{cstore.getPriceWithCurrency(orderTotal?.shippingPrice)}</b>
            </div>
            <div className={styles.detailsRow}>
                <p className={styles.totalText}>Total:</p>
                <b className={styles.totalText}>{cstore.getPriceWithCurrency(orderTotal?.orderTotalPrice)}</b>
            </div>

            <h2 className={styles.subHeader} style={{ marginTop: '50px' }}>Payment Methods</h2>
            <FormControl component="fieldset" className={styles.shippingMethods}>
                <RadioGroup
                    value={form.paymentMethod}
                    onChange={(event, value: string) => changeForm('paymentMethod', value)}
                >
                    <FormControlLabel value={'card'} control={<Radio color="primary" />}
                        label="Pay with card / Google Pay"
                        disabled={!orderTotal?.checkoutUrl}
                    />
                    <FormControlLabel value={'later'} control={<Radio color="primary" />}
                        label="Pay later" />
                </RadioGroup>
            </FormControl>

            {form.paymentMethod === 'later' && (
                <div className={styles.orderBtnWrapper}>
                    <Button variant="contained"
                        color="primary"
                        className={styles.singinBtn}
                        size="large"
                        onClick={handlePlaceOrder}
                        disabled={isLoading}
                    >Place order</Button>
                </div>
            )}
            {form.paymentMethod === 'card' && orderTotal?.checkoutUrl && (
                <div className={styles.orderBtnWrapper}>
                    <Button variant="contained"
                        color="primary"
                        className={styles.singinBtn}
                        size="large"
                        onClick={handlePay}
                        disabled={isLoading}
                    >Pay</Button>
                </div>
            )}
        </div>
        <div className={styles.cartZone}>
            <CartProductList collapsedByDefault={isMobile} />
        </div>
    </>);
}

export default CheckoutPage;
