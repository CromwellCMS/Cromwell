import { getStoreItem, setStoreItem } from '@cromwell/core';
import { AdminPanelWidgetPlace, getRestAPIClient, LoadBox } from '@cromwell/core-frontend';
import React, { useEffect, useState } from 'react';

import styles from './PluginPage.module.scss';

const PluginPage = (props) => {
    const urlParams = new URLSearchParams(props?.location?.search);
    const pluginName = urlParams.get('pluginName');
    const apiClient = getRestAPIClient();
    const [canShow, setCanShow] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const settings: any = await apiClient?.getPluginSettings(pluginName);
                if (settings) {
                    const pluginsSettings = getStoreItem('plugins') ?? {};
                    if (!pluginsSettings[pluginName]) pluginsSettings[pluginName] = {}
                    pluginsSettings[pluginName].settings = settings;
                    setStoreItem('plugins', pluginsSettings);
                }
            } catch (e) {
                console.error(e);
            }
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
                    globalSettings: getStoreItem('plugins')?.[pluginName]?.settings ?? {}
                }}
            />
        </div>
    )
}

export default PluginPage;
