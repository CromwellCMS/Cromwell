import { TCmsSettings } from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';

import { toast } from '../../components/toast/toast';
import { launguages } from '../../constants/launguages';
import ImagePicker from '../../components/imagePicker/ImagePicker';
import { timezones } from '../../constants/timezones';
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
                    variant="contained"
                    onClick={saveConfig}
                    size="small"
                >Save</Button>
            </div>
            <div className={styles.list}>
                {!isLoading && settings && (
                    <>
                        <FormControl className={styles.field}>
                            <InputLabel>Timezone</InputLabel>
                            <Select
                                value={settings.timezone ?? 0}
                                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                                    changeSettigns('timezone', parseInt(event.target.value as string));
                                }}
                            >
                                {timezones.map(timezone => (
                                    <MenuItem value={timezone.value} key={timezone.value}>{timezone.text}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl className={styles.field}>
                            <InputLabel>Language</InputLabel>
                            <Select
                                className={styles.field}
                                value={settings.language ?? 'en'}
                                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                                    changeSettigns('language', event.target.value);
                                }}
                            >
                                {launguages.map(lang => (
                                    <MenuItem value={lang.code} key={lang.code}>{lang.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <ImagePicker
                            placeholder="Logo"
                            onChange={(val) => changeSettigns('logo', val)}
                            value={settings.logo}
                            className={styles.imageField}
                            backgroundSize='contain'
                            width="110px"
                            height="70px"
                            showRemove
                        />
                        <ImagePicker
                            placeholder="Favicon"
                            onChange={(val) => changeSettigns('favicon', val)}
                            value={settings.favicon}
                            className={styles.imageField}
                            showRemove
                        />
                        <h3 className={styles.subheader} >Code injection</h3>
                        <TextField
                            label="Header HTML"
                            multiline
                            rows={4}
                            value={settings.headerHtml ?? ''}
                            onChange={handleTextFieldChange('headerHtml')}
                            variant="outlined"
                            className={styles.field}
                        />
                        <TextField
                            label="Footer HTML"
                            multiline
                            rows={4}
                            value={settings.footerHtml ?? ''}
                            onChange={handleTextFieldChange('footerHtml')}
                            variant="outlined"
                            className={styles.field}
                        />
                        {/* <p>currencies</p>
                        <p>defaultPageSize</p> */}
                    </>
                )}
            </div>
        </div>
    )
}


export default SettingsPage;