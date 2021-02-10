import React, { useState } from 'react'
import { TAdminPanelPluginProps, getStoreItem } from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';
import {
    TextField, Button, Checkbox, FormControlLabel
} from '@material-ui/core';
import { TFilteredList, TProductFilterSettings } from '../types';
import { defaultSettings } from '../constants';
import { useStyles } from './styles';

export default function index(props: TAdminPanelPluginProps<TProductFilterSettings>) {
    const { pluginName, settings } = props;
    const classes = useStyles();
    const [isLoading, setIsloading] = useState(false);
    const apiClient = getRestAPIClient();

    const mobileIconPosition = settings?.mobileIconPosition ?? defaultSettings.mobileIconPosition;
    const [iconTop, setIconTop] = useState<number>(mobileIconPosition.top);
    const [iconLeft, setIconLeft] = useState<number>(mobileIconPosition.left);
    const [collapsedByDefault, setcollapsedByDefault] = useState<boolean>(settings?.collapsedByDefault ?? defaultSettings.collapsedByDefault);
    const [mobileCollapsedByDefault, setmobileCollapsedByDefault] = useState<boolean>(settings?.mobileCollapsedByDefault ?? defaultSettings.mobileCollapsedByDefault);

    const handleSave = async () => {
        setIsloading(true);
        const _settings = settings ?? {};

        const _mobileIconPosition = {
            top: iconTop,
            left: iconLeft
        }
        _settings.mobileIconPosition = _mobileIconPosition;
        _settings.collapsedByDefault = collapsedByDefault;
        _settings.mobileCollapsedByDefault = mobileCollapsedByDefault;

        try {
            await apiClient?.savePluginSettings(pluginName, _settings);
            getStoreItem('notifier')?.success?.('Saved!');

        } catch (e) {
            console.error(e);
            getStoreItem('notifier')?.error?.('Failed to save');
        }
        setIsloading(false);
    }

    return (
        <div className={`${classes.paper} ${classes.content}`}>
            <h1 style={{ marginBottom: '10px' }}>ProductFilter</h1>
            <h3 style={{ marginBottom: '10px', marginTop: '10px' }}>Mobile icon position (in pixels):</h3>
            <TextField label="Top" value={iconTop} style={{ marginBottom: '10px' }}
                onChange={e => setIconTop(parseInt(e.target.value))} />
            <TextField label="Left" value={iconLeft} style={{ marginBottom: '10px' }}
                onChange={e => setIconLeft(parseInt(e.target.value))} />
            <h3 style={{ marginBottom: '10px', marginTop: '10px' }}>Options visibility</h3>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={collapsedByDefault}
                        onChange={() => setcollapsedByDefault(!collapsedByDefault)}
                        color="primary"
                    />
                }
                label="All options collapsed by default at desktop screen"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={mobileCollapsedByDefault}
                        onChange={() => setmobileCollapsedByDefault(!mobileCollapsedByDefault)}
                        color="primary"
                    />
                }
                label="All options collapsed by default at mobile screen"
            />
            <Button variant="contained" color="primary"
                className={classes.saveBtn}
                size="large"
                onClick={handleSave}>Save</Button>
        </div>
    )
}
