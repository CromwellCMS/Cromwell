import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { primaryColor } from '../../constants.js';
import { appState } from '../../helpers/AppState';
import { Footer } from '../footer/Footer';
import { Header } from '../header/Header';
import { CartModal } from '../modals/cart/CartModal';
import ProductQuickView from '../modals/productQuickView/ProductQuickView';
import { WatchedModal } from '../modals/watched/WatchedModal';
import { WishlistModal } from '../modals/wishlist/WishlistModal';
// import { CompareModal } from '../modals/compare/CompareModal';
import styles from './Layout.module.scss';

type TProps = {
    children: React.ReactNode;
}

const theme = createMuiTheme({
    palette: {
        primary: {
            main: primaryColor,
            light: primaryColor,
            dark: primaryColor,
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
});

export default function Layout(props: TProps | undefined) {
    const router = useRouter?.();

    useEffect(() => {
        if (appState.isCartOpen) appState.isCartOpen = false;
        if (appState.isSigninOpen) appState.isSigninOpen = false;
        if (appState.isCartOpen) appState.isCartOpen = false;
        if (appState.isWishlistOpen) appState.isWishlistOpen = false;
        if (appState.isCompareOpen) appState.isCompareOpen = false;
        if (appState.isWatchedOpen) appState.isWatchedOpen = false;
        if (appState.isQuickViewOpen) appState.isQuickViewOpen = false;
    }, [router?.asPath]);

    return (
        <ThemeProvider theme={theme}>
            <div className={styles.Layout}>
                <Header />
                <CartModal />
                <WishlistModal />
                {/* <CompareModal /> */}
                <WatchedModal />
                <ProductQuickView />
                <div className={styles.main}>
                    {props?.children}
                </div>
                <Footer />
            </div>
        </ThemeProvider>
    )
}
