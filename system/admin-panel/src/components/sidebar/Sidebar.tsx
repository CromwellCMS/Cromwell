import { getStoreItem, onStoreChange, TUser } from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';
import { IconButton, MenuItem, Popover, Tooltip } from '@material-ui/core';
import {
    AccountCircle as AccountCircleIcon,
    ExitToApp as ExitToAppIcon,
    MoreVertOutlined as MoreVertOutlinedIcon,
    Settings as SettingsIcon,
} from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { loginPageInfo, sideBarLinks } from '../../constants/PageInfos';
import commonStyles from '../../styles/common.module.scss';
import styles from './Sidebar.module.scss';
import SidebarLink from './SidebarLink';

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
}

function Sidebar() {
    const [expanded, setExpanded] = useState<string | false>(false);
    const [optionsOpen, setOptionsOpen] = useState<boolean>(false);
    const [activeId, setActiveId] = useState<string | null>(null);
    const forceUpdate = useForceUpdate()
    const toggleSubmenu = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };
    const userInfo: TUser | undefined = getStoreItem('userInfo');
    const history = useHistory?.();
    const popperAnchorEl = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        onStoreChange('userInfo', (value) => {
            forceUpdate();
        })
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

    return (
        <div className={styles.Sidebar}>
            <div className={styles.sidebarTop}>
                <div className={styles.sidebarHeader}>
                    <img src="/logo_small_white.png" alt="logo" className={styles.logo} />
                    {/* <p className={commonStyles.text} style={{ color: '#fff', opacity: 0.7 }}>Admin Panel</p> */}
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
                            <MenuItem className={styles.optionsItem}>
                                <SettingsIcon />
                                <p>Account settings</p>
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
}

export default Sidebar;
