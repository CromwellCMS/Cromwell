import { AdminPanelWidgetPlace, getRestAPIClient, LoadBox } from '@cromwell/core-frontend';
import React, { useEffect, useState } from 'react';

import styles from './PluginPage.module.scss';

const pluginsSettings: Record<string, any> = {}

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
                    pluginsSettings[pluginName] = settings;
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
                    pluginSettings: pluginsSettings[pluginName] ?? {}
                }}
            />
        </div>
    )
}

export default PluginPage;
