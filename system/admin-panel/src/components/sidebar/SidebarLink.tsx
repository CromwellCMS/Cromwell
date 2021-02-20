import { Accordion, AccordionDetails, AccordionSummary, MenuItem as MuiMenuItem, withStyles } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { SidebarLinkType } from '../../constants/PageInfos';
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
    data: SidebarLinkType,
    toggleSubmenu: (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => void,
    expanded: string | false;
    forceUpdate: () => void;
    setActiveId: (id: string) => void;
    activeId: string;
}) => {
    const isExpanded = props.expanded === props.data.id;

    let head = (
        <MenuItem
            className={styles.linkHead}
        >
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
            onChange={props.toggleSubmenu(props.data.id)}
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
                            expanded={props.expanded} toggleSubmenu={props.toggleSubmenu}
                            forceUpdate={props.forceUpdate}
                            activeId={props.activeId}
                            setActiveId={props.setActiveId}
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