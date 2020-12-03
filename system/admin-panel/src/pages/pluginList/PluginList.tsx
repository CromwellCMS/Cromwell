import React, { useEffect, useState } from 'react';
import { getRestAPIClient, loadFrontendBundle } from '@cromwell/core-frontend';
import { useHistory } from 'react-router-dom';
import { TPluginConfig, TPluginInfo } from '@cromwell/core';
import {
    createStyles, makeStyles, Theme, Card,
    CardActionArea,
    CardActions,
    Collapse,
    IconButton,
    TextField,
    MenuItem,
    Button,
    CircularProgress
} from '@material-ui/core';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Delete as DeleteIcon,
} from '@material-ui/icons';
import { pluginPageInfo } from '../../constants/PageInfos';
import styles from './PluginList.module.scss'
import commonStyles from '../../styles/common.module.scss';

export default function PluginList() {
    const history = useHistory();
    const [pluginList, setPluginList] = useState<TPluginInfo[] | null>(null);

    const getPluginList = async () => {
        const plugs = await getRestAPIClient()?.getPluginList();
        if (plugs && Array.isArray(plugs)) setPluginList(plugs);
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

    return (
        <div className={styles.PluginList}>
            {pluginList && pluginList.map(pluginInfo => {
                return (<Card className={styles.pluginItem}>
                    <p className={styles.pluginName}>{pluginInfo.name}</p>
                    <div>
                        <IconButton onClick={handleOpenPluginPage(pluginInfo.name)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={handleDeletePlugin(pluginInfo.name)}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </Card>)
            })}
        </div>
    )
}
