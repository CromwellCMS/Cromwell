import { TFrontendPluginProps, TGetStaticProps } from '@cromwell/core';
import { iconFromPath, Link } from '@cromwell/core-frontend';
import { Collapse, IconButton, MenuItem, Popover, useMediaQuery, useTheme } from '@material-ui/core';
import React, { useState } from 'react';

import { TMainMenuItem, TMainMenuSettings } from '../types';
import { useStyles } from './styles';

const ExpandMoreIcon = iconFromPath(<path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>);

const MainMenu = (props: TFrontendPluginProps<TMainMenuSettings>) => {
    const classes = useStyles();
    const items = props?.data?.items ?? [];
    const [activeItem, setActiveItem] = useState<string>('none');
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        if (!isMobile) {
            setAnchorEl(null);
            setActiveItem('none');
        }
    };

    const handleItemMouseOver = (item: TMainMenuItem) => (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (!isMobile) {
            handlePopoverOpen(event);
            setActiveItem(item.title);
        }
    }

    const handleItemMobileClick = (item: TMainMenuItem) => (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.stopPropagation();
        event.preventDefault();
        setActiveItem(item.title);
    }

    return (
        <div className={isMobile ? classes.mobileMenuList : classes.menuList}>
            {items.map((i, index) => {
                const isActive = activeItem === i.title;

                const menuSubitems = (
                    <div style={{
                        gridTemplateColumns: `repeat(${i.sublinkCols ? i.sublinkCols : 1}, 1fr)`
                    }}
                        className={isMobile ? classes.menuSubitemsMobile : classes.menuSubitems}
                    >
                        {i.sublinks?.length && i.sublinks.map((sub, subIndex) => {
                            return (
                                <MenuItem
                                    style={{
                                        // width: i.sublinkCols ? `${100 / i.sublinkCols}px` : '100%'
                                    }}
                                    key={subIndex}
                                ><Link href={sub.href + ''}>
                                        <p className={classes.sublinkTitle}>{sub?.title ?? ''}</p>
                                    </Link>
                                </MenuItem>
                            )
                        })}
                    </div>
                )

                const menuItem = (
                    <MenuItem className={classes.listItemWrapper}
                        key={index}
                        onMouseLeave={handlePopoverClose}
                        onMouseOver={handleItemMouseOver(i)}
                    >
                        <div className={classes.listItem}>
                            <p className={classes.linkTitle}>{i.title}</p>
                            {isMobile && (i.sublinks?.length || i.html) && (
                                <IconButton onClick={handleItemMobileClick(i)}>
                                    <ExpandMoreIcon
                                        className={classes.expandMoreIcon}
                                        style={{ transform: isActive ? 'rotate(180deg)' : '' }}
                                    />
                                </IconButton>
                            )}

                        </div>
                        {(i.sublinks?.length || i.html) && isMobile && (
                            <Collapse in={isActive} timeout="auto" unmountOnExit>
                                {menuSubitems}
                            </Collapse>
                        )}
                        {(i.sublinks?.length || i.html) && !isMobile && (
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
                                {menuSubitems}
                            </Popover>
                        )}
                    </MenuItem>
                )
                if (i.href) {
                    return <Link href={i.href} key={index}><a>{menuItem}</a></Link>
                }
                return menuItem;

            })}
        </div>
    )
}

export default MainMenu;

export const getStaticProps: TGetStaticProps<TMainMenuSettings> = async (context): Promise<TMainMenuSettings | undefined> => {
    return context.pluginSettings;
}