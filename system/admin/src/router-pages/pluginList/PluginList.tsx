import { TCCSVersion, TPackageCromwellConfig, TPluginEntity } from '@cromwell/core';
import { getGraphQLClient, getRestApiClient } from '@cromwell/core-frontend';
import { Button, Grid, IconButton, LinearProgress, Tooltip } from '@mui/material';
import {
  AddCircleOutline as AddCircleOutlineIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  InfoOutlined as InfoIcon,
  LibraryAdd as LibraryAddIcon,
  Settings as SettingsIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';
import React from 'react';

import MarketModal from '../../components/market/MarketModal';
import { askConfirmation } from '../../components/modal/Confirmation';
import Modal from '../../components/modal/Modal';
import { SkeletonPreloader } from '../../components/skeleton/SkeletonPreloader';
import { toast } from '../../components/toast/toast';
import { pluginMarketPageInfo, pluginPageInfo } from '../../constants/PageInfos';
import { loadPlugin, loadPlugins } from '../../helpers/loadPlugins';
import commonStyles from '../../styles/common.module.scss';
import styles from './PluginList.module.scss';

class PluginList extends React.Component<
  {},
  {
    isLoading: boolean;
    pluginPackages: TPackageCromwellConfig[];
    installedPlugins: TPluginEntity[];
    openedPlugin?: TPackageCromwellConfig;
    updateModalInfo?: {
      update: TCCSVersion;
      plugin: TPluginEntity;
      info: TPackageCromwellConfig;
    } | null;
  }
> {
  private pluginUpdates: Record<string, TCCSVersion> = {};
  private pluginsUnderUpdate: Record<string, boolean> = {};
  private pageRef = React.createRef<HTMLDivElement>();

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      pluginPackages: [],
      installedPlugins: [],
    };
  }

  componentDidMount() {
    this.init();
  }

  private async init() {
    this.setState({ isLoading: true });
    await this.getPluginList();
    this.setState({ isLoading: false });

    await this.getPluginUpdates();
    setTimeout(this.checkUpdates, 60000);
  }

  private checkUpdates = async () => {
    if (this?.pageRef?.current) {
      await this.getPluginList();
      await this.getPluginUpdates();

      requestAnimationFrame(() => setTimeout(this.checkUpdates, 60000));
    }
  };

  private getPluginList = async () => {
    try {
      const pluginInfos = await getRestApiClient()?.getPluginList();
      if (pluginInfos && Array.isArray(pluginInfos)) {
        this.setState({
          pluginPackages: pluginInfos,
        });
      }
    } catch (e) {
      console.error(e);
    }

    // Get info from DB
    try {
      const graphQLClient = getGraphQLClient();
      const pluginEntities: TPluginEntity[] = await graphQLClient.getAllEntities(
        'Plugin',
        graphQLClient.PluginFragment,
        'PluginFragment',
      );

      if (pluginEntities && Array.isArray(pluginEntities)) {
        pluginEntities.forEach((ent) => {
          this.pluginsUnderUpdate[ent.name] = ent.isUpdating;
        });

        this.setState({
          installedPlugins: pluginEntities,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  private getPluginUpdates = async () => {
    for (const plugin of this.state.pluginPackages) {
      this.pluginUpdates[plugin.name] = undefined;
      try {
        const update = await getRestApiClient().getPluginUpdate(plugin.name);
        if (update) {
          this.pluginUpdates[plugin.name] = update;
        }
      } catch (error) {
        console.error(error);
      }
    }
    this.forceUpdate();
  };

  private handleOpenPluginPage = (pluginName: string) => () => {
    const route = `${pluginPageInfo.baseRoute}?pluginName=${pluginName}`;
    this.props.history.push(route);
  };

  private handleDeletePlugin = (info: TPackageCromwellConfig) => async () => {
    const positive = await askConfirmation({
      title: `Delete plugin ${info.title ?? info.name}?`,
    });
    if (!positive) return;

    const pluginName = info.name;
    this.pluginsUnderUpdate[pluginName] = true;
    this.setState({ updateModalInfo: null });

    try {
      await getRestApiClient().deletePlugin(pluginName);

      try {
        await this.getPluginList();
      } catch (error) {
        console.error(error);
      }
      toast.info('Plugin deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete plugin');
    }

    this.pluginsUnderUpdate[pluginName] = false;
    this.forceUpdate();

    loadPlugins({ onlyNew: true });
  };

  private handleActivatePlugin = (pluginName: string) => async () => {
    this.setState({ isLoading: true });
    let success = false;
    try {
      success = await getRestApiClient()?.activatePlugin(pluginName);
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
  };

  private handleOpenMarket = () => {
    this.props.history?.push(pluginMarketPageInfo.route);
  };

  private handleShowUpdate = (plugin?: TPluginEntity, info?: TPackageCromwellConfig, update?: TCCSVersion) => () => {
    if (plugin && update) {
      this.setState({
        updateModalInfo: {
          plugin,
          update,
          info,
        },
      });
    }
  };

  private startUpdate = async (plugin: TPluginEntity) => {
    this.pluginsUnderUpdate[plugin.name] = true;
    this.setState({ updateModalInfo: null });
    let success;
    try {
      success = await getRestApiClient().updatePlugin(plugin.name);
    } catch (error) {
      console.error(error);
    }

    if (success) this.pluginUpdates[plugin.name] = undefined;

    try {
      await this.getPluginList();
    } catch (error) {
      console.error(error);
    }

    await loadPlugin(plugin.name);

    if (success) toast.success('Plugin updated');
    else toast.error('Failed to update plugin');
    this.pluginsUnderUpdate[plugin.name] = false;
    this.forceUpdate();

    loadPlugins({ onlyNew: true });
  };

  render() {
    const { isLoading, installedPlugins, pluginPackages } = this.state;

    return (
      <div className={styles.PluginList} ref={this.pageRef}>
        <Button
          className={styles.addBtn}
          onClick={this.handleOpenMarket}
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
        >
          Add plugins
        </Button>
        {isLoading && (
          <SkeletonPreloader
            style={{
              maxHeight: '400px',
            }}
          />
        )}
        {!isLoading &&
          pluginPackages &&
          pluginPackages.map((info) => {
            const pluginName = info.name;
            const pluginIcon = info.icon;
            const pluginEntity = installedPlugins?.find((ent) => ent.name === pluginName);
            const title = info.title ?? pluginEntity?.title ?? pluginName;
            let availableUpdate: TCCSVersion | undefined = this.pluginUpdates[info.name];
            if (availableUpdate?.packageVersion === info?.version) availableUpdate = undefined;

            const isUnderUpdate = this.pluginsUnderUpdate[info.name];

            return (
              <Grid container className={styles.pluginItem} key={info.name}>
                <div className={styles.info} style={{ opacity: isUnderUpdate ? 0.4 : 1 }}>
                  <div
                    className={styles.icon}
                    style={{ backgroundImage: pluginIcon ? `url("data:image/png;base64,${pluginIcon}")` : '' }}
                  ></div>
                  <Grid item>
                    <p className={styles.pluginName}>{title}</p>
                    <p
                      className={styles.pluginVersion}
                      onClick={this.handleShowUpdate(pluginEntity, info, availableUpdate)}
                      style={{ cursor: availableUpdate ? 'pointer' : 'initial' }}
                    >
                      {(info?.version ?? '') + (availableUpdate ? ' > ' + availableUpdate.version + ' Open info' : '')}
                    </p>
                  </Grid>
                </div>
                <div className={styles.actions}>
                  <Tooltip title="Info">
                    <IconButton disabled={isUnderUpdate} onClick={() => this.setState({ openedPlugin: info })}>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                  {availableUpdate && !isUnderUpdate && pluginEntity && (
                    <Tooltip title="Update">
                      <IconButton onClick={() => this.startUpdate(pluginEntity)}>
                        <UpdateIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {pluginEntity && pluginEntity.isInstalled ? (
                    pluginEntity.hasAdminBundle ? (
                      <Tooltip title="Settings">
                        <IconButton disabled={isUnderUpdate} onClick={this.handleOpenPluginPage(pluginName)}>
                          <SettingsIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <div style={{ opacity: 0.3, padding: '12px' }}>
                        <SettingsIcon />
                      </div>
                    )
                  ) : (
                    <Tooltip title="Install plugin">
                      <IconButton disabled={isUnderUpdate} onClick={this.handleActivatePlugin(pluginName)}>
                        <LibraryAddIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete plugin">
                    <IconButton disabled={isUnderUpdate} onClick={this.handleDeletePlugin(info)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </div>
                {isUnderUpdate && <LinearProgress className={styles.updateProgress} />}
              </Grid>
            );
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
        <Modal
          open={!!this.state.openedPlugin}
          blurSelector="#root"
          className={commonStyles.center}
          onClose={() => this.setState({ openedPlugin: undefined })}
        >
          {this.state?.openedPlugin && (
            <MarketModal
              installedModules={this.state?.installedPlugins ?? []}
              data={this.state.openedPlugin}
              noInstall
            />
          )}
        </Modal>
      </div>
    );
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
      <Grid item className={styles.updateHeader}>
        <h3 className={styles.updateTitle}>
          <UpdateIcon style={{ marginRight: '7px' }} />
          Update available
        </h3>
        <IconButton style={{ marginRight: '-10px' }} onClick={props.onClose}>
          <CloseIcon />
        </IconButton>
      </Grid>
      <p>
        {info?.version ?? ''} {'>'} {update.version}
      </p>

      <div className={styles.changelogList} dangerouslySetInnerHTML={{ __html: update.changelog }}></div>
      <Button disabled={isUnderUpdate} color="primary" variant="contained" onClick={() => props.onStartUpdate(plugin)}>
        Update
      </Button>
    </Grid>
  );
};

export default PluginList;
