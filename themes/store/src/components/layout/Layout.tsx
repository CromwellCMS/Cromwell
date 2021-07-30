import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import * as nextRouter from 'next/router';
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
    const router = nextRouter?.useRouter?.();

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
                {props?.children}
                <Footer />
                <div id="icons_attribution" style={{ fontSize: '12px' }}>Icons made by <a href="http://www.freepik.com/" title="Freepik">Freepik</a>, <a href="https://www.flaticon.com/authors/kiranshastry" title="Kiranshastry">Kiranshastry</a>, <a href="https://www.flaticon.com/authors/roundicons" title="Roundicons">Roundicons</a>, <a href="https://www.flaticon.com/authors/monkik" title="monkik">monkik</a>, <a href="https://www.flaticon.com/authors/itim2101" title="itim2101">itim2101</a>, <a href="https://creativemarket.com/eucalyp" title="Eucalyp">Eucalyp</a>  from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>; <a href="https://www.vecteezy.com/free-vector/banner-cdr">Banner Cdr Vectors by Vecteezy</a>; <a href="https://www.vecteezy.com/free-vector/banner">Banner Vectors by Vecteezy</a></div>
            </div>
        </ThemeProvider>
    )
}
