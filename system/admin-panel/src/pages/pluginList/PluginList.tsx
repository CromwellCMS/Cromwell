import { TPluginEntity, TPluginInfo } from '@cromwell/core';
import { getGraphQLClient, getRestAPIClient } from '@cromwell/core-frontend';
import { Button, Card, IconButton, Tooltip } from '@material-ui/core';
import {
    AddCircleOutline as AddCircleOutlineIcon,
    Delete as DeleteIcon,
    LibraryAdd as LibraryAddIcon,
    Settings as SettingsIcon,
} from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { LoadingStatus } from '../../components/loadBox/LoadingStatus';
import { pluginPageInfo } from '../../constants/PageInfos';
import styles from './PluginList.module.scss';

export default function PluginList() {
    const history = useHistory();
    const [pluginInfoList, setPluginInfoList] = useState<string[] | null>(null);
    const [pluginList, setPluginList] = useState<TPluginEntity[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getPluginList = async () => {
        // Get info by parsing directory 
        const pluginInfos = await getRestAPIClient()?.getPluginList();

        // Get info from DB
        const graphQLClient = getGraphQLClient();
        if (graphQLClient) {
            try {
                const pluginEntities: TPluginEntity[] = await graphQLClient.getAllEntities('Plugin',
                    graphQLClient.PluginFragment, 'PluginFragment');
                if (pluginEntities && Array.isArray(pluginEntities)) setPluginList(pluginEntities);
            } catch (e) { console.error(e); }
        }

        if (pluginInfos && Array.isArray(pluginInfos)) setPluginInfoList(pluginInfos);
        setIsLoading(false);
    }

    useEffect(() => {
        getPluginList();
    }, []);

    const handleOpenPluginPage = (pluginName: string) => () => {
        const route = `${pluginPageInfo.baseRoute}?pluginName=${pluginName}`;
        history.push(route);
    }

    const handleDeletePlugin = (pluginName: string) => () => {

    }

    const handleInstallPlugin = (pluginName: string) => async () => {
        setIsLoading(true);
        let success = false;
        try {
            success = await getRestAPIClient()?.installPlugin(pluginName);
            await getPluginList();
        } catch (e) {
            console.error(e);
        }
        setIsLoading(false);

        if (success) {
            toast.success('Plugin installed');
        } else {
            toast.error('Failed to install plugin');
        }
    }

    const handleOpenMarket = () => {

    }

    return (
        <div className={styles.PluginList}>
            <div className={styles.pluginItem}>
                <Button
                    onClick={handleOpenMarket}
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<AddCircleOutlineIcon />}
                >Add plugins</Button>
            </div>
            {pluginInfoList && pluginInfoList.map(pluginName => {
                const pluginEntity = pluginList?.find(ent => ent.name === pluginName)
                const title = pluginEntity?.title ?? pluginName;

                return (<Card className={styles.pluginItem}>
                    <p className={styles.pluginName}>{title}</p>
                    <div className={styles.actions}>
                        {(pluginEntity && pluginEntity.isInstalled) ? (
                            pluginEntity.hasAdminBundle ? (
                                <Tooltip title="Settings">
                                    <IconButton onClick={handleOpenPluginPage(pluginName)}>
                                        <SettingsIcon />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                    <div style={{ opacity: 0.3, padding: '12px' }}><SettingsIcon /></div>
                                )
                        ) : (
                                <Tooltip title="Install plugin">
                                    <IconButton onClick={handleInstallPlugin(pluginName)}>
                                        <LibraryAddIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                        <Tooltip title="Delete plugin">
                            <IconButton onClick={handleDeletePlugin(pluginName)}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </Card>)
            })}
            <LoadingStatus isActive={isLoading} />
        </div>
    )
}
