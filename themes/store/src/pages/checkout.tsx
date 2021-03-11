import { TCromwellPage } from '@cromwell/core';
import { getGraphQLClient, getCStore } from '@cromwell/core-frontend';
import { Button, TextField, useMediaQuery, useTheme } from '@material-ui/core';
import React, { useState } from 'react';

import { CartProductList } from '../components/checkoutPage/productList/CartProductList';
import Layout from '../components/layout/Layout';
import commonStyles from '../styles/common.module.scss';
import styles from '../styles/pages/Checkout.module.scss';


const CheckoutPage: TCromwellPage = (props) => {

    const [form, setForm] = useState<{
        email?: string;
        name?: string;
        phone?: string;
        address?: string;
        comment?: string;
    }>({});

    const [shippingMethod, setShippingMethod] = useState<string | null>(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = event.target;
        setForm(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        })
    }

    const handleSingIn = () => {

    }

    const handleSingUp = () => {

    }

    const handlePlaceOrder = () => {
        const cstore = getCStore()
        const cartInfo = cstore.getCartTotal();

        getGraphQLClient()?.createOrder({
            customerName: form.name,
            customerPhone: form.phone,
            customerAddress: form.address,
            customerEmail: form.email,
            customerComment: form.comment,
            cartTotalPrice: cartInfo.total,
            totalQnt: cartInfo.amount,
            cartOldTotalPrice: cartInfo.totalOld,
            cart: JSON.stringify(cstore.getCart()),
        })
    }


    return (
        <Layout>
            <div className={commonStyles.content}>
                <div className={styles.CheckoutPage}>
                    <div className={styles.inputZone}>
                        <h1 className={styles.pageTitle}>Checkout</h1>
                        <div className={styles.signInBlock}>
                            <Button variant="outlined"
                                color="primary"
                                size="small"
                                className={styles.singinBtn}
                                onClick={handleSingIn}>
                                Sign in</Button>
                            <Button variant="outlined"
                                color="primary"
                                size="small"
                                className={styles.singinBtn}
                                onClick={handleSingUp}>
                                Sign up</Button>
                        </div>
                        <div className={styles.delimiter}></div>
                        <TextField label="Name"
                            variant="outlined"
                            name="name"
                            size="small"
                            fullWidth
                            className={styles.input}
                            value={form?.name}
                            onChange={handleInput} />
                        <TextField label="E-mail"
                            variant="outlined"
                            fullWidth
                            name="email"
                            size="small"
                            className={styles.input}
                            value={form?.email}
                            onChange={handleInput} />
                        <TextField label="Phone number"
                            variant="outlined"
                            name="phone"
                            size="small"
                            fullWidth
                            className={styles.input}
                            value={form?.phone}
                            onChange={handleInput} />
                        {/* <br className={styles.delimiter} /> */}
                        <TextField label="Address"
                            variant="outlined"
                            name="address"
                            size="small"
                            fullWidth
                            className={styles.input}
                            value={form?.address}
                            onChange={handleInput} />
                        <TextField label="Comment"
                            variant="outlined"
                            name="comment"
                            size="small"
                            fullWidth
                            className={styles.input}
                            value={form?.comment}
                            onChange={handleInput} />
                        <h2 className={styles.subHeader}>Shipping Methods</h2>
                        <div className={styles.delimiter}></div>
                        <div className={styles.orderBtnWrapper}>
                            <Button variant="contained"
                                color="primary"
                                className={styles.singinBtn}
                                size="large"
                                onClick={handlePlaceOrder}>
                                Place order</Button>
                        </div>

                    </div>
                    <div className={styles.cartZone}>
                        <CartProductList collapsedByDefault={isMobile} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default CheckoutPage;
