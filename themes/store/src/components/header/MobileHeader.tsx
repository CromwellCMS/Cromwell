import { getCmsSettings } from '@cromwell/core';
import { CContainer, CPlugin, Link } from '@cromwell/core-frontend';
import { AppBar, IconButton, Slide, SwipeableDrawer, Toolbar, useScrollTrigger } from '@material-ui/core';
import Router from 'next/router';
import React, { useState } from 'react';

import { appState } from '../../helpers/AppState';
import { CloseIcon, FavoriteIcon, MenuIcon, ShoppingCartIcon, VisibilityIcon } from '../icons';
import { HeaderSearch } from './HeaderSearch';
import styles from './MobileHeader.module.scss';

// import { EqualizerIcon } from '../icons';

let globalCloseMenu;
Router?.events?.on('routeChangeStart', () => {
    globalCloseMenu?.();
})

export const MobileHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const cmsConfig = getCmsSettings();

    const handleCloseMenu = () => {
        setMenuOpen(false);
    }
    const handleOpenMenu = () => {
        setMenuOpen(true);
        globalCloseMenu = () => setMenuOpen(false);
    }

    const handleOpenCart = () => {
        appState.isCartOpen = true;
    }

    const handleOpenWishlist = () => {
        appState.isWishlistOpen = true;
    }

    const handleOpenWatched = () => {
        appState.isWatchedOpen = true;
    }


    // const handleOpenCompare = () => {
    //     appState.isCompareOpen = true;
    // }

    return (
        <>
            <Toolbar className={styles.dummyToolbar} />
            <HideOnScroll>
                <AppBar
                    className={styles.appBar}
                    color="transparent"
                >
                    <Toolbar>
                        <div className={styles.appBarContent}>
                            <div className={styles.leftActions}>
                                <div className={styles.logo}>
                                    <Link href="/">
                                        <img className={styles.logo} src={cmsConfig?.logo} alt="logo" />
                                    </Link>
                                </div>

                            </div>
                            <div className={styles.rightActions}>
                                <IconButton onClick={handleOpenWishlist}>
                                    <FavoriteIcon />
                                </IconButton>
                                <IconButton onClick={handleOpenCart}>
                                    <ShoppingCartIcon />
                                </IconButton>
                                <IconButton onClick={handleOpenMenu}>
                                    <MenuIcon />
                                </IconButton>
                            </div>
                        </div>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
            <SwipeableDrawer
                open={menuOpen}
                onClose={handleCloseMenu}
                onOpen={handleOpenMenu}
            >
                <div className={styles.drawer}>
                    <div className={styles.menuActions}>
                        <IconButton onClick={handleOpenWatched}>
                            <VisibilityIcon />
                        </IconButton>
                        {/* <IconButton onClick={handleOpenCompare}>
                            <EqualizerIcon />
                        </IconButton> */}
                        <IconButton onClick={handleOpenWishlist}>
                            <FavoriteIcon />
                        </IconButton>
                        <IconButton onClick={handleOpenCart}>
                            <ShoppingCartIcon />
                        </IconButton>
                        <IconButton onClick={handleCloseMenu}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div className={styles.mobileSearch}>
                        <HeaderSearch />
                    </div>
                    <CContainer id="mobile_header_13">
                        <CPlugin id="header_main_menu" />
                    </CContainer>
                </div>
            </SwipeableDrawer>
        </>
    );
}

function HideOnScroll(props: { children: React.ReactElement }) {
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {props.children}
        </Slide>
    );
}