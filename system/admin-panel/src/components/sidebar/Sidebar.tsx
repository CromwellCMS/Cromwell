import { getStoreItem, onStoreChange, TUser } from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';
import {
    AppBar,
    IconButton,
    MenuItem,
    Popover,
    Slide,
    SwipeableDrawer,
    Toolbar,
    Tooltip,
    useScrollTrigger,
} from '@material-ui/core';
import {
    AccountCircle as AccountCircleIcon,
    AccountCircleOutlined as AccountCircleOutlinedIcon,
    Close as CloseIcon,
    ExitToApp as ExitToAppIcon,
    HelpOutline as HelpOutlineIcon,
    Menu as MenuIcon,
    MoreVertOutlined as MoreVertOutlinedIcon,
} from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { getLinkByInfo, loginPageInfo, pageInfos, sideBarLinks, userPageInfo } from '../../constants/PageInfos';
import { useForceUpdate } from '../../helpers/forceUpdate';
import NotificationCenter from '../notificationCenter/NotificationCenter';
import styles from './Sidebar.module.scss';
import SidebarLink from './SidebarLink';

export default function Sidebar() {
    const currentInfo = pageInfos.find(i => '#' + i.route === window.location.hash);
    const currentLink = getLinkByInfo(currentInfo);
    const [expanded, setExpanded] = useState<string | false>(currentLink?.parentId ?? false);
    const [optionsOpen, setOptionsOpen] = useState<boolean>(false);
    const [activeId, setActiveId] = useState<string | null>(currentLink?.id ?? null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const popperAnchorEl = useRef<HTMLDivElement | null>(null);
    const history = useHistory?.();
    const forceUpdate = useForceUpdate();

    const userInfo: TUser | undefined = getStoreItem('userInfo');
    const toggleSubmenu = (panel: string) => (event: React.ChangeEvent<any>, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };
    const handleCloseMenu = () => {
        setMobileOpen(false);
    }
    const handleOpenMenu = () => {
        setMobileOpen(true);
    }

    useEffect(() => {
        onStoreChange('userInfo', () => {
            setTimeout(forceUpdate, 100);
        });
        history?.listen(() => {
            const currentInfo = pageInfos.find(i => '#' + i.route === window.location.hash);
            const newcurrentLink = getLinkByInfo(currentInfo);
            if (newcurrentLink && newcurrentLink !== currentLink) {
                setActiveId(newcurrentLink.id);
                if (newcurrentLink.parentId) setExpanded(newcurrentLink.parentId)
            }
            setTimeout(forceUpdate, 100);
        });
    }, []);

    const handleLogout = async () => {
        setOptionsOpen(false);
        await getRestAPIClient()?.logOut();
        forceUpdate();
        history?.push(loginPageInfo.route);
    }

    const handleOptionsToggle = () => {
        setOptionsOpen(!optionsOpen);
    }

    // check for diabled sidebar
    if (currentInfo?.disableSidebar) return <></>;

    const sidebarContent = (
        <div className={styles.sidebarContent}>
            <div className={styles.sidebarTop}>
                <div className={styles.sidebarHeader}>
                    <img src="/admin/static/logo_icon_white.png" alt="logo" className={styles.logo} />
                    {/* <p className={commonStyles.text} style={{ color: '#fff', opacity: 0.7 }}>Admin Panel</p> */}
                    <div>
                        <NotificationCenter color="#fff" />
                    </div>
                    <div className={styles.sidebarMobileActions}>
                        <IconButton onClick={handleCloseMenu} >
                            <CloseIcon htmlColor="#999" />
                        </IconButton>
                    </div>
                </div>
                {sideBarLinks.map(link => <SidebarLink data={link}
                    key={link.id}
                    toggleSubmenu={toggleSubmenu}
                    expanded={expanded}
                    forceUpdate={forceUpdate}
                    activeId={activeId}
                    setActiveId={setActiveId}
                />)}
            </div>
            <div className={styles.sidebarBottom}>
                <div className={styles.bottomBlock} style={{ overflow: 'hidden' }}>
                    {(userInfo?.avatar && userInfo?.avatar !== '') ? (
                        <div className={styles.avatar} style={{ backgroundImage: `url(${userInfo.avatar})` }}></div>
                    ) : <AccountCircleIcon className={styles.avatar} />}
                    <div className={styles.textBlock}>
                        <p className={styles.nameText}>{userInfo?.fullName ?? ''}</p>
                        <p className={styles.emailText}>{userInfo?.email ?? ''}</p>
                    </div>
                </div>
                <div className={styles.bottomBlock} ref={popperAnchorEl}>
                    <Tooltip title="Options">
                        <IconButton
                            onClick={handleOptionsToggle}
                            className={styles.actionBtn}
                            aria-label="Options"
                        >
                            <MoreVertOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                    <Popover open={optionsOpen} anchorEl={popperAnchorEl.current}
                        style={{ zIndex: 9999 }}
                        onClose={() => setOptionsOpen(false)}
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
                            <Link to={`${userPageInfo.baseRoute}/${userInfo?.id}`}>
                                <MenuItem className={styles.optionsItem}>
                                    <AccountCircleOutlinedIcon />
                                    <p>Your profile</p>
                                </MenuItem>
                            </Link>
                            <MenuItem className={styles.optionsItem}>
                                <HelpOutlineIcon />
                                <p>Support center</p>
                            </MenuItem>
                            <MenuItem onClick={handleLogout} className={styles.optionsItem}>
                                <ExitToAppIcon />
                                <p>Log out</p>
                            </MenuItem>
                        </div>
                    </Popover>
                </div>
            </div>
        </div>
    )

    return (
        <div className={styles.Sidebar}>
            <div className={styles.mobileContent}>
                <HideOnScroll>
                    <AppBar
                        className={styles.appBar}
                        color="transparent"
                    >
                        <Toolbar
                            className={styles.toolbar}
                        >
                            <div className={styles.sidebarMobileHeader}>
                                <img src="/admin/static/logo_icon.png" alt="logo" className={styles.logoMobile} />
                                {/* <p className={commonStyles.text} style={{ color: '#fff', opacity: 0.7 }}>Admin Panel</p> */}
                                <div className={styles.mobileActions}>
                                    <NotificationCenter />
                                    <IconButton onClick={handleOpenMenu}>
                                        <MenuIcon />
                                    </IconButton>
                                </div>
                            </div>
                        </Toolbar>
                    </AppBar>
                </HideOnScroll>
                <SwipeableDrawer
                    open={mobileOpen}
                    onClose={handleCloseMenu}
                    onOpen={handleOpenMenu}
                >
                    <div className={styles.drawer}>{sidebarContent}</div>
                </SwipeableDrawer>
            </div>
            <div className={styles.desktopContent}>{sidebarContent}</div>
        </div>
    )
}

function HideOnScroll(props: { children: React.ReactElement }) {
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {props.children}
        </Slide>
    );
}