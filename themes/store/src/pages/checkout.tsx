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
import { Button, TextField, Tooltip, useMediaQuery, useTheme, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';

import { CartProductList } from '../components/checkoutPage/productList/CartProductList';
import Layout from '../components/layout/Layout';
import SignInModal, { TFromType } from '../components/modals/signIn/SignIn';
import { toast } from '../components/toast/toast';
import commonStyles from '../styles/common.module.scss';
import styles from '../styles/pages/Checkout.module.scss';


const CheckoutPage: TCromwellPage = (props) => {

    const [form, setForm] = useState<{
        email?: string;
        name?: string;
        phone?: string;
        address?: string;
        comment?: string;
        shippingMethod?: number;
    }>({});
    const userInfo = getStoreItem('userInfo');
    const cstore = getCStore();
    const forceUpdate = useForceUpdate();
    const [singInOpen, setSingInOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [canValidate, setCanValidate] = useState(false);
    const [singInType, setSingInType] = useState<TFromType>('sign-in');
    const [placedOrder, setPlacedOrder] = useState<TOrder | null>(null);

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

        onStoreChange('userInfo', onUserChange);

        return () => {
            removeOnStoreChange('userInfo', onUserChange);
        }
    }, []);

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
        const cartInfo = cstore.getCartTotal();
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
                cartTotalPrice: cartInfo.total,
                totalQnt: cartInfo.amount,
                cartOldTotalPrice: cartInfo.totalOld,
                cart: JSON.stringify(cstore.getCart()),
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

    const shippingPrice = getStoreItem('cmsSettings')?.defaultShippingPrice ?? 0;


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
                            label={`Standard shipping: ${cstore.getPriceWithCurrency(shippingPrice)}`} />
                    </RadioGroup>
                </FormControl>
                <div className={styles.delimiter}></div>

                <h2 className={styles.subHeader}>Total</h2>
                <p>Cart total: <b>{cstore.getPriceWithCurrency(cstore.getCartTotal().total)}</b></p>
                <p>Delivery: <b>{cstore.getPriceWithCurrency(shippingPrice)}</b></p>
                <p>Order total: <b>{cstore.getPriceWithCurrency(shippingPrice + cstore.getCartTotal().total)}</b></p>
                <div className={styles.delimiter}></div>

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


function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
}
