import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    MenuItem as MuiMenuItem
} from '@material-ui/core';
import { withStyles } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { sideBarLinks, SidebarLinkType } from '../../constants/PageInfos';
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

const ExpansionPanelSummary = withStyles({
    root: {
        padding: 0,
        minHeight: '30px',
        '&$expanded': {
            minHeight: '30px'
        },
    },
    content: {
        margin: '0',
        '&$expanded': {
            margin: '0',
        },
    },
    expandIcon: {
        marginRight: '0'
    },
    expanded: {},
})(AccordionSummary);

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

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
}

function Sidebar() {
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const forceUpdate = useForceUpdate()
    const toggleSubmenu = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };
    return (
        <div className={styles.Sidebar}>
            {sideBarLinks.map(link => <SidebarLink data={link} key={link.route}
                toggleSubmenu={toggleSubmenu} expanded={expanded}
                forceUpdate={forceUpdate}
            />)}
        </div>
    )
}

const SidebarLink = (props: {
    data: SidebarLinkType,
    toggleSubmenu: (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => void,
    expanded: string | false;
    forceUpdate: () => void;
}) => {
    const history = useHistory();
    const handleNav = (route: string) => {
        history.push(route);
        props.forceUpdate();
    }
    const isExpanded = props.expanded === props.data.route;

    const head = (
        <a href={props.data.route} onClick={(e) => e.preventDefault()}>
            <MenuItem
                onClick={e => {
                    isExpanded ? e.stopPropagation() : '';
                    handleNav(props.data.route);
                }}
                className={styles.SidebarLink__head}
            >
                <div className={styles.sidebarlinkIcon}>{props.data.icon}</div>
                <p>{props.data.title}</p>
            </MenuItem>
        </a>
    )

    if (props.data.sublinks) return (
        <ExpansionPanel expanded={isExpanded} onChange={props.toggleSubmenu(props.data.route)} className={styles.SidebarLink}>
            <AccordionSummary
                className={styles.ExpansionPanelSummary}
                expandIcon={<ExpandMoreIcon style={{ marginRight: '0' }} className={styles.ExpandMoreIcon} />}
                aria-controls={`sublinks-${props.data.title}-content`}
            >
                {head}
            </AccordionSummary>
            <ExpansionPanelDetails>
                <div className={styles["SidebarLink__sublinks-container"]}>
                    {props.data.sublinks.map(sublink => (
                        <SidebarLink data={sublink} key={sublink.route}
                            expanded={props.expanded} toggleSubmenu={props.toggleSubmenu}
                            forceUpdate={props.forceUpdate}
                        />
                    ))}
                </div>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );

    return (
        <div className={`${styles.SidebarLink} ${history.location.pathname === props.data.route ? styles.SidebarLinkActive : ''}`}>
            {head}
        </div>
    )

}

export default Sidebar;