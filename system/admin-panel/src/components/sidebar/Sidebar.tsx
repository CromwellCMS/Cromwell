import React, { useState } from 'react';

import { sideBarLinks } from '../../constants/PageInfos';
import commonStyles from '../../styles/common.module.scss';
import styles from './Sidebar.module.scss';
import SidebarLink from './SidebarLink';

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

    return (
        <div className={styles.Sidebar}>
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
    )
}

export default Sidebar;