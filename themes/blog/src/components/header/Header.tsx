import { getCmsSettings, onStoreChange } from '@cromwell/core';
import { CContainer, CPlugin, Link } from '@cromwell/core-frontend';
import { AppBar, IconButton, Slide, SwipeableDrawer, Toolbar, useScrollTrigger } from '@material-ui/core';
import React, { useState, useEffect } from 'react';

import commonStyles from '../../styles/common.module.scss';
import { CloseIcon, MenuIcon } from '../icons';
import styles from './Header.module.scss';
import { HeaderSearch } from './HeaderSearch';

export function useForceUpdate() {
    const state = useState(0);
    return () => state[1](value => ++value);
}


const Header = () => {
    const cmsConfig = getCmsSettings();
    const forceUpdate = useForceUpdate();
    const [menuOpen, setMenuOpen] = useState(false);
    const handleCloseMenu = () => {
        setMenuOpen(false);
    }
    const handleOpenMenu = () => {
        setMenuOpen(true);
    }

    useEffect(() => {
        onStoreChange('cmsSettings', () => {
            forceUpdate();
        });
    }, []);

    return (
        <CContainer global id="header-01">
            <Toolbar className={styles.dummyToolbar} />
            <HideOnScroll>
                <AppBar
                    className={styles.appBar}
                    color="transparent"
                >
                    <Toolbar>
                        <CContainer className={`${styles.Header} ${commonStyles.text}`} id="header-02">
                            <CContainer className={`${commonStyles.content} ${styles.headerContent}`} id="header-03">
                                <CContainer className={styles.logoWrapper} id="header-06">
                                    <Link href="/">
                                        <img className={styles.logo} src={cmsConfig?.logo} alt="logo" />
                                    </Link>
                                </CContainer>
                                <CPlugin
                                    className={styles.mainMenu}
                                    id="header_main_menu"
                                    pluginName={"@cromwell/plugin-main-menu"} />
                                <CContainer className={styles.search} id="header-04">
                                    <HeaderSearch />
                                </CContainer>
                                <CContainer className={styles.mobileActions} id="header-05">
                                    <IconButton
                                        aria-label={"Open main menu"}
                                        onClick={handleOpenMenu}>
                                        <MenuIcon color="#111" />
                                    </IconButton>
                                </CContainer>
                            </CContainer>
                        </CContainer>
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
                        <div></div>
                        <IconButton
                            aria-label="Close main menu"
                            onClick={handleCloseMenu}>
                            <CloseIcon color="#111" />
                        </IconButton>
                    </div>
                    <div className={styles.mobileSearch}>
                        <HeaderSearch />
                    </div>
                    <div>
                        <CPlugin
                            id="header_main_menu_mobile"
                            pluginName={"@cromwell/plugin-main-menu"} />
                    </div>
                </div>
            </SwipeableDrawer>
        </CContainer>
    )
}

export default Header;


function HideOnScroll(props: { children: React.ReactElement }) {
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {props.children}
        </Slide>
    );
}