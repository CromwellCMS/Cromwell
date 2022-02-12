import { getCmsSettings } from '@cromwell/core';
import { CContainer, CHTML, CPlugin, CText, Link, useAuthClient, useCart, useUserInfo } from '@cromwell/core-frontend';
import { MuiCurrencySwitch, MuiProductSearch } from '@cromwell/toolkit-commerce';
import { IconButton, ListItem, MenuItem, Popover, Tooltip } from '@mui/material';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';

import { appState } from '../../helpers/AppState';
import commonStyles from '../../styles/common.module.scss';
import {
  AccountCircleIcon,
  AccountCircleOutlinedIcon,
  ExitToAppIcon,
  ExpandMoreIcon,
  FavoriteIcon,
  VisibilityIcon,
} from '../icons';
import styles from './Header.module.scss';
import { MobileHeader } from './MobileHeader';

export const Header = () => {
  const cmsSettings = getCmsSettings();
  const cart = useCart();
  const userInfo = useUserInfo();
  const [userOptionsOpen, setUserOptionsOpen] = useState<boolean>(false);
  const popperAnchorEl = useRef<HTMLDivElement | null>(null);
  const authClient = useAuthClient();

  const handleCartClick = () => {
    appState.isCartOpen = true;
  }

  const handleLogout = async () => {
    setUserOptionsOpen(false);
    authClient.signOut();
  }

  const handleOpenWishlist = () => {
    appState.isWishlistOpen = true;
  }

  const handleOpenWatched = () => {
    appState.isWatchedOpen = true;
  }

  const handleOpenSignIn = () => {
    appState.isSignInOpen = true;
  }

  return (
    <CContainer global id="header_1" className={`${styles.Header} ${commonStyles.text}`}>
      <CContainer id="header_21" className={styles.topPanel}>
        <CContainer id="header_22" className={`${commonStyles.content} ${styles.topPanelContent}`}>
          <CContainer className={styles.leftBlock} id="header_11">
            <CContainer id="header_01" className={styles.currencyOption}>
              <MuiCurrencySwitch />
            </CContainer>
            <CContainer id="header_51">
              <Tooltip title="Viewed items">
                <IconButton
                  aria-label="Open recently viewed items"
                  onClick={handleOpenWatched} style={{ margin: '-12px 0' }}>
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Wishlist">
                <IconButton
                  aria-label="Open wishlist"
                  onClick={handleOpenWishlist} style={{ margin: '-12px 0' }}>
                  <FavoriteIcon />
                </IconButton>
              </Tooltip>
            </CContainer>
            <CHTML id="header_02">
              <div className={styles.languageOption}>
              </div>
            </CHTML>
          </CContainer>

          <CContainer className={styles.rightBlock} id="header_12">
            <CContainer id="header_03" className={styles.welcomeMessage}>
              <CText id="header_35">Welcome message</CText>
            </CContainer>
            <CContainer id="header_04" className={styles.topPanelLinks}>
              <CText id="header_31" href="/pages/contact-us" className={clsx(commonStyles.link, styles.topPanelLink)}>Contact us</CText>
              {!userInfo && (
                <CText id="header_32" onClick={handleOpenSignIn} className={clsx(commonStyles.link, styles.topPanelLink)}>Sign in</CText>
              )}
              {userInfo && (
                <>
                  <div className={styles.userBox} ref={popperAnchorEl}
                    onClick={() => setUserOptionsOpen(true)}
                  >
                    {(userInfo?.avatar && userInfo?.avatar !== '') ? (
                      <div className={styles.avatar} style={{ backgroundImage: `url(${userInfo.avatar})` }}></div>
                    ) : <AccountCircleIcon className={styles.avatar} />}
                    <p className={clsx(styles.userName)}>{userInfo.fullName ?? ''}</p>
                  </div>
                  <Popover open={userOptionsOpen}
                    anchorEl={popperAnchorEl.current}
                    style={{ zIndex: 9999 }}
                    onClose={() => setUserOptionsOpen(false)}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                  >
                    <div>
                      <Link href="/account">
                        <MenuItem className={styles.optionsItem} onClick={() => setUserOptionsOpen(false)}>
                          <AccountCircleOutlinedIcon />
                          <p>Your profile</p>
                        </MenuItem>
                      </Link>
                      <MenuItem onClick={handleLogout} className={styles.optionsItem}>
                        <ExitToAppIcon />
                        <p>Log out</p>
                      </MenuItem>
                    </div>
                  </Popover>
                </>
              )}
            </CContainer>
          </CContainer>
        </CContainer>
      </CContainer>

      <CContainer id="header_23" className={styles.mainPanel}>
        <CContainer id="header_41" className={`${commonStyles.content} ${styles.mainPanelContent}`}>
          <CContainer id="header_36" className={styles.logo}>
            <Link href="/">
              <img className={styles.logo} src={cmsSettings?.logo} alt="logo" />
            </Link>
          </CContainer>
          <CContainer id="header_37" className={styles.search}>
            <MuiProductSearch />
          </CContainer>
          <CContainer id="header_38" className={styles.phone}>
            <CText id="header_39" className={styles.phoneActionTip}>Call us now!</CText>
            <CText id="header_33" href={`tel:+123 (456) 78-90`} className={commonStyles.link}>+123 (456) 78-90</CText>
          </CContainer>
          <CContainer id="header_40">
            <ListItem button className={styles.cart} onClick={handleCartClick} >
              <div className={styles.cartIcon}></div>
              <div className={styles.cartExpandBlock}>
                <p className={styles.itemsInCart}>{cart?.length || 0}</p>
                <ExpandMoreIcon className={styles.cartExpandIcon} />
              </div>
            </ListItem>
          </CContainer>
        </CContainer>
      </CContainer>
      <CContainer id="header_24" className={styles.mainMenu}>
        <CContainer className={`${commonStyles.content} ${styles.mainMenuContent}`} id="header_13">
          <CPlugin id="header_main_menu" pluginName={"@cromwell/plugin-main-menu"} />
        </CContainer>
      </CContainer>
      <div className={styles.mobileHeader}>
        <MobileHeader />
      </div>
    </CContainer>
  )
}