import { MuiCurrencySwitch, MuiProductSearch } from '@cromwell/toolkit-commerce';
import { getCmsSettings } from '@cromwell/core';
import { CContainer, CPlugin, Link } from '@cromwell/core-frontend';
import { AppBar, IconButton, Slide, SwipeableDrawer, Toolbar, useScrollTrigger } from '@mui/material';
import Router from 'next/router';
import React, { useState } from 'react';

import { appState } from '../../helpers/AppState';
import { CloseIcon, FavoriteIcon, MenuIcon, ShoppingCartIcon, VisibilityIcon } from '../icons';
import styles from './MobileHeader.module.scss';


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
                <IconButton
                  aria-label="Open wishlist"
                  onClick={handleOpenWishlist}>
                  <FavoriteIcon />
                </IconButton>
                <IconButton
                  aria-label="Open cart"
                  onClick={handleOpenCart}>
                  <ShoppingCartIcon />
                </IconButton>
                <IconButton
                  aria-label="Open main menu"
                  onClick={handleOpenMenu}>
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
              <MuiCurrencySwitch />
            </div>
            <IconButton
              aria-label="Open recently viewed items"
              onClick={handleOpenWatched}>
              <VisibilityIcon />
            </IconButton>
            {/* <IconButton onClick={handleOpenCompare}>
                            <EqualizerIcon />
                        </IconButton> */}
            <IconButton
              aria-label="Open wishlist"
              onClick={handleOpenWishlist}>
              <FavoriteIcon />
            </IconButton>
            <IconButton
              aria-label="Open shopping cart"
              onClick={handleOpenCart}>
              <ShoppingCartIcon />
            </IconButton>
            <IconButton
              aria-label="Close main menu"
              onClick={handleCloseMenu}>
              <CloseIcon />
            </IconButton>
          </div>

          <div className={styles.mobileSearch}>
            <MuiProductSearch />
          </div>
          <CContainer id="mobile_header_13">
            <CPlugin id="header_main_menu"
              plugin={{
                instanceSettings: {
                  mobile: true
                },
                pluginName: "@cromwell/plugin-main-menu"
              }} />
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