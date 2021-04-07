import { TAdminPanelPluginProps } from '@cromwell/core';
import { getRestAPIClient, LoadBox } from '@cromwell/core-frontend';
import { Button, createStyles, makeStyles, TextField, Theme } from '@material-ui/core';
import React, { useState } from 'react';

import { TSettings } from '../types';

export default function index(props: TAdminPanelPluginProps<TSettings>) {
    const apiClient = getRestAPIClient();
    const [isLoading, setIsloading] = useState(false);
    const { pluginName, globalSettings } = props;
    const [size, setSize] = useState(globalSettings?.size ?? 20);
    const classes = useStyles();

    const handleSave = async () => {
        setIsloading(true);
        if (globalSettings) {
            globalSettings.size = size;
            await apiClient?.savePluginSettings(pluginName, globalSettings);
        }
        setIsloading(false);
    }

    const handleChangeValue = (event: any) => {
        const valInt = parseInt(event.target.value);
        if (!isNaN(valInt)) {
            setSize(valInt)
        }
    }

    return (
        <div className={classes.paper}>
            <h1>Product Showcase</h1>
            <p>If used on Product page, displays products from same categories.</p>
            <p>Displays random products on other pages.</p>
            {isLoading ? (
                <LoadBox />
            ) : (
                    <div >
                        <TextField
                            label={'Items in carousel'}
                            className={classes.item}
                            value={size}
                            onChange={handleChangeValue}
                        />
                        <Button variant="contained" color="primary"
                            className={classes.item}
                            size="large"
                            onClick={handleSave}
                        >Save</Button>
                    </div>
                )}
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.04), 0 0 10px 3px rgba(0, 0, 0, 0.05)',
            backgroundColor: '#fff',
            borderRadius: '5px',
            padding: '20px',
            margin: '15px'
        },
        item: {
            display: 'block',
            margin: '20px 0'
        }
    }),
);