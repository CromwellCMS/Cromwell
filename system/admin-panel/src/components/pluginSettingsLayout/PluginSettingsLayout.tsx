import { TPluginSettingsProps } from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import { Button, IconButton, Tooltip } from '@material-ui/core';
import { ArrowBack, InfoOutlined as InfoIcon } from '@material-ui/icons';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { toast } from '../../components/toast/toast';
import { pluginListPageInfo } from '../../constants/PageInfos';
import commonStyles from '../../styles/common.module.scss';
import LoadBox from '../loadBox/LoadBox';
import MarketModal from '../market/MarketModal';
import Modal from '../modal/Modal';
import styles from './PluginSettingsLayout.module.scss';

export default function PluginSettingsLayout<TSettings>(props: TPluginSettingsProps<TSettings>
    & {
        children: React.ReactNode | ((options: {
            pluginSettings: TSettings | undefined;
            setPluginSettings: (settings: TSettings) => void;
            changeSetting: <T extends keyof TSettings>(key: T, value: TSettings[T]) => void;
            saveSettings: () => Promise<void>;
        }) => JSX.Element);
        disableSave?: boolean;
        loading?: boolean;
        onSave?: (pluginSettings: TSettings) => any | Promise<any>;
    }) {
    const [isLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);
    const [pluginSettings, setPluginSettings] = useState(props.pluginSettings ?? {} as TSettings);
    const apiClient = getRestApiClient();


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
            await props.onSave?.(pluginSettings);
            toast.success('Settings saved');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save settings');
        }
        setIsSaving(false);
    }

    const toggleOpenInfo = () => {
        setInfoOpen(!infoOpen);
    }

    return (
        <div className={styles.PluginSettingsLayout}>
            {isLoading || props.loading ? (
                <LoadBox />
            ) : (
                <div className={styles.content}>
                    <div className={styles.header}>
                        <div style={{ display: 'flex' }}>
                            <Link to={pluginListPageInfo.route}>
                                <IconButton
                                    style={{ marginRight: '10px' }}
                                >
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
                        </div>
                        <div >
                            {props.pluginInfo && (
                                <Tooltip title="Info">
                                    <IconButton
                                        style={{ marginRight: '10px' }}
                                        onClick={toggleOpenInfo}>
                                        <InfoIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                            <Button variant="contained" color="primary"
                                className={styles.saveBtn}
                                onClick={handleSave}
                                disabled={isSaving || props.disableSave}
                            >Save</Button>
                        </div>
                    </div>
                    <div className={styles.main}>
                        {typeof props.children === 'function' ? props.children({
                            pluginSettings,
                            setPluginSettings,
                            changeSetting,
                            saveSettings: handleSave
                        }) : props.children ? props.children : null}
                    </div>
                    <Modal
                        open={infoOpen}
                        blurSelector="#root"
                        className={commonStyles.center}
                        onClose={toggleOpenInfo}
                    >
                        {infoOpen && props.pluginInfo && (
                            <MarketModal
                                data={props.pluginInfo}
                                noInstall
                            />
                        )}
                    </Modal>
                </div>
            )}
        </div >
    )
}
