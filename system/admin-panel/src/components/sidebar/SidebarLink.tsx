import { TUser } from '@cromwell/core';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, MenuItem as MuiMenuItem } from '@mui/material';
import { withStyles } from '@mui/styles';
import React from 'react';
import { Link } from 'react-router-dom';

import { TSidebarLinkType } from '../../constants/PageInfos';
import styles from './Sidebar.module.scss';

const ExpansionPanel = withStyles({
    root: {
        padding: 0,
        boxShadow: 'none',
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(Accordion);

const ExpansionPanelDetails = withStyles({
    root: {
        padding: 0,
    }
})(AccordionDetails);

const MenuItem = withStyles({
    root: {
        width: '100%',
        paddingTop: '12px',
        paddingBottom: '12px'
    },
})(MuiMenuItem);


const SidebarLink = (props: {
    data: TSidebarLinkType,
    toggleSubMenu: (panel: string) => (event: React.ChangeEvent, isExpanded: boolean) => void,
    expanded: string | false;
    forceUpdate: () => void;
    setActiveId: (id: string) => void;
    activeId: string;
    userInfo: TUser | undefined;
}) => {
    const isExpanded = props.expanded === props.data.id;

    if (props.data?.roles && props.userInfo?.role) {
        if (!props.data.roles.includes(props.userInfo.role)) {
            return null;
        }
    }

    let head = (
        <MenuItem className={styles.linkHead}>
            <div className={styles.linkHeadContent}>
                <div className={styles.sidebarlinkIcon}>{props.data.icon}</div>
                <p>{props.data.title}</p>
            </div>
            {props.data.sublinks && (
                <ExpandMoreIcon style={{ transform: isExpanded ? 'rotate(180deg)' : '' }}
                    className={styles.ExpandMoreIcon} htmlColor='#999' />
            )}
        </MenuItem>
    );
    if (props.data.route) {
        head = <Link to={props.data.route}
            onClick={e => {
                e.stopPropagation();
                props.setActiveId(props.data.id);
            }}
        >{head}</Link>
    }

    if (props.data.sublinks) return (
        <ExpansionPanel
            key={props.data.id}
            expanded={isExpanded}
            onChange={props.toggleSubMenu(props.data.id)}
            className={styles.SidebarLink}>
            <AccordionSummary
                className={styles.ExpansionPanelSummary}
                aria-controls={`sublinks-${props.data.title}-content`}

            >{head}
            </AccordionSummary>
            <ExpansionPanelDetails>
                <div className={styles.sublinksContainer}>
                    {props.data.sublinks.map(sublink => (
                        <SidebarLink data={sublink}
                            key={sublink.id}
                            expanded={props.expanded} toggleSubMenu={props.toggleSubMenu}
                            forceUpdate={props.forceUpdate}
                            activeId={props.activeId}
                            setActiveId={props.setActiveId}
                            userInfo={props.userInfo}
                        />
                    ))}
                </div>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );

    return (
        <div className={`${styles.SidebarLink} ${props.activeId === props.data.id ? styles.SidebarLinkActive : ''}`}
            key={props.data.id}
        >{head}
        </div>
    )

}

export default SidebarLink;