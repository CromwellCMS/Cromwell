import { getRestAPIClient } from '@cromwell/core-frontend';
import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CircularProgress,
    Collapse,
    createStyles,
    IconButton,
    makeStyles,
    MenuItem,
    TextField,
    Theme,
} from '@material-ui/core';
import { Add as AddIcon, ExpandMore as ExpandMoreIcon, HighlightOff as HighlightOffIcon } from '@material-ui/icons';
import clsx from 'clsx';
import React, { useEffect, useState, useRef } from 'react';

import { TMainMenuItem, TMainMenuSettings } from '../types';
import { useStyles } from './styles';

export default function index({ pluginName }: { pluginName: string }) {
    const apiClient = getRestAPIClient();
    const classes = useStyles();
    const [settings, setSettings] = useState<TMainMenuSettings | null>(null);
    const [isLoading, setIsloading] = useState(false);
    const forceUpdate = useForceUpdate();
    const items = useRef<TMainMenuItem[]>([]);

    useEffect(() => {
        (async () => {
            setIsloading(true);
            const settings: TMainMenuSettings = await apiClient?.getPluginSettings(pluginName);
            if (settings) {
                items.current = settings.items ?? [];
                setSettings(settings);
            }
            setIsloading(false);
        })()
    }, []);
    return (
        <div className={classes.mainMenu}>

            {isLoading ? (
                <LoadBox />
            ) : (
                    <>
                        <h2>Main menu settings</h2>
                        <div className={classes.itemList}>
                            {items.current.map((data, i) => {
                                return <Item i={i} updateList={forceUpdate} items={items.current} />
                            })}
                        </div>
                        <Card className={classes.card}>
                            <MenuItem
                                className={classes.addBtn}
                                onClick={() => { items.current.push({ title: '' }); forceUpdate(); }}>
                                <AddIcon />
                            </MenuItem>
                        </Card>
                        <Button variant="contained" color="primary"
                            className={classes.saveBtn}
                            size="large"
                            onClick={async () => {
                                setIsloading(true);
                                if (settings) {
                                    settings.items = items.current;
                                    await apiClient?.savePluginSettings(pluginName, settings);
                                }
                                setIsloading(false);
                            }}>
                            Save
                        </Button>
                    </>
                )}
        </div>
    )
}

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
}

const Item = (props: {
    i: number;
    updateList: () => void;
    items: TMainMenuItem[];
}
) => {
    const forceUpdate = useForceUpdate();
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const item = props.items[props.i];
    const handleChange = (prop: keyof TMainMenuItem, val: string) => {
        (item as any)[prop] = val;
        forceUpdate();
    }

    return (
        <Card className={classes.card}>
            <CardActionArea
                className={classes.cardHeader}
                onClick={handleExpandClick}
            >
                <p className={classes.cardTitle}>{item.title}</p>
                <CardActions disableSpacing>
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
                        props.items.splice(props.i, 1);
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
                        <h3>Sublinks</h3>
                        {item.sublinks && item.sublinks.map((sl, slIndex) => {
                            return (
                                <Card className={classes.sublinkItem}>
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
                                </Card>
                            )
                        })}
                        <Card className={classes.card}>
                            <MenuItem
                                className={classes.addBtn}
                                onClick={() => {
                                    if (!item.sublinks) item.sublinks = [];
                                    item.sublinks.push({});
                                    forceUpdate();
                                }}>
                                <AddIcon />
                            </MenuItem>
                        </Card>
                    </div>
                </div>
            </Collapse>
        </Card>
    )
}


const useStylesLoadBox = makeStyles((theme: Theme) =>
    createStyles({
        LoadBox: {
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    }),
);
const LoadBox = (props: { size?: number }) => {
    const classes = useStylesLoadBox();
    return (
        <div className={classes.LoadBox} >
            <CircularProgress size={(props.size ? props.size : 150)} />
        </div>
    )
}