import { StaticPageContext } from '@cromwell/core';
import { FrontendPlugin, getRestAPIClient, Link } from '@cromwell/core-frontend';
import { MenuItem, Popover } from '@material-ui/core';
import React, { useState } from 'react';

import config from '../../cromwell.config.json';
import { defaultSettings } from '../defaultSettings';
import { TMainMenuSettings } from '../types';
import { useStyles } from './styles';

type TMainMenuProps = {
    settings: TMainMenuSettings
}

const MainMenu = (props: TMainMenuProps) => {
    const classes = useStyles();
    const items = (props.settings && props.settings.items) ? props.settings.items : defaultSettings.items;
    const [activeItem, setActiveItem] = useState<string>('none');
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setActiveItem('none');
    };
    return (
        <div className={classes.menuList}>
            {items.map(i => {
                const isActive = activeItem === i.title;
                const menuItem = (
                    <MenuItem className={classes.listItem}
                        key={i.title}
                        onMouseLeave={handlePopoverClose}
                        onMouseOver={(e) => {
                            handlePopoverOpen(e);
                            setActiveItem(i.title);
                        }}
                    >
                        <p>{i.title}</p>
                        {(i.sublinks || i.html) && (
                            <Popover
                                id={i.title}
                                open={isActive}
                                anchorEl={anchorEl}
                                className={classes.popover}
                                classes={{
                                    root: classes.popover,
                                    paper: classes.paper
                                }}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}

                                onClose={handlePopoverClose}
                            >
                                <div style={{
                                    // width: i.width ? `${i.width}px` : undefined
                                    display: 'grid',
                                    gridTemplateColumns: `repeat(${i.sublinkCols ? i.sublinkCols : 1}, 1fr)`
                                }}>
                                    {i.sublinks && i.sublinks.map(sub => {
                                        return (
                                            <MenuItem
                                                style={{
                                                    // width: i.sublinkCols ? `${100 / i.sublinkCols}px` : '100%'
                                                }}
                                                key={sub.href}
                                            ><Link href={sub.href + ''}><p>{sub.title}</p></Link></MenuItem>
                                        )
                                    })}
                                </div>
                            </Popover>
                        )}
                    </MenuItem>
                )
                if (i.href) {
                    return <Link href={i.href}><a>{menuItem}</a></Link>
                }
                return menuItem;

            })}
        </div>
    )
}

export const getStaticProps = async (context: StaticPageContext): Promise<TMainMenuProps> => {
    const apiClient = getRestAPIClient();
    const settings: TMainMenuSettings = await apiClient.getPluginSettings(config.name);

    return {
        settings
    }

}

export default FrontendPlugin<TMainMenuProps>(MainMenu, 'MainMenu');
