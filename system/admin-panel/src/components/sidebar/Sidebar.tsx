import React, { useState, useEffect } from 'react';
import { getStoreItem, onStoreChange, setStoreItem, TUser } from '@cromwell/core';
import { Collapse, IconButton, Tooltip } from '@material-ui/core';
import {
    Settings as SettingsIcon,
    ExitToApp as ExitToAppIcon,
    AccountCircle as AccountCircleIcon,
} from '@material-ui/icons';
import { sideBarLinks, loginPageInfo } from '../../constants/PageInfos';
import commonStyles from '../../styles/common.module.scss';
import styles from './Sidebar.module.scss';
import SidebarLink from './SidebarLink';
import { getRestAPIClient } from '@cromwell/core-frontend';
import { useHistory } from 'react-router-dom';

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
}

function Sidebar() {
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const [activeId, setActiveId] = React.useState<string | null>(null);
    const forceUpdate = useForceUpdate()
    const toggleSubmenu = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };
    const userInfo: TUser | undefined = getStoreItem('userInfo');
    const history = useHistory?.();

    useEffect(() => {
        onStoreChange('userInfo', (value) => {
            forceUpdate();
        })
    }, []);

    const handleLogout = async () => {
        await getRestAPIClient()?.logOut();
        forceUpdate();
        history?.push(loginPageInfo.route);
    }

    return (
        <div className={styles.Sidebar}>
            <div className={styles.sidebarTop}>
                <div className={styles.sidebarHeader}>
                    <img src="/logo_icon.png" alt="logo" className={styles.logo} />
                    <p className={commonStyles.text} style={{ color: '#fff', opacity: 0.7 }}>Admin Panel</p>
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
                <div className={styles.bottomBlock}>
                    {(userInfo?.avatar && userInfo?.avatar !== '') ? (
                        <div className={styles.avatar}></div>
                    ) : <AccountCircleIcon className={styles.avatar} />}
                    <div className={styles.textBlock}>
                        <p className={styles.nameText}>{userInfo?.fullName ?? ''}</p>
                        <p className={styles.emailText}>{userInfo?.email ?? ''}</p>
                    </div>
                </div>
                <div className={styles.bottomBlock}>
                    <Tooltip title="Settings">
                        <IconButton
                            className={styles.actionBtn}
                            aria-label="Settings"
                        >
                            <SettingsIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Log out">
                        <IconButton
                            className={styles.actionBtn}
                            aria-label="Log out"
                            onClick={handleLogout}
                        >
                            <ExitToAppIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;