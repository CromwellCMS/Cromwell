import { TPackageCromwellConfig } from '@cromwell/core';
import { AdminPanelWidgetPlace, getRestApiClient, LoadBox } from '@cromwell/core-frontend';
import React, { useEffect, useState } from 'react';

import styles from './PluginPage.module.scss';

const pluginsSettings: Record<string, any> = {};
const pluginInfos: Record<string, TPackageCromwellConfig> = {};

const PluginPage = (props) => {
    const urlParams = new URLSearchParams(props?.location?.search);
    const pluginName = urlParams.get('pluginName');
    const apiClient = getRestApiClient();
    const [canShow, setCanShow] = useState(false);

    useEffect(() => {
        const getInfos = async () => {
            try {
                const allInfos: TPackageCromwellConfig[] = await getRestApiClient()?.getPluginList();
                const info = allInfos.find(inf => inf.name === pluginName);
                if (info) {
                    pluginInfos[pluginName] = info;
                }
            } catch (e) {
                console.error(e);
            }
        }
        const getSettings = async () => {
            try {
                const settings: any = await apiClient?.getPluginSettings(pluginName);
                if (settings) {
                    pluginsSettings[pluginName] = settings;
                }
            } catch (e) {
                console.error(e);
            }
        }

        (async () => {
            await Promise.all([getInfos(), getSettings()]);
            setCanShow(true);
        })()
    }, []);

    if (!canShow) return <LoadBox />

    return (
        <div className={styles.PluginPage}>
            <AdminPanelWidgetPlace
                widgetName="PluginSettings"
                pluginName={pluginName}
                widgetProps={{
                    pluginName,
                    pluginSettings: pluginsSettings[pluginName] ?? {},
                    pluginInfo: pluginInfos[pluginName] ?? {},
                }}
            />
        </div>
    )
}

export default PluginPage;
