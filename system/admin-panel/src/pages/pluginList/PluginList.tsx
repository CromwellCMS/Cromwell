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
    const [pluginInfoList, setPluginInfoList] = useState<TPluginInfo[] | null>(null);
    const [pluginList, setPluginList] = useState<TPluginEntity[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getPluginList = async () => {
        // Get info by parsing directory 
        const pluginInfos = await getRestAPIClient()?.getPluginList();

        // Get info from DB
        const graphQLClient = getGraphQLClient();
        if (graphQLClient) {
            const pluginEntities: TPluginEntity[] = await graphQLClient.getAllEntities('Plugin',
                graphQLClient.PluginFragment, 'PluginFragment');
            if (pluginEntities && Array.isArray(pluginEntities)) setPluginList(pluginEntities);
        }

        if (pluginInfos && Array.isArray(pluginInfos)) setPluginInfoList(pluginInfos);
        setIsLoading(false);
    }

    useEffect(() => {
        getPluginList();
    }, []);

    const handleOpenPluginPage = (pluginName: string) => () => {
        const route = `${pluginPageInfo.baseRoute}/${pluginName}`;
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
            {pluginInfoList && pluginInfoList.map(pluginInfo => {
                const pluginEntity = pluginList?.find(ent => ent.name === pluginInfo.name)

                return (<Card className={styles.pluginItem}>
                    <p className={styles.pluginName}>{pluginInfo.name}</p>
                    <div>
                        {(pluginEntity && pluginEntity.isInstalled) ? (
                            <Tooltip title="Settings">
                                <IconButton onClick={handleOpenPluginPage(pluginInfo.name)}>
                                    <SettingsIcon />
                                </IconButton>
                            </Tooltip>
                        ) : (
                                <Tooltip title="Install plugin">
                                    <IconButton onClick={handleInstallPlugin(pluginInfo.name)}>
                                        <LibraryAddIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                        <Tooltip title="Delete plugin">
                            <IconButton onClick={handleDeletePlugin(pluginInfo.name)}>
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
