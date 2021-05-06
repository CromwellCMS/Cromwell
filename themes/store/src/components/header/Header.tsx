import { getCmsSettings, TCurrency, TUser, setStoreItem, onStoreChange, removeOnStoreChange, getStoreItem } from '@cromwell/core';
import { CContainer, CHTML, CPlugin, CText, getCStore, Link, getRestAPIClient } from '@cromwell/core-frontend';
import { FormControl, ListItem, MenuItem, Select as MuiSelect, withStyles, Popover } from '@material-ui/core';
import {
    ExpandMore as ExpandMoreIcon,
    AccountCircle as AccountCircleIcon,
    AccountCircleOutlined as AccountCircleOutlinedIcon,
    ExitToApp as ExitToAppIcon,
} from '@material-ui/icons';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';

import { appState } from '../../helpers/AppState';
import commonStyles from '../../styles/common.module.scss';
import SingInModal from '../modals/signIn/SignIn';
import styles from './Header.module.scss';
import { HeaderSearch } from './HeaderSearch';
import { MobileHeader } from './MobileHeader';

const Select = withStyles({
    root: {
        width: '300px',
        fontSize: '1em',
        padding: '4px'
    }
})(MuiSelect);

export const Header = () => {
    const cmsConfig = getCmsSettings();
    const currencies: TCurrency[] = cmsConfig?.currencies ?? [];
    const cstore = getCStore();
    const [itemsInCart, setItemsInCart] = useState(cstore.getCart().length);
    const [singInOpen, setSingInOpen] = useState(false);
    const forceUpdate = useForceUpdate();
    const userInfo = getStoreItem('userInfo');
    const [userOptionsOpen, setUserOptionsOpen] = useState<boolean>(false);
    const popperAnchorEl = useRef<HTMLDivElement | null>(null);

    const [currency, setCurrency] = React.useState<string | null | undefined>(cstore.getActiveCurrencyTag());

    const handleCurrencyChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const val = event.target.value as string;
        setCurrency(val);
        cstore.setActiveCurrency(val);
    };

    const handleCartClick = () => {
        appState.isCartOpen = true;
    }

    useEffect(() => {
        cstore.onCartUpdate((cart) => {
            if (itemsInCart !== cart.length)
                setItemsInCart(cart.length);
        }, 'headerCart');

        const onUserChange = () => {
            forceUpdate();
        }

        onStoreChange('userInfo', onUserChange);

        return () => {
            removeOnStoreChange('userInfo', onUserChange);
        }
    }, []);

    const handleSignIn = (user: TUser) => {
        setSingInOpen(false);
        setStoreItem('userInfo', user);
    }

    const handleLogout = async () => {
        setUserOptionsOpen(false);
        try {
            await getRestAPIClient()?.logOut();
        } catch (e) {
            console.error(e);
        }
        setStoreItem('userInfo', undefined);
    }

    return (
        <CContainer global id="header_1" className={`${styles.Header} ${commonStyles.text}`}>
            <CContainer id="header_21" className={styles.topPanel}>
                <CContainer id="header_22" className={`${commonStyles.content} ${styles.topPanelContent}`}>
                    <CContainer className={styles.leftBlock} id="header_11">
                        <CContainer id="header_01" className={styles.currencyOption}>
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
                            <CText id="header_31" href="/contact-us" className={clsx(commonStyles.link, styles.topPanelLink)}>Contact us</CText>
                            {!userInfo && (
                                <CText id="header_32" onClick={() => setSingInOpen(true)} className={clsx(commonStyles.link, styles.topPanelLink)}>Sign in</CText>
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

                                        {/* <p className={clsx(commonStyles.link, styles.topPanelLink)}>Sign out</p> */}
                                    </div>
                                    <Popover open={userOptionsOpen} anchorEl={popperAnchorEl.current}
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
                                            <MenuItem className={styles.optionsItem}>
                                                <AccountCircleOutlinedIcon />
                                                <p>Your profile</p>
                                            </MenuItem>
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
                <SingInModal
                    type="sign-in"
                    open={singInOpen}
                    onClose={() => setSingInOpen(false)}
                    onSignIn={handleSignIn}
                />
            </CContainer>

            <CContainer id="header_23" className={styles.mainPanel}>
                <CContainer id="header_41" className={`${commonStyles.content} ${styles.mainPanelContent}`}>
                    <CContainer id="header_36" className={styles.logo}>
                        <Link href="/">
                            <img className={styles.logo} src={cmsConfig?.logo} alt="logo" />
                        </Link>
                    </CContainer>
                    <CContainer id="header_37" className={styles.search}>
                        <HeaderSearch />
                    </CContainer>
                    <CContainer id="header_38" className={styles.phone}>
                        <CText id="header_39" className={styles.phoneActionTip}>Call us now!</CText>
                        <CText id="header_33" href={`tel:+123 (456) 78-90`} className={commonStyles.link}>+123 (456) 78-90</CText>
                    </CContainer>
                    <CContainer id="header_40">
                        <ListItem button className={styles.cart} onClick={handleCartClick} >
                            <div className={styles.cartIcon}></div>
                            <div className={styles.cartExpandBlock}>
                                <p className={styles.itemsInCart}>{itemsInCart}</p>
                                <ExpandMoreIcon className={styles.cartExpandIcon} />
                            </div>
                        </ListItem>
                    </CContainer>
                </CContainer>
            </CContainer>
            <CContainer id="header_24" className={styles.mainMenu}>
                <CContainer className={`${commonStyles.content} ${styles.mainMenuContent}`} id="header_13">
                    <CPlugin id="header_main_menu" />
                </CContainer>
            </CContainer>
            <div className={styles.mobileHeader}>
                <MobileHeader />
            </div>
        </CContainer>
    )
}

function useForceUpdate() {
    const state = useState(0);
    return () => state[1](value => ++value);
}

