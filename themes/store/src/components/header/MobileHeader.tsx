import { getCmsSettings, TCurrency } from '@cromwell/core';
import { CContainer, CPlugin, getCStore, Link } from '@cromwell/core-frontend';
import {
    AppBar,
    FormControl,
    IconButton,
    MenuItem,
    Select,
    Slide,
    SwipeableDrawer,
    Toolbar,
    useScrollTrigger,
} from '@material-ui/core';
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
    const cstore = getCStore();
    const [currency, setCurrency] = React.useState<string | null | undefined>(cstore.getActiveCurrencyTag());
    const currencies: TCurrency[] = cmsConfig?.currencies ?? [];

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

    const handleCurrencyChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const val = event.target.value as string;
        setCurrency(val);
        cstore.setActiveCurrency(val);
    };


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
                        <div className={styles.currencyOption}>
                            <FormControl className={styles.formControl}>
                                <Select
                                    className={styles.select}
                                    value={currency ?? ''}
                                    onChange={handleCurrencyChange}
                                >
                                    {currencies && Array.isArray(currencies) && currencies.map(curr => (
                                        <MenuItem value={curr.tag} key={curr.tag}>{curr.tag}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
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