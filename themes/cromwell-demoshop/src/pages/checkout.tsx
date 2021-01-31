import React, { useState } from 'react';
import { TCromwellPage } from '@cromwell/core';
import styles from '../styles/pages/Checkout.module.scss';
import Layout from '../components/layout/Layout';
import { CartProductList } from '../components/checkoutPage/productList/CartProductList';
import { ClickAwayListener, Button, Fade, Grid, Popper, TextField, withStyles } from '@material-ui/core';
import commonStyles from '../styles/common.module.scss';


const CheckoutPage: TCromwellPage = (props) => {

    const [form, setForm] = useState<{
        email?: string;
        name?: string;
        phone?: string;
        address?: string;
    }>({});

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
                        <h2 className={styles.subHeader}>Shipping Methods</h2>
                        <div className={styles.delimiter}></div>
                        <div className={styles.orderBtnWrapper}>
                            <Button variant="contained"
                                color="primary"
                                className={styles.singinBtn}
                                size="large"
                                onClick={handleSingIn}>
                                Order</Button>
                        </div>

                    </div>
                    <div className={styles.cartZone}>
                        <CartProductList />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default CheckoutPage;
