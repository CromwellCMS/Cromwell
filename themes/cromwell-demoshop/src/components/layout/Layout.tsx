import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import React from 'react';
//@ts-ignore
import { primaryColor } from '../../constants.js';
import { Header } from '../header/Header';
import { Footer } from '../footer/Footer';
import { CartModal } from '../modals/cart/CartModal';
import { WishlistModal } from '../modals/wishlist/WishlistModal';
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
});

export default function Layout(props: TProps | undefined) {
    // console.log('Layout render. props: ', isElement(props?.children), props);

    return (
        <ThemeProvider theme={theme}>
            <div className={styles.Layout}>
                <Header />
                <CartModal />
                <WishlistModal />
                {props?.children}
                <Footer />
            </div>
        </ThemeProvider>

    )
}
