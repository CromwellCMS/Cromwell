import {
    getStoreItem,
    onStoreChange,
    removeOnStoreChange,
    setStoreItem,
    TCromwellPage,
    TOrder,
    TUser,
} from '@cromwell/core';
import { getCStore, getRestAPIClient } from '@cromwell/core-frontend';
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
import React, { useEffect, useState } from 'react';

import Layout from '../components/layout/Layout';
import SignInModal, { TFromType } from '../components/modals/signIn/SignIn';
import { CartProductList } from '../components/productList/CartProductList';
import { toast } from '../components/toast/toast';
import { useForceUpdate } from '../helpers/forceUpdate';
import commonStyles from '../styles/common.module.scss';
import styles from '../styles/pages/Checkout.module.scss';


const CheckoutPage: TCromwellPage = () => {

    const userInfo = getStoreItem('userInfo');
    const [form, setForm] = useState<{
        email?: string;
        name?: string;
        phone?: string;
        address?: string;
        comment?: string;
        shippingMethod?: number;
    }>({
        email: userInfo?.email,
        name: userInfo?.fullName,
        phone: userInfo?.phone,
        address: userInfo?.address,
    });
    const cstore = getCStore();
    const forceUpdate = useForceUpdate();
    const [singInOpen, setSingInOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [canValidate, setCanValidate] = useState(false);
    const [singInType, setSingInType] = useState<TFromType>('sign-in');
    const [placedOrder, setPlacedOrder] = useState<TOrder | null>(null);
    const [orderTotal, setOrderTotal] = useState<TOrder | null>(null);

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

        cstore.onCartUpdate(() => {
            getOrderTotal();
        }, 'checkout');

        onStoreChange('userInfo', onUserChange);

        return () => {
            removeOnStoreChange('userInfo', onUserChange);
        }
    }, []);

    const getOrderTotal = async () => {
        try {
            const total = await getRestAPIClient()?.getOrderTotal({
                cart: JSON.stringify(cstore.getCart())
            });
            if (total) setOrderTotal(total);
        } catch (error) {
            console.error(error);
        }
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

    const handlePlaceOrder = async () => {
        if (!canValidate) setCanValidate(true);

        if (!form?.name || form.name == '' ||
            !form?.phone || form.phone == '' ||
            !form?.address || form.address == ''
            // || !validateEmail(form.email)
        ) {
            return;
        }

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



    const checkoutContent = (
        <>
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
                        onChange={(event, value: string) => changeForm('shippingMethod', parseInt(value))}>
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
                    <p>Delivery:</p>
                    <b>{cstore.getPriceWithCurrency(orderTotal?.shippingPrice)}</b>
                </div>
                <div className={styles.detailsRow}>
                    <p className={styles.totalText}>Total:</p>
                    <b className={styles.totalText}>{cstore.getPriceWithCurrency(orderTotal?.orderTotalPrice)}</b>
                </div>

                <div className={styles.orderBtnWrapper}>
                    <Button variant="contained"
                        color="primary"
                        className={styles.singinBtn}
                        size="large"
                        onClick={handlePlaceOrder}
                        disabled={isLoading}
                    >
                        Place order</Button>
                </div>

            </div>
            <div className={styles.cartZone}>
                <CartProductList collapsedByDefault={isMobile} />
            </div>
        </>
    );

    const placedOrderContent = (
        <div className={styles.placedOrderContent}>
            <Alert severity="success">Your order has been placed! Order ID: {placedOrder?.id}</Alert>
        </div>
    );

    return (
        <Layout>
            <div className={commonStyles.content}>
                <div className={styles.CheckoutPage}>
                    {placedOrder ? placedOrderContent : checkoutContent}
                </div>
            </div>
        </Layout>
    );
}

export default CheckoutPage;
