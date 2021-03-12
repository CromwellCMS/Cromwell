import { TCmsSettings, TOrder, TOrderInput, TCurrency, TCmsEntityInput } from '@cromwell/core';
import { getCStore, getGraphQLClient, getRestAPIClient } from '@cromwell/core-frontend';
import { Button, Grid, IconButton, TextField, Select, MenuItem } from '@material-ui/core';
import {
    ArrowBack as ArrowBackIcon,
    DeleteForever as DeleteForeverIcon,
    WarningRounded as WarningRoundedIcon,
} from '@material-ui/icons';
import { Autocomplete, Skeleton } from '@material-ui/lab';
import React, { useEffect, useRef, useState } from 'react';
import NumberFormat from 'react-number-format';
import { Link, useParams } from 'react-router-dom';

import { toast } from '../../components/toast/toast';
import { orderStatuses } from '../../constants/order';
import { timezones } from '../../constants/timezones';

import { orderListPageInfo, productPageInfo } from '../../constants/PageInfos';
import styles from './Settings.module.scss';

const SettingsPage = () => {
    const [settings, setSettings] = useState<TCmsSettings | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const client = getRestAPIClient();

    useEffect(() => {
        getConfig();
    }, []);

    const changeSettigns = (key: keyof TCmsSettings, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    }


    const getConfig = async () => {
        setIsLoading(true);
        try {
            const settings = await client.getCmsSettings();
            if (settings) setSettings(settings);
        } catch (e) {
            console.error(e);
        }
        setIsLoading(false);
    }

    const saveConfig = async () => {
        setIsLoading(true);
        try {
            const newConfig = await client.updateCmsConfig({
                protocol: settings.protocol,
                defaultPageSize: settings.defaultPageSize,
                currencies: settings.currencies,
                timezone: settings.timezone,
                language: settings.language,
                favicon: settings.favicon,
                logo: settings.logo,
                headerHtml: settings.headerHtml,
                footerHtml: settings.footerHtml,
            });
            toast.success?.('Settings saved');
            setSettings(newConfig);
        } catch (e) {
            console.error(e);
            toast.success?.('Failed to save settings');
        }
        setIsLoading(false);
    }

    const handleTextFieldChange = (key: keyof TCmsSettings) => (event: React.ChangeEvent<{ value: string }>) => {
        changeSettigns(key, event.target.value);
    }

    return (
        <div className={styles.SettingsPage}>
            <div className={styles.header}>
                <div></div>
                <Button
                    color="primary"
                    onClick={saveConfig}
                >Save</Button>
            </div>
            <div className={styles.list}>
                {!isLoading && settings && (
                    <>
                        <Select
                            className={styles.field}
                            value={settings.timezone ?? 0}
                            onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                                changeSettigns('timezone', parseInt(event.target.value as string));
                            }}
                        >
                            {timezones.map(timezone => (
                                <MenuItem value={timezone.value} key={timezone.value}>{timezone.text}</MenuItem>
                            ))}
                        </Select>
                        <TextField
                            value={settings.language ?? ''}
                            onChange={handleTextFieldChange('language')}
                        />
                        <p>currencies</p>
                        <p>favicon</p>
                        <p>logo</p>
                        <p>code injection</p>
                        <p>defaultPageSize</p>
                    </>
                )}
            </div>
        </div>
    )
}


export default SettingsPage;