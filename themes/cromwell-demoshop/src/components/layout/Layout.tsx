import React from 'react';
import Header from '../header/Header';
import { CartModal } from '../modals/cart/CartModal';
import { WishlistModal } from '../modals/wishlist/WishlistModal';
import {
    createMuiTheme,
    ThemeProvider,
} from '@material-ui/core';
import { isElement } from 'react-is';
// @ts-ignore
import styles from './Layout.module.scss';
// @ts-ignore
import { primaryColor } from '../../constants';

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
            </div>
        </ThemeProvider>

    )
}
