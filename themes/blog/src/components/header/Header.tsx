import { getCmsSettings } from '@cromwell/core';
import { CPlugin, Link } from '@cromwell/core-frontend';
import { AppBar, IconButton, Slide, SwipeableDrawer, Toolbar, useScrollTrigger } from '@material-ui/core';
import React, { useState } from 'react';

import commonStyles from '../../styles/common.module.scss';
import { CloseIcon, MenuIcon } from '../icons';
import styles from './Header.module.scss';
import { HeaderSearch } from './HeaderSearch';

const Header = () => {
    const cmsConfig = getCmsSettings();
    const [menuOpen, setMenuOpen] = useState(false);
    const handleCloseMenu = () => {
        setMenuOpen(false);
    }
    const handleOpenMenu = () => {
        setMenuOpen(true);
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
                        <div className={`${styles.Header} ${commonStyles.text}`}>
                            <div className={`${commonStyles.content} ${styles.headerContent}`}>
                                <div className={styles.logoWrapper}>
                                    <Link href="/">
                                        <img className={styles.logo} src={cmsConfig?.logo} alt="logo" />
                                    </Link>
                                </div>
                                <CPlugin
                                    className={styles.mainMenu}
                                    id="header_main_menu"
                                    pluginName={"@cromwell/plugin-main-menu"} />
                                <div className={styles.search}>
                                    <HeaderSearch />
                                </div>
                                <div className={styles.mobileActions}>
                                    <IconButton onClick={handleOpenMenu}>
                                        <MenuIcon color="#111" />
                                    </IconButton>
                                </div>
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
                        <div></div>
                        <IconButton onClick={handleCloseMenu}>
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
        </>
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