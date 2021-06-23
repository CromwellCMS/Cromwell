import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import React from 'react';
import { primaryColor } from '../../constants.js';
import { Header } from '../header/Header';
import { Footer } from '../footer/Footer';
import { CartModal } from '../modals/cart/CartModal';
import { WishlistModal } from '../modals/wishlist/WishlistModal';
import { WatchedModal } from '../modals/watched/WatchedModal';
import ProductQuickView from '../modals/productQuickView/ProductQuickView';
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
    // console.log('Layout render. props: ', isElement(props?.children), props);
    return (
        <ThemeProvider theme={theme}>
            <div className={styles.Layout}>
                <Header />
                <CartModal />
                <WishlistModal />
                <WatchedModal />
                <ProductQuickView />
                {props?.children}
                <Footer />
                <div style={{ fontSize: '12px' }}>Icons made by <a href="http://www.freepik.com/" title="Freepik">Freepik</a>, <a href="https://www.flaticon.com/authors/kiranshastry" title="Kiranshastry">Kiranshastry</a>, <a href="https://www.flaticon.com/authors/roundicons" title="Roundicons">Roundicons</a>, <a href="https://www.flaticon.com/authors/monkik" title="monkik">monkik</a>, <a href="https://www.flaticon.com/authors/itim2101" title="itim2101">itim2101</a>, <a href="https://creativemarket.com/eucalyp" title="Eucalyp">Eucalyp</a>  from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>; <a href="https://www.vecteezy.com/free-vector/banner-cdr">Banner Cdr Vectors by Vecteezy</a>; <a href="https://www.vecteezy.com/free-vector/banner">Banner Vectors by Vecteezy</a></div>
            </div>
        </ThemeProvider>
    )
}
