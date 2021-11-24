import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { appState } from '../../helpers/AppState';
import { Footer } from '../footer/Footer';
import { Header } from '../header/Header';
import { CartModal } from '../modals/cart/CartModal';
import ProductQuickView from '../modals/productQuickView/ProductQuickView';
import { WatchedModal } from '../modals/watched/WatchedModal';
import { WishlistModal } from '../modals/wishlist/WishlistModal';
import styles from './Layout.module.scss';

// import { CompareModal } from '../modals/compare/CompareModal';
type TProps = {
    children: React.ReactNode;
}

export default function Layout(props: TProps | undefined) {
    const router = useRouter?.();

    useEffect(() => {
        if (appState.isCartOpen) appState.isCartOpen = false;
        if (appState.isSignInOpen) appState.isSignInOpen = false;
        if (appState.isCartOpen) appState.isCartOpen = false;
        if (appState.isWishlistOpen) appState.isWishlistOpen = false;
        if (appState.isCompareOpen) appState.isCompareOpen = false;
        if (appState.isWatchedOpen) appState.isWatchedOpen = false;
        if (appState.isQuickViewOpen) appState.isQuickViewOpen = false;
    }, [router?.asPath]);

    return (
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
    )
}
