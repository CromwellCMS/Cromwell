import { PluginSettingsLayout } from '@cromwell/admin-panel';
import { TPluginSettingsProps } from '@cromwell/core';
import { iconFromPath } from '@cromwell/core-frontend';
import { CardActionArea, CardActions, Collapse, IconButton, MenuItem, TextField } from '@material-ui/core';
import clsx from 'clsx';
import React, { useState } from 'react';

import { TMainMenuItem, TMainMenuSettings } from '../types';
import { useStyles } from './styles';

const HighlightOffIcon = iconFromPath(<path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>);
const ExpandMoreIcon = iconFromPath(<path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>);
const AddIcon = iconFromPath(<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>);

export function SettingsPage(props: TPluginSettingsProps<TMainMenuSettings>) {
    const classes = useStyles();
    const forceUpdate = useForceUpdate();

    return (
        <PluginSettingsLayout<TMainMenuSettings> {...props}>
            {({ pluginSettings, changeSetting }) => (
                <>
                    <h2>Menu items</h2>
                    <div className={classes.itemList}>
                        {pluginSettings?.items?.map((data, i) => {
                            return <Item i={i} updateList={forceUpdate} items={pluginSettings.items} />
                        })}
                    </div>
                    <div className={`${classes.card} ${classes.paper}`}>
                        <MenuItem
                            className={classes.addBtn}
                            onClick={() => changeSetting('items',
                                [...(pluginSettings?.items ?? []), { title: '' }]
                            )}>
                            <AddIcon />
                        </MenuItem>
                    </div>
                </>
            )}
        </PluginSettingsLayout>
    )
}

function useForceUpdate() {
    const state = useState(0);
    return () => state[1](value => ++value);
}

const Item = (props: {
    i: number;
    updateList: () => void;
    items?: TMainMenuItem[];
}
) => {
    const forceUpdate = useForceUpdate();
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const item = props.items?.[props.i];
    const handleChange = (prop: keyof TMainMenuItem, val: string) => {
        (item as any)[prop] = val;
        forceUpdate();
    }
    if (!item) return null;

    return (
        <div className={`${classes.card} ${classes.paper}`}>
            <CardActionArea
                className={classes.cardHeader}
                onClick={handleExpandClick}
            >
                <p className={classes.cardTitle}>{item.title}</p>
                <CardActions disableSpacing className={classes.cardActions}>
                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                    <IconButton onClick={(e) => {
                        e.stopPropagation();
                        props.items?.splice(props.i, 1);
                        props.updateList();
                    }}>
                        <HighlightOffIcon />
                    </IconButton>
                </CardActions>
            </CardActionArea>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <div className={classes.cardContent}>
                    <TextField label="Title" variant="outlined"
                        value={item.title}
                        className={classes.field}
                        onChange={(e) => { handleChange('title', e.target.value) }}
                    />
                    <TextField label="Link" variant="outlined"
                        value={item.href}
                        className={classes.field}
                        onChange={(e) => { handleChange('href', e.target.value) }}
                    />
                    <TextField label="Columns" variant="outlined"
                        value={item.sublinkCols}
                        className={classes.field}
                        onChange={(e) => { handleChange('sublinkCols', e.target.value) }}
                    />
                    <TextField label="Width in px" variant="outlined"
                        value={item.width}
                        className={classes.field}
                        onChange={(e) => { handleChange('width', e.target.value) }}
                    />
                    <TextField
                        value={item.html}
                        label="Custom HTML"
                        multiline
                        rows={4}
                        variant="outlined"
                        className={classes.field}
                        onChange={(e) => { handleChange('html', e.target.value) }}
                    />
                    <div className={classes.sublinksList}>
                        <h3 className={classes.sublinksTitle}>Sublinks</h3>
                        {item.sublinks && item.sublinks.map((sl, slIndex) => {
                            return (
                                <div className={`${classes.sublinkItem} ${classes.paper}`} >
                                    <TextField label="Sublink title" variant="outlined"
                                        value={sl.title}
                                        className={classes.subField}
                                        onChange={(e) => { if (item.sublinks) item.sublinks[slIndex].title = e.target.value; forceUpdate(); }}
                                    />
                                    <TextField label="Sublink href" variant="outlined"
                                        value={sl.href}
                                        className={classes.subField}
                                        onChange={(e) => { if (item.sublinks) item.sublinks[slIndex].href = e.target.value; forceUpdate(); }}
                                    />
                                    <IconButton onClick={(e) => {
                                        e.stopPropagation();
                                        if (item.sublinks) item.sublinks.splice(slIndex, 1);
                                        props.updateList();
                                    }}>
                                        <HighlightOffIcon />
                                    </IconButton>
                                </div>
                            )
                        })}
                        <div className={`${classes.paper} ${classes.card}`}>
                            <MenuItem
                                className={classes.addBtn}
                                onClick={() => {
                                    if (!item.sublinks) item.sublinks = [];
                                    item.sublinks.push({});
                                    forceUpdate();
                                }}>
                                <AddIcon />
                            </MenuItem>
                        </div>
                    </div>
                </div>
            </Collapse>
        </div>
    )
}