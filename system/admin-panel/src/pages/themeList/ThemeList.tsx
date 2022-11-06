import { setStoreItem, TCCSVersion, TCmsSettings, TPackageCromwellConfig, TThemeEntity } from '@cromwell/core';
import { getGraphQLClient, getRestApiClient } from '@cromwell/core-frontend';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/outline';
import { RefreshIcon } from '@heroicons/react/solid';

import {
  AddCircleOutline as AddCircleOutlineIcon,
  Close as CloseIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';
import {
  Badge,
  Button,
  CardActionArea,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  LinearProgress,
  Skeleton,
  Typography,
} from '@mui/material';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import { LoadingStatus } from '../../components/loadBox/LoadingStatus';
import MarketModal from '../../components/market/MarketModal';
import { askConfirmation } from '../../components/modal/Confirmation';
import Modal from '../../components/modal/Modal';
import { toast } from '../../components/toast/toast';
import { themeEditPageInfo, themeMarketPageInfo } from '../../constants/PageInfos';
import { loadPlugins } from '../../helpers/loadPlugins';
import { store } from '../../redux/store';
import commonStyles from '../../styles/common.module.scss';
import { ThemePackage, ThemePackageSkeleton } from './components/ThemePackage';
import styles from './ThemeList.module.scss';

const ThemeListing: React.FunctionComponent<RouteComponentProps> = (props) => {
  const [isLoading, setLoading] = useState(false);
  const [isChangingTheme, setChangingTheme] = useState(false);
  const [packages, setPackages] = useState<TPackageCromwellConfig[]>([]);
  const [installedThemes, setInstalledThemes] = useState<TThemeEntity[]>([]);
  const [cmsConfig, setCmsConfig] = useState<TCmsSettings>({});
  const [forceRender, setForceRender] = useState(0);
  const [themeUpdates, setThemeUpdates] = useState<{
    [key: string]: TCCSVersion;
  }>({});
  const [isUpdating, setIsUpdating] = useState<{
    [key: string]: boolean;
  }>({});
  const [deleteModal, setDeleteModal] = useState(false);
  const pageRef = useRef();

  const fetchConfigAndPackages = useCallback(async () => {
    try {
      const client = getRestApiClient();
      const updatedConfig = await client?.getCmsSettings();
      setCmsConfig(updatedConfig);

      const infos = await client?.getThemesInfo();
      infos?.sort((a) => (updatedConfig && a.name === updatedConfig.themeName ? -1 : 1));

      if (infos) setPackages(infos);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const getThemeList = async () => {
    await fetchConfigAndPackages();
    const graphQLClient = getGraphQLClient();
    if (graphQLClient) {
      try {
        const themeEntities: TThemeEntity[] = await graphQLClient.getAllEntities(
          'Theme',
          graphQLClient.ThemeFragment,
          'ThemeFragment',
        );
        if (themeEntities && Array.isArray(themeEntities)) {
          setInstalledThemes(themeEntities);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getThemeUpdates = async () => {
    for (const theme of packages) {
      themeUpdates[theme.name] = undefined;
      try {
        const update = await getRestApiClient().getThemeUpdate(theme.name);
        if (update) {
          themeUpdates[theme.name] = update;
        }
      } catch (error) {
        console.error(error);
      }
    }

    setThemeUpdates(themeUpdates);
  };

  const checkUpdates = async () => {
    if (pageRef?.current) {
      await getThemeList();
      await getThemeUpdates();
    }
  };

  const init = async () => {
    setLoading(true);
    console.log('INIT');
    await getThemeList();
    console.log('INIT DONE');
    setLoading(false);

    await getThemeUpdates();
  };

  useEffect(() => {
    init();
    const timer = setInterval(checkUpdates, 30000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-4" ref={pageRef}>
      <Link to={themeMarketPageInfo.route}>
        <button className="bg-gradient-to-r rounded-xl my-auto mx-auto max-w-lg from-indigo-900 to-pink-800 text-white py-2 transform px-4 transition-all hover:to-pink-600">
          <div className="flex w-full justify-between">
            <PlusIcon className="h-5 fill-white mt-[2px] mr-2 w-5" />
            <div>
              <p className="text-md">Explore themestore</p>
            </div>
          </div>
        </button>
      </Link>
      <div className="flex flex-row gap-4">
        <div className="grid gap-4 grid-cols-1 relative">
          {isChangingTheme && (
            <div className="flex flex-row h-full w-full top-0 left-0 z-30 absolute backdrop-filter backdrop-blur-md items-center">
              <RefreshIcon className="bg-white rounded-full mx-auto h-16 p-2 animate-spin fill-indigo-600 w-16 self-center" />
            </div>
          )}
          {isLoading &&
            Array.from({ length: 3 })
              .fill('-')
              .map((v, i) => (
                <div key={i} className="grid gap-4 grid-cols-1-">
                  <ThemePackageSkeleton />
                </div>
              ))}
          {!isLoading && (
            <div className="grid gap-4 grid-cols-1">
              {packages.map((info) => {
                const isActive = Boolean(cmsConfig && cmsConfig.themeName === info.name);
                const entity = installedThemes?.find((ent) => ent.name === info.name);
                const isInstalled = entity?.isInstalled ?? false;
                const availableUpdate = themeUpdates[info.name];
                const isUnderUpdate = isUpdating[info.name];

                return (
                  <ThemePackage
                    key={info.name}
                    info={info}
                    isActive={isActive}
                    isInstalled={isInstalled}
                    availableUpdate={availableUpdate}
                    isUnderUpdate={isUnderUpdate}
                    setDeleteModal={setDeleteModal}
                    isChangingTheme={isChangingTheme}
                    setChangingTheme={setChangingTheme}
                    updateConfig={fetchConfigAndPackages}
                  />
                );
              })}
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl h-auto max-w-xs shadow-md mt-2 max-h-[24rem] p-4 shadow-indigo-300 hidden lg:inline-block xl:max-w-md xl:max-h-[22rem] dark:bg-gray-900">
          <h2 className="font-bold my-3 text-2xl text-indigo-600">Did You Know?</h2>
          <hr />
          <p className="text-sm py-2">
            Cromwell CMS follows principles of headless CMS where API server runs separately from frontend server. So
            basically you can create any type of frontend and host it wherever you like. But in this scenario, you need
            to manage and deploy this frontend by yourself. To simply the workflow Cromwell CMS has its theming engine.
            Users can easily install Themes from the official market right in their Admin panel GUI, make active, delete
            them, change layout in the Theme Editor as long as Themes follow the guidelines we are going to show.
            <Link
              className="my-3 text-indigo-600 underline"
              to="https://cromwellcms.com/docs/development/theme-development"
              target="_blank"
            >
              Learn more about theme development.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

class ThemeList extends React.Component<
  Partial<RouteComponentProps>,
  {
    isLoading: boolean;
    packages: TPackageCromwellConfig[];
    installedThemes: TThemeEntity[];
    cmsConfig?: TCmsSettings;
    openedTheme?: TPackageCromwellConfig;
    isChangingTheme?: boolean;
    updateModalInfo?: {
      update: TCCSVersion;
      entity: TThemeEntity;
      info: TPackageCromwellConfig;
    } | null;
  }
> {
  private themeUpdates: Record<string, TCCSVersion> = {};
  private themeUnderUpdate: Record<string, boolean> = {};
  private pageRef = React.createRef<HTMLDivElement>();

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isChangingTheme: false,
      packages: [],
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

    await this.getThemeUpdates();
    setTimeout(this.checkUpdates, 30000);
  }

  private checkUpdates = async () => {
    if (this?.pageRef?.current) {
      await this.getThemeList();
      await this.getThemeUpdates();

      requestAnimationFrame(() => setTimeout(this.checkUpdates, 30000));
    }
  };

  private getThemeList = async () => {
    try {
      const client = getRestApiClient();
      const updatedConfig = await client?.getCmsSettings();
      this.setState({ cmsConfig: updatedConfig });

      // Get info by parsing directory
      const infos = await client?.getThemesInfo();
      infos?.sort((a) => (updatedConfig && a.name === updatedConfig.themeName ? -1 : 1));
      if (infos) {
        this.setState({
          packages: infos,
        });
      }
    } catch (e) {
      console.error(e);
    }

    // Get info from DB
    const graphQLClient = getGraphQLClient();
    if (graphQLClient) {
      try {
        const themeEntities: TThemeEntity[] = await graphQLClient.getAllEntities(
          'Theme',
          graphQLClient.ThemeFragment,
          'ThemeFragment',
        );
        if (themeEntities && Array.isArray(themeEntities)) {
          this.setState({ installedThemes: themeEntities });
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  private getThemeUpdates = async () => {
    for (const theme of this.state.packages) {
      this.themeUpdates[theme.name] = undefined;
      try {
        const update = await getRestApiClient().getThemeUpdate(theme.name);
        if (update) {
          this.themeUpdates[theme.name] = update;
        }
      } catch (error) {
        console.error(error);
      }
    }
    this.forceUpdate();
  };

  private handleSetActiveTheme = async (info: TPackageCromwellConfig) => {
    const client = getRestApiClient();
    this.setState({ isChangingTheme: true });

    let success;
    try {
      success = await client.changeTheme(info.name);
    } catch (error) {
      console.error(error);
    }

    try {
      const updatedConfig = await client.getCmsSettings();
      if (updatedConfig) this.setState({ cmsConfig: updatedConfig });

      this.state.packages?.sort((a) => (updatedConfig && a.name === updatedConfig.themeName ? -1 : 1));
    } catch (error) {
      console.error(error);
    }

    try {
      const themeConfig = await client.getThemeConfig(info.name);
      if (themeConfig) {
        store.setStateProp({
          prop: 'activeTheme',
          payload: themeConfig,
        });
        setStoreItem('defaultPages', themeConfig?.defaultPages);
      }
    } catch (error) {
      console.error(error);
    }

    if (success) {
      toast.success('Applied new theme');
    } else {
      toast.error('Failed to set new theme');
    }

    this.setState({ isChangingTheme: false });
  };

  private handleActivateTheme = (themeName: string) => async () => {
    this.setState({ isLoading: true });
    const client = getRestApiClient();
    let success = false;

    try {
      success = await client?.activateTheme(themeName);
      await this.getThemeList();
    } catch (e) {
      console.error(e);
    }
    this.setState({ isLoading: false });

    if (success) {
      toast.success('Theme installed');
    } else {
      toast.error('Failed to install theme');
    }
  };

  private handleShowUpdate = (entity?: TThemeEntity, info?: TPackageCromwellConfig, update?: TCCSVersion) => () => {
    if (entity && update) {
      this.setState({
        updateModalInfo: {
          entity,
          update,
          info,
        },
      });
    }
  };

  private startUpdate = async (theme: TPackageCromwellConfig) => {
    this.themeUnderUpdate[theme.name] = true;
    this.setState({ updateModalInfo: null });
    let success;
    try {
      success = await getRestApiClient().updateTheme(theme.name);
    } catch (error) {
      console.error(error);
    }

    if (success) this.themeUpdates[theme.name] = undefined;

    try {
      await this.getThemeList();
    } catch (error) {
      console.error(error);
    }

    if (success) toast.success('Theme updated');
    else toast.error('Failed to update theme');
    this.themeUnderUpdate[theme.name] = false;
    this.forceUpdate();
    loadPlugins({ onlyNew: true });
  };

  private handleDelete = async (theme: TPackageCromwellConfig) => {
    const positive = await askConfirmation({
      title: `Delete theme ${theme.title ?? theme.name}?`,
    });
    if (!positive) return;

    this.themeUnderUpdate[theme.name] = true;
    this.forceUpdate();

    let success;
    try {
      success = await getRestApiClient().deleteTheme(theme.name);
    } catch (error) {
      console.error(error);
    }

    if (success) this.themeUpdates[theme.name] = undefined;

    try {
      await this.getThemeList();
    } catch (error) {
      console.error(error);
    }

    if (success) toast.info('Theme deleted');
    else toast.error('Failed to delete theme');

    this.themeUnderUpdate[theme.name] = false;
    this.forceUpdate();
  };

  private handleOpenMarket = () => {
    this.props.history?.push(themeMarketPageInfo.route);
  };

  private openTheme = (info: TPackageCromwellConfig) => {
    this.setState({
      openedTheme: {
        ...info,
        image: info.image && `data:image/png;base64,${info.image}`,
        images: info.images && info.images.map((img) => `data:image/png;base64,${img}`),
      },
    });
  };

  render() {
    return null;
    // <div className={`${styles.themeCard} ${commonStyles.paper}`} key={info.name}>
    //     <CardActionArea
    //         className={styles.cardActionArea}
    //         style={{ opacity: isUnderUpdate ? 0.5 : 1 }}
    //     >
    //         <div
    //             style={{ backgroundImage: `url("data:image/png;base64,${info.image}")` }}
    //             className={styles.themeImage}
    //         ></div>
    //         <CardContent className={styles.mainInfo}>
    //             <Badge color="secondary" badgeContent={isActive ? 'Active' : null}>
    //                 <Typography gutterBottom variant="h5" component="h2" className={styles.themeTitle}>
    //                     {info.title}
    //                 </Typography>
    //             </Badge>
    //             <p className={styles.version}
    //                 onClick={this.handleShowUpdate(entity, info, availableUpdate)}
    //                 style={{ cursor: availableUpdate ? 'pointer' : 'initial' }}
    //             >{(info?.version ?? '') +
    //                 (availableUpdate ? ' > ' + availableUpdate.version + ' Open info' : '')}</p>
    //             <Typography variant="body2" color="textSecondary" component="p">
    //                 {info.excerpt}
    //             </Typography>
    //         </CardContent>
    //     </CardActionArea>
    //     <CardActions
    //         style={{ opacity: isUnderUpdate ? 0.5 : 1 }}
    //         className={styles.themeActions}
    //         disableSpacing
    //     >
    //         {!isInstalled && (
    //             <Button
    //                 disabled={isUnderUpdate || isChangingTheme}
    //                 size="small" color="primary" variant="contained"
    //                 onClick={this.handleActivateTheme(info.name)}
    //             >Install theme</Button>
    //         )}
    //         {isInstalled && isActive && (
    //             <Button
    //                 disabled={isUnderUpdate || isChangingTheme}
    //                 size="small" color="primary" variant="contained"
    //                 onClick={() => {
    //                     const route = `${themeEditPageInfo.baseRoute}`;
    //                     this.props.history.push(route);
    //                 }}
    //             >
    //                 Edit theme
    //             </Button>
    //         )}
    //         {availableUpdate && (
    //             <Button
    //                 disabled={isUnderUpdate || isChangingTheme}
    //                 size="small" color="primary" variant="contained"
    //                 onClick={() => this.startUpdate(info)}
    //             >Update</Button>
    //         )}
    //         {isInstalled && !isActive && (
    //             <Button size="small" color="primary" variant="contained"
    //                 onClick={() => this.handleSetActiveTheme(info)}
    //                 disabled={isUnderUpdate || isChangingTheme}
    //             >Set active</Button>
    //         )}
    //         <Button size="small" color="primary" variant="outlined"
    //             disabled={isUnderUpdate || isChangingTheme}
    //             onClick={() => this.handleDelete(info)}
    //         >Delete</Button>
    //         <Button size="small" color="primary" variant="outlined"
    //             onClick={() => this.openTheme(info)}
    //         >Info</Button>
    //         {isUnderUpdate && (
    //             <LinearProgress className={styles.updateProgress} />
    //         )}
    //     </CardActions>
    // </div>
    //           );
    //         })}
    //       </div>
    //     )}
    //   </div>
    //   <LoadingStatus isActive={isChangingTheme} />
    //   {/* <ManagerLogger isActive={isChangingTheme} /> */}
    //   <Modal
    //     open={!!this.state.updateModalInfo}
    //     onClose={() =>
    //       this.setState({ updateModalInfo: null })
    //     }
    //     className={commonStyles.center}
    //     blurSelector="#root">
    //     <UpdateModalContent
    //       underUpdate={this.themeUnderUpdate}
    //       {...(this.state?.updateModalInfo ?? {})}
    //       onStartUpdate={this.startUpdate}
    //       onClose={() =>
    //         this.setState({ updateModalInfo: null })
    //       }
    //     />
    //   </Modal>
    //   <Modal
    //     open={!!this.state.openedTheme}
    //     blurSelector="#root"
    //     className={commonStyles.center}
    //     onClose={() =>
    //       this.setState({ openedTheme: undefined })
    //     }>
    //     {this.state?.openedTheme && (
    //       <MarketModal
    //         installedModules={
    //           this.state?.installedThemes ?? []
    //         }
    //         data={this.state.openedTheme}
    //         noInstall
    //       />
    //     )}
    //   </Modal>
    // </div>
    // );
  }
}

const DeleteModal = ({ themeName }) => {
  return null;
  // <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
  //   <Dialog.Overlay />

  //   <Dialog.Title>Delete Theme</Dialog.Title>
  //   <Dialog.Description>
  //     This will permanently deactivate your account
  //   </Dialog.Description>

  //   <p>
  //     Are you sure you want to deactivate your account? All of your data will
  //     be permanently removed. This action cannot be undone.
  //   </p>

  //   <button onClick={() => setIsOpen(false)}>Deactivate</button>
  //   <button onClick={() => setIsOpen(false)}>Cancel</button>
  // </Dialog>
};

const UpdateModalContent = (props: {
  underUpdate: Record<string, boolean>;
  update?: TCCSVersion;
  entity?: TThemeEntity;
  info?: TPackageCromwellConfig;
  onStartUpdate: (entity: TPackageCromwellConfig) => void;
  onClose: () => void;
}) => {
  const { update, entity, info } = props;
  const isUnderUpdate = entity?.name && props.underUpdate[entity.name];

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

      <div
        className={styles.changelogList}
        dangerouslySetInnerHTML={{
          __html: update.changelog,
        }}
      ></div>
      <Button disabled={isUnderUpdate} color="primary" variant="contained" onClick={() => props.onStartUpdate(info)}>
        Update
      </Button>
    </Grid>
  );
};

export default ThemeListing;
