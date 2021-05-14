import { TCCSVersion, TPackageCromwellConfig, TPluginEntity } from '@cromwell/core';
import { getGraphQLClient, getRestAPIClient } from '@cromwell/core-frontend';
import { Button, Collapse, Grid, IconButton, LinearProgress, Tooltip } from '@material-ui/core';
import {
    AddCircleOutline as AddCircleOutlineIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
    ExpandMore as ExpandMoreIcon,
    LibraryAdd as LibraryAddIcon,
    Settings as SettingsIcon,
    Update as UpdateIcon,
} from '@material-ui/icons';
import clsx from 'clsx';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Modal from '../../components/modal/Modal';
import { SkeletonPreloader } from '../../components/SkeletonPreloader';
import { toast } from '../../components/toast/toast';
import { pluginPageInfo } from '../../constants/PageInfos';
import commonStyles from '../../styles/common.module.scss';
import styles from './PluginList.module.scss';


class PluginList extends React.Component<Partial<RouteComponentProps>, {
    isLoading: boolean;
    pluginPackages: TPackageCromwellConfig[];
    installedPlugins: TPluginEntity[];
    updateModalInfo?: {
        update: TCCSVersion;
        plugin: TPluginEntity;
    } | null;
}> {

    private pluginUpdates: Record<string, TCCSVersion> = {};
    private pluginsUnderUpdate: Record<string, boolean> = {};

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            pluginPackages: [],
            installedPlugins: [],
        }
    }

    componentDidMount() {
        this.init();
    }

    private async init() {
        await this.getPluginList();
        await this.getPluginUpdates();
    }

    private getPluginList = async () => {
        this.setState({ isLoading: true });
        try {
            const pluginInfos = await getRestAPIClient()?.getPluginList();
            if (pluginInfos && Array.isArray(pluginInfos)) {
                this.setState({
                    pluginPackages: pluginInfos,
                })
            }
        } catch (e) {
            console.error(e);
        }

        // Get info from DB
        try {
            const graphQLClient = getGraphQLClient();
            const pluginEntities: TPluginEntity[] = await graphQLClient.getAllEntities('Plugin',
                graphQLClient.PluginFragment, 'PluginFragment');

            if (pluginEntities && Array.isArray(pluginEntities))
                this.setState({
                    installedPlugins: pluginEntities
                });

        } catch (e) { console.error(e); }

        this.setState({ isLoading: false });
    }

    private getPluginUpdates = async () => {
        for (const plugin of this.state.pluginPackages) {
            try {
                const update = await getRestAPIClient().getPluginUpdate(plugin.name);
                if (update) {
                    this.pluginUpdates[plugin.name] = update;
                }
            } catch (error) {
                console.error(error);
            }
        }
        this.forceUpdate();
    }


    private handleOpenPluginPage = (pluginName: string) => () => {
        const route = `${pluginPageInfo.baseRoute}?pluginName=${pluginName}`;
        this.props.history.push(route);

    }

    private handleDeletePlugin = (pluginName: string) => () => {

    }

    private handleActivatePlugin = (pluginName: string) => async () => {
        this.setState({ isLoading: true });
        let success = false;
        try {
            success = await getRestAPIClient()?.activatePlugin(pluginName);
            await this.getPluginList();
        } catch (e) {
            console.error(e);
        }
        this.setState({ isLoading: false });

        if (success) {
            toast.success('Plugin installed');
        } else {
            toast.error('Failed to install plugin');
        }
    }

    private handleOpenMarket = () => {

    }

    private handleShowUpdate = (plugin?: TPluginEntity, update?: TCCSVersion) => () => {
        if (plugin && update) {
            this.setState({
                updateModalInfo: {
                    plugin,
                    update,
                }
            });
        }
    }

    private startUpdate = (plugin: TPluginEntity) => {
        this.pluginsUnderUpdate[plugin.name] = true;
        this.setState({ updateModalInfo: null });
    }


    render() {

        const { isLoading, installedPlugins, pluginPackages } = this.state;

        return (
            <div className={styles.PluginList}>
                <Button
                    className={styles.addBtn}
                    onClick={this.handleOpenMarket}
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<AddCircleOutlineIcon />}
                >Add plugins</Button>
                {isLoading && (
                    <SkeletonPreloader style={{
                        maxHeight: '400px'
                    }} />
                )}
                {!isLoading && pluginPackages && pluginPackages.map(info => {
                    const pluginName = info.name;
                    const pluginIcon = info.icon;
                    const pluginEntity = installedPlugins?.find(ent => ent.name === pluginName)
                    const title = pluginEntity?.title ?? info.title ?? pluginName;
                    const availableUpdate = this.pluginUpdates[info.name];
                    const isUnderUpdate = this.pluginsUnderUpdate[info.name];

                    return (<Grid container
                        className={styles.pluginItem}
                        key={info.name}>
                        <div className={styles.info}
                            style={{ opacity: isUnderUpdate ? 0.4 : 1 }}
                        >
                            <div className={styles.icon}
                                style={{ backgroundImage: pluginIcon ? `url("data:image/png;base64,${pluginIcon}")` : '' }}
                            ></div>
                            <Grid item>
                                <p className={styles.pluginName}>{title}</p>
                                <p className={styles.pluginVersion}
                                    onClick={this.handleShowUpdate(pluginEntity, availableUpdate)}
                                    style={{ cursor: availableUpdate ? 'pointer' : 'initial' }}
                                >{(pluginEntity?.version ?? '') + (availableUpdate ? ' > ' + availableUpdate.version + ' Open info' : '')}</p>
                            </Grid>
                        </div>
                        <div className={styles.actions}>
                            {availableUpdate && !isUnderUpdate && pluginEntity && (
                                <Tooltip title="Update">
                                    <IconButton onClick={() => this.startUpdate(pluginEntity)}>
                                        <UpdateIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                            {(pluginEntity && pluginEntity.isInstalled) ? (
                                pluginEntity.hasAdminBundle ? (
                                    <Tooltip title="Settings">
                                        <IconButton
                                            disabled={isUnderUpdate}
                                            onClick={this.handleOpenPluginPage(pluginName)}>
                                            <SettingsIcon />
                                        </IconButton>
                                    </Tooltip>
                                ) : (
                                    <div style={{ opacity: 0.3, padding: '12px' }}><SettingsIcon /></div>
                                )
                            ) : (
                                <Tooltip title="Install plugin">
                                    <IconButton
                                        disabled={isUnderUpdate}
                                        onClick={this.handleActivatePlugin(pluginName)}>
                                        <LibraryAddIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                            <Tooltip title="Delete plugin">
                                <IconButton
                                    disabled={isUnderUpdate}
                                    onClick={this.handleDeletePlugin(pluginName)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                        {isUnderUpdate && (
                            <LinearProgress className={styles.updateProgress} />
                        )}
                    </Grid>)
                })}
                <Modal
                    open={!!this.state.updateModalInfo}
                    onClose={() => this.setState({ updateModalInfo: null })}
                    className={commonStyles.center}
                    blurSelector="#root"
                >
                    <UpdateModalContent
                        pluginsUnderUpdate={this.pluginsUnderUpdate}
                        {...(this.state?.updateModalInfo ?? {})}
                        onStartUpdate={this.startUpdate}
                        onClose={() => this.setState({ updateModalInfo: null })}
                    />
                </Modal>
            </div>
        )
    }
}

const UpdateModalContent = (props: {
    pluginsUnderUpdate: Record<string, boolean>;
    update?: TCCSVersion;
    plugin?: TPluginEntity;
    onStartUpdate: (plugin: TPluginEntity) => void;
    onClose: () => void;
}) => {
    const { update, plugin } = props;
    const isUnderUpdate = plugin?.name && props.pluginsUnderUpdate[plugin.name];

    return (
        <Grid item container xs={12} className={styles.updateModal}>
            <Grid item className={styles.updateHeader} >
                <h3 className={styles.updateTitle}>
                    <UpdateIcon style={{ marginRight: '7px' }} />
            Update available</h3>
                <IconButton
                    style={{ marginRight: '-10px' }}
                    onClick={props.onClose}><CloseIcon /></IconButton>
            </Grid>
            <p>{plugin?.version ?? ''} {'>'} {update.version}</p>

            <div className={styles.changelogList}
                dangerouslySetInnerHTML={{ __html: update.changelog }}></div>
            <Button
                disabled={isUnderUpdate}
                color="primary"
                variant="contained"
                onClick={() => props.onStartUpdate(plugin)}
            >Update</Button>
        </Grid>
    )
}

export default PluginList;
