import { Link } from '@cromwell/core-frontend';
import { CContainer, CHTML, CPlugin, getCStore } from '@cromwell/core-frontend';
import { getCmsSettings, getThemeCustomConfigProp, TCurrency } from '@cromwell/core';
import { IconButton, SwipeableDrawer, AppBar, Toolbar, Slide, useScrollTrigger } from '@material-ui/core';
import {
    Equalizer as EqualizerIcon,
    Favorite as FavoriteIcon,
    Menu as MenuIcon,
    ShoppingCart as ShoppingCartIcon,
    Visibility as VisibilityIcon,
    Close as CloseIcon
} from '@material-ui/icons';
import React, { useState } from 'react';
import { productListStore } from '../../helpers/ProductListStore';
import { HeaderSearch } from './HeaderSearch';
import styles from './MobileHeader.module.scss';

export const MobileHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleCloseMenu = () => {
        setMenuOpen(false);
    }
    const handleOpenMenu = () => {
        setMenuOpen(true);
    }

    const handleOpenCart = () => {
        productListStore.isCartOpen = true;
    }
    const logoHref: string | undefined = getThemeCustomConfigProp('header/logo');

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
                                        <img className={styles.logo} src={logoHref} alt="logo" />
                                    </Link>
                                </div>

                            </div>
                            <div className={styles.rightActions}>
                                <IconButton onClick={handleOpenCart}>
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
                        <IconButton onClick={handleOpenCart}>
                            <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={handleOpenCart}>
                            <EqualizerIcon />
                        </IconButton>
                        <IconButton onClick={handleOpenCart}>
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