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
import variables from '../../styles/variables.scss';

type TProps = {
    children: React.ReactNode;
}

const theme = createMuiTheme({
    palette: {
        primary: {
            main: variables.primary,
            light: variables.primary,
            dark: variables.primary
        },
    },
});

export default function Layout(props: TProps) {
    console.log('Layout render. props: ', isElement(props.children), props);

    return (
        <ThemeProvider theme={theme}>
            <div className={styles.Layout}>
                <Header />
                <CartModal />
                <WishlistModal />
                {isElement(props.children) && props.children}
            </div>
        </ThemeProvider>

    )
}
