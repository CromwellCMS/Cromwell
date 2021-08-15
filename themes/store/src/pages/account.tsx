import { setStoreItem, TOrder, TStoreListItem, TUpdateUser, TUser } from '@cromwell/core';
import { CContainer, CText, getCStore, getGraphQLClient, getRestApiClient } from '@cromwell/core-frontend';
import { Button, Grid, TextField } from '@material-ui/core';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import Layout from '../components/layout/Layout';
import { LoadBox } from '../components/loadbox/Loadbox';
import SignInModal, { TFromType } from '../components/modals/signIn/SignIn';
import { CartProductList } from '../components/productList/CartProductList';
import { toast } from '../components/toast/toast';
import commonStyles from '../styles/common.module.scss';
import styles from '../styles/pages/account.module.scss';


const Account = () => {
    const [userData, setUserData] = useState<TUser | undefined | null>(null);
    const [orders, setOrders] = useState<TOrder[] | undefined | null>(null);
    const [loading, setLoading] = useState(false);
    const cstore = getCStore();
    const [singInOpen, setSingInOpen] = useState(false);
    const [singInType, setSingInType] = useState<TFromType>('sign-in');

    const handleSignInOpen = () => {
        setSingInType('sign-in');
        setSingInOpen(true);
    }

    const handleSignUpOpen = () => {
        setSingInType('sign-up');
        setSingInOpen(true);
    }

    const handleSignIn = (user: TUser) => {
        setSingInOpen(false);
        if (user) {
            setStoreItem('userInfo', user);
        }
        getUserInfo();
    }

    const getUserInfo = async () => {
        let data: TUser | undefined;
        setLoading(true);
        try {
            data = await getRestApiClient().getUserInfo();
            if (data?.id) {
                setUserData(data);
                getOrders(data?.id);
            }
        } catch (e) { console.error(e) }
        setLoading(false);

        return data;
    }

    const getOrders = async (userId: string) => {
        try {
            const orders = await getGraphQLClient().getOrdersOfUser(userId, { pageSize: 9999 });
            if (orders?.elements) {
                orders.elements = orders.elements.map(order => {
                    if (typeof order.createDate === 'string') {
                        order.createDate = new Date(order.createDate);
                    }
                    try {
                        order.cart = typeof order.cart === 'string' ?
                            JSON.parse(order.cart) : order.cart;
                    } catch (error) {
                        console.error(error);
                    }

                    return order;
                })
                orders.elements.sort((a, b) => (b.createDate?.getTime() ?? 0)
                    - (a.createDate?.getTime() ?? 0));

                setOrders(orders.elements);
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getUserInfo();
    }, []);

    const handleInputChange = (prop: keyof TUser, val: any) => {
        if (userData) {
            setUserData((prevData) => {
                const newData = Object.assign({}, prevData);
                (newData[prop] as any) = val;
                return newData;
            });
        }
    }

    const handleSave = async () => {
        if (!userData?.id) return;
        const inputData: TUpdateUser = {
            slug: userData.slug,
            pageTitle: userData.pageTitle,
            pageDescription: userData.pageDescription,
            fullName: userData.fullName,
            email: userData.email,
            avatar: userData.avatar,
            bio: userData.bio,
            phone: userData.phone,
            address: userData.address,
            role: userData.role,
        }
        try {
            await getGraphQLClient()?.updateUser(userData.id, inputData);
            const data = await getUserInfo();
            toast.success('Saved!');

            setStoreItem('userInfo', data);

        } catch (e) {
            toast.error('Failed to save');
            console.error(e)
        }
    }

    const loggedContent = (
        <CContainer className={styles.fields} id="checkout-1">
            <Grid container item spacing={3} className={styles.contactInfo}>
                <Grid item xs={12} sm={12}>
                    <h2 className={styles.subheader}>Contact information</h2>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Name"
                        value={userData?.fullName || ''}
                        fullWidth
                        className={styles.field}
                        onChange={(e) => { handleInputChange('fullName', e.target.value) }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="E-mail"
                        value={userData?.email || ''}
                        fullWidth
                        className={styles.field}
                        onChange={(e) => { handleInputChange('email', e.target.value) }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Address"
                        value={userData?.address || ''}
                        fullWidth
                        className={styles.field}
                        onChange={(e) => { handleInputChange('address', e.target.value) }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Phone"
                        value={userData?.phone || ''}
                        fullWidth
                        className={styles.field}
                        onChange={(e) => { handleInputChange('phone', e.target.value) }}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Button variant="contained" color="primary"
                        className={styles.saveBtn}
                        size="small"
                        onClick={handleSave}>
                        Update</Button>
                </Grid>
            </Grid>
            <h2 className={styles.subheader}>Order history</h2>
            <div>
                {!orders?.length && (
                    <p>Nothing here yet</p>
                )}
                {orders?.map(order => {
                    return (
                        <Grid key={order.id} item xs={12} sm={12} className={styles.order}>
                            <h3 className={styles.orderTitle}>Order #{order.id} from {order.createDate?.toLocaleDateString?.() ?? ''}</h3>
                            <div>
                                <CartProductList
                                    cart={order.cart as TStoreListItem[]}
                                    collapsedByDefault={true} />
                            </div>
                            <div className={styles.detailsRow}>
                                <p>Shipping:</p>
                                <b>{cstore.getPriceWithCurrency(order?.shippingPrice)}</b>
                            </div>
                            <div className={styles.detailsRow}>
                                <p className={styles.totalText}>Total:</p>
                                <b className={styles.totalText}>{cstore.getPriceWithCurrency(order?.orderTotalPrice)}</b>
                            </div>
                        </Grid>
                    )
                })}
            </div>
        </CContainer>
    );

    return (
        <Layout>
            <CContainer className={clsx(commonStyles.content, styles.AccountPage)} id="checkout-2">
                {loading && (
                    <LoadBox />
                )}
                {(!loading && userData) && loggedContent}
                {(!loading && !userData) && (
                    <CContainer style={{ padding: '20px 15px' }} id="checkout-3">
                        <CText className={styles.subheader} id="checkout-4" element="h2">Log in</CText>
                        <CContainer className={styles.signInBlock} id="checkout-5">
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
                        </CContainer>
                    </CContainer>
                )}
            </CContainer>
        </Layout>
    );
}

export default Account;