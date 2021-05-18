import { TCCSVersion, TPackageCromwellConfig, TPluginEntity } from '@cromwell/core';
import { getGraphQLClient, getRestAPIClient } from '@cromwell/core-frontend';
import { Button, Grid, IconButton, LinearProgress, Tooltip } from '@material-ui/core';
import {
    AddCircleOutline as AddCircleOutlineIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
    LibraryAdd as LibraryAddIcon,
    Settings as SettingsIcon,
    Update as UpdateIcon,
} from '@material-ui/icons';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Modal from '../../components/modal/Modal';
import { SkeletonPreloader } from '../../components/SkeletonPreloader';
import { toast } from '../../components/toast/toast';
import { pluginPageInfo } from '../../constants/PageInfos';
import commonStyles from '../../styles/common.module.scss';
import { loadPlugins, loadPlugin } from '../../helpers/loadPlugins';
import styles from './PluginList.module.scss';


class PluginList extends React.Component<Partial<RouteComponentProps>, {
    isLoading: boolean;
    pluginPackages: TPackageCromwellConfig[];
    installedPlugins: TPluginEntity[];
    updateModalInfo?: {
        update: TCCSVersion;
        plugin: TPluginEntity;
        info: TPackageCromwellConfig;
    } | null;
}> {

    private pluginUpdates: Record<string, TCCSVersion> = {};
    private pluginsUnderUpdate: Record<string, boolean> = {};
    private updateInterval;

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

    componentWillUnmount() {
        if (this.updateInterval) clearInterval(this.updateInterval);
    }

    private async init() {
        this.setState({ isLoading: true });
        await this.getPluginList();
        this.setState({ isLoading: false });

        await this.getPluginUpdates();

        this.updateInterval = setInterval(this.getPluginList, 30000);
    }

    private getPluginList = async () => {
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

            if (pluginEntities && Array.isArray(pluginEntities)) {
                pluginEntities.forEach(ent => {
                    this.pluginsUnderUpdate[ent.name] = ent.isUpdating;
                })

                this.setState({
                    installedPlugins: pluginEntities
                });
            }

        } catch (e) { console.error(e); }

    }

    private getPluginUpdates = async () => {
        for (const plugin of this.state.pluginPackages) {
            this.pluginUpdates[plugin.name] = undefined;
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

    private handleDeletePlugin = (pluginName: string) => async () => {
        await getRestAPIClient().deletePlugin(pluginName);
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

    private handleShowUpdate = (plugin?: TPluginEntity, info?: TPackageCromwellConfig, update?: TCCSVersion,) => () => {
        if (plugin && update) {
            this.setState({
                updateModalInfo: {
                    plugin,
                    update,
                    info,
                }
            });
        }
    }

    private startUpdate = async (plugin: TPluginEntity) => {
        this.pluginsUnderUpdate[plugin.name] = true;
        this.setState({ updateModalInfo: null });
        let success;
        try {
            success = await getRestAPIClient().updatePlugin(plugin.name);
        } catch (error) {
            console.error(error)
        }

        if (success) this.pluginUpdates[plugin.name] = undefined;

        try {
            await this.getPluginList();
        } catch (error) {
            console.error(error)
        }

        await loadPlugin(plugin.name);

        if (success) toast.success('Plugin updated');
        else toast.error('Failed to update plugin');
        this.pluginsUnderUpdate[plugin.name] = false;
        this.forceUpdate();

        loadPlugins({ onlyNew: true });
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
                                    onClick={this.handleShowUpdate(pluginEntity, info, availableUpdate)}
                                    style={{ cursor: availableUpdate ? 'pointer' : 'initial' }}
                                >{(info?.version ?? '') + (availableUpdate ? ' > ' + availableUpdate.version + ' Open info' : '')}</p>
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
    info?: TPackageCromwellConfig;
    onStartUpdate: (plugin: TPluginEntity) => void;
    onClose: () => void;
}) => {
    const { update, plugin, info } = props;
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
            <p>{info?.version ?? ''} {'>'} {update.version}</p>

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
