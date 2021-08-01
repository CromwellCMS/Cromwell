import { TPluginSettingsProps } from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';
import { Button, IconButton } from '@material-ui/core';
import React, { useState } from 'react';
import { toast } from '../../components/toast/toast';
import { Link } from 'react-router-dom';
import { ArrowBack } from '@material-ui/icons';

import LoadBox from '../loadBox/LoadBox';
import styles from './PluginSettingsLayout.module.scss';
import { pluginListPageInfo } from '../../constants/PageInfos';

export default function PluginSettingsLayout<TSettings>(props: TPluginSettingsProps<TSettings>
    & {
        children: (options: {
            pluginSettings: TSettings | undefined;
            setPluginSettings: (settings: TSettings) => void;
            changeSetting: <T extends keyof TSettings>(key: T, value: TSettings[T]) => void;
        }) => JSX.Element;
        disableSave?: boolean;
        loading?: boolean;
    }) {
    const [isLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [pluginSettings, setPluginSettings] = useState(props.pluginSettings ?? {} as TSettings);
    const apiClient = getRestAPIClient();

    const changeSetting = <T extends keyof TSettings>(key: T, value: TSettings[T]) => {
        setPluginSettings(prev => ({
            ...prev,
            [key]: value,
        }))
    }

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await apiClient?.savePluginSettings(props.pluginName, pluginSettings);
            toast.success('Settings saved');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save settings');
        }
        setIsSaving(false);
    }

    return (
        <div className={styles.PluginSettingsLayout}>
            {isLoading || props.loading ? (
                <LoadBox />
            ) : (
                <div className={styles.content}>
                    <div className={styles.header}>
                        <Link to={pluginListPageInfo.route}>
                            <IconButton >
                                <ArrowBack />
                            </IconButton>
                        </Link>
                        <div className={styles.headerLeft}>
                            {props.pluginInfo?.icon && (
                                <div className={styles.icon}
                                    style={{ backgroundImage: `url("data:image/png;base64,${props.pluginInfo.icon}")` }}
                                ></div>
                            )}
                            <p className={styles.title}>{props.pluginInfo?.title ?? ''}</p>
                            <p className={styles.version}>v.{props.pluginInfo?.version ?? ''}</p>
                        </div>
                        <Button variant="contained" color="primary"
                            className={styles.saveBtn}
                            onClick={handleSave}
                            disabled={isSaving || props.disableSave}
                        >Save</Button>
                    </div>
                    <div className={styles.main}>
                        {props.children({ pluginSettings, setPluginSettings, changeSetting })}
                    </div>
                </div>
            )}
        </div >
    )
}
