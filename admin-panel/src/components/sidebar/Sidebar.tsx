import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiMenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import { useHistory } from 'react-router-dom';

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
})(MuiExpansionPanel);

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
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles({
    root: {
        padding: 0,
    },
    expanded: {},
})(MuiExpansionPanelDetails);

const MenuItem = withStyles({
    root: {
        width: '100%',
        paddingTop: '12px',
        paddingBottom: '12px'
    },
})(MuiMenuItem);



function Sidebar() {
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const toggleSubmenu = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };
    return (
        <div className={styles.Sidebar}>
            {sideBarLinks.map(link => <SidebarLink data={link}
                toggleSubmenu={toggleSubmenu} expanded={expanded} />)}
        </div>
    )
}

const SidebarLink = (props: {
    data: SidebarLinkType,
    toggleSubmenu: (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => void,
    expanded: string | false
}) => {

    const history = useHistory();
    const handleNav = (route: string) => {
        history.push(route)
    }
    const isExpanded = props.expanded === props.data.route;

    const head = (
        <MenuItem onClick={e => {
            isExpanded ? e.stopPropagation() : '';
            handleNav(props.data.route);
        }}>
            <p>{props.data.title}</p>
        </MenuItem>
    )

    if (props.data.sublinks) return (
        <ExpansionPanel expanded={isExpanded} onChange={props.toggleSubmenu(props.data.route)} className={styles.SidebarLink}>
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon style={{ marginRight: '0' }} className={"ExpandMoreIcon"} />}
                aria-controls={`sublinks-${props.data.title}-content`}
            >
                {head}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <div className={styles["SidebarLink__sublinks-container"]}>
                    {props.data.sublinks.map(sublink => (
                        <SidebarLink data={sublink} key={sublink.route}
                            expanded={props.expanded} toggleSubmenu={props.toggleSubmenu} />
                    ))}
                </div>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );

    return (
        <div className={styles.SidebarLink}>
            {head}
        </div>
    )

}

export default Sidebar;