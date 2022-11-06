import { getBlockInstance, TCCSModuleInfo, TPackageCromwellConfig } from '@cromwell/core';
import { CList, getCentralServerClient, getRestApiClient, TCList } from '@cromwell/core-frontend';
import { Grid, Skeleton, TextField } from '@mui/material';
import React, { Component, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { debounce } from 'throttle-debounce';

import MarketItem, { ListItemProps } from '../../components/market/MarketItem';
import MarketModal from '../../components/market/MarketModal';
import Modal from '../../components/modal/Modal';
import Pagination from '../../components/pagination/Pagination';
import { toast } from '../../components/toast/toast';
import commonStyles from '../../styles/common.module.scss';
import styles from './ThemeMarket.module.scss';

export const ThemeStore = (props: RouteComponentProps) => {
  const [isLoading, setLoading] = useState(false);
  const [installedThemes, setInstalledThemes] = useState<TPackageCromwellConfig[]>([]);
  const [openedTheme, setOpenedTheme] = useState<TCCSModuleInfo | undefined>();

  return (
    <div className="">
      <div className="grid grid-cols-1 gap-4"></div>
    </div>
  );
};

// export default ThemeStore;
export default class ThemeMarket extends Component<
  Partial<RouteComponentProps>,
  {
    installedThemes: TPackageCromwellConfig[];
    isLoading: boolean;
    openedTheme?: TCCSModuleInfo;
  }
> {
  private listId = 'plugin_market';
  private filterInput: { search?: string } = {};

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      installedThemes: [],
    };
  }

  componentDidMount() {
    this.init();
  }

  private async init() {
    this.setState({ isLoading: true });
    await this.getThemeList();
    this.setState({ isLoading: false });
  }

  private getThemeList = async () => {
    try {
      const infos = await getRestApiClient()?.getThemesInfo();
      if (infos && Array.isArray(infos)) {
        this.setState({
          installedThemes: infos,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  public loadList = async (props) => {
    return getCentralServerClient().getThemeList(props, this.filterInput);
  };

  public openTheme = (info: TCCSModuleInfo) => {
    this.setState({ openedTheme: info });
  };

  public installTheme = async (info: TCCSModuleInfo | TPackageCromwellConfig): Promise<boolean> => {
    let success = false;
    try {
      success = await getRestApiClient().installTheme(info.name);
    } catch (error) {
      console.error(error);
    }
    await this.getThemeList();

    if (success) {
      toast.success('Theme installed');
    } else {
      toast.error('Failed to install theme');
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
      <div className={styles.ThemeMarket}>
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
              installedModules: this.state?.installedThemes ?? [],
              install: this.installTheme,
              open: this.openTheme,
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
          open={!!this.state.openedTheme}
          blurSelector="#root"
          className={commonStyles.center}
          onClose={() => this.setState({ openedTheme: undefined })}
        >
          {this.state?.openedTheme && (
            <MarketModal
              installedModules={this.state?.installedThemes ?? []}
              install={this.installTheme}
              data={this.state.openedTheme}
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
