import { getBlockInstance, TCCSModuleInfo, TPackageCromwellConfig, TPagedParams } from '@cromwell/core';
import { CList, getCentralServerClient, getRestApiClient, TCList } from '@cromwell/core-frontend';
import { Grid, Skeleton, TextField } from '@mui/material';
import React, { Component } from 'react';
import { debounce } from 'throttle-debounce';

import MarketItem, { ListItemProps } from '../../components/market/MarketItem';
import MarketModal from '../../components/market/MarketModal';
import Modal from '../../components/modal/Modal';
import Pagination from '../../components/pagination/Pagination';
import { toast } from '../../components/toast/toast';
import commonStyles from '../../styles/common.module.scss';
import styles from './PluginMarket.module.scss';

export default class PluginMarket extends Component<
  Record<string, never>,
  {
    installedPlugins: TPackageCromwellConfig[];
    isLoading: boolean;
    openedPlugin?: TCCSModuleInfo;
  }
> {
  private listId = 'plugin_market';
  private filterInput: { search?: string } = {};

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
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
  }

  private getPluginList = async () => {
    try {
      const pluginInfos = await getRestApiClient()?.getPluginList();
      if (pluginInfos && Array.isArray(pluginInfos)) {
        this.setState({
          installedPlugins: pluginInfos,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  public loadList = async ({ pagedParams }: { pagedParams?: TPagedParams<TCCSModuleInfo> } = {}) => {
    return getCentralServerClient().getPluginList(pagedParams, this.filterInput);
  };

  public openPlugin = (info: TCCSModuleInfo) => {
    this.setState({ openedPlugin: info });
  };

  public installPlugin = async (info: TCCSModuleInfo | TPackageCromwellConfig): Promise<boolean> => {
    let success = false;
    try {
      success = await getRestApiClient().installPlugin(info.name);
    } catch (error) {
      console.error(error);
    }
    await this.getPluginList();

    if (success) {
      toast.success('Plugin installed');
    } else {
      toast.error('Failed to install plugin');
    }
    return success;
  };

  private resetList = () => {
    const list = getBlockInstance<TCList>(this.listId)?.getContentInstance();
    list?.clearState();
    list?.init();
  };

  private handleFilterInput = debounce(400, () => {
    this.resetList();
  });

  render() {
    return (
      <div className={styles.PluginMarket}>
        <div className={styles.listHeader}>
          <TextField
            className={styles.filterItem}
            placeholder="Search"
            variant="standard"
            onChange={(event) => {
              this.filterInput.search = event.target.value;
              this.handleFilterInput();
            }}
          />
        </div>
        {this.state.isLoading && preloader}
        {!this.state.isLoading && (
          <CList<TCCSModuleInfo, ListItemProps>
            className={styles.listWrapper}
            id={this.listId}
            ListItem={MarketItem}
            listItemProps={{
              installedModules: this.state?.installedPlugins ?? [],
              install: this.installPlugin,
              open: this.openPlugin,
            }}
            useAutoLoading
            usePagination
            useQueryPagination
            loader={this.loadList}
            cssClasses={{
              scrollBox: styles.list,
              page: styles.listContainer,
            }}
            elements={{
              pagination: Pagination,
              preloader: preloader,
            }}
          />
        )}
        <Modal
          open={!!this.state.openedPlugin}
          blurSelector="#root"
          className={commonStyles.center}
          onClose={() => this.setState({ openedPlugin: undefined })}
        >
          {this.state.openedPlugin && (
            <MarketModal
              installedModules={this.state?.installedPlugins ?? []}
              install={this.installPlugin}
              data={this.state.openedPlugin}
            />
          )}
        </Modal>
      </div>
    );
  }
}

const preloader = (
  <div className={styles.listContainer}>
    {Array(4)
      .fill(1)
      .map((it, index) => {
        return (
          <Grid key={index} item xs={6} lg={4} className={styles.listItem}>
            <Skeleton variant="rectangular" height="388px" width="100%" style={{ margin: '0 10px 20px 10px' }}>
              {' '}
            </Skeleton>
          </Grid>
        );
      })}
  </div>
);
