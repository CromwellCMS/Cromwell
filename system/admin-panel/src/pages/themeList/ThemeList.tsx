import { setStoreItem, TCCSVersion, TCmsSettings, TPackageCromwellConfig, TThemeEntity } from '@cromwell/core';
import { getGraphQLClient, getRestApiClient } from '@cromwell/core-frontend';
import { AddCircleOutline as AddCircleOutlineIcon, Close as CloseIcon, Update as UpdateIcon } from '@mui/icons-material';
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
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { LoadingStatus } from '../../components/loadBox/LoadingStatus';
import MarketModal from '../../components/market/MarketModal';
import { askConfirmation } from '../../components/modal/Confirmation';
import Modal from '../../components/modal/Modal';
import { toast } from '../../components/toast/toast';
import { themeEditPageInfo, themeMarketPageInfo } from '../../constants/PageInfos';
import { loadPlugins } from '../../helpers/loadPlugins';
import { store } from '../../redux/store';
import commonStyles from '../../styles/common.module.scss';
import styles from './ThemeList.module.scss';


class ThemeList extends React.Component<Partial<RouteComponentProps>, {
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
}> {

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
        }
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
    }

    private getThemeList = async () => {
        try {
            const client = getRestApiClient();
            const updatedConfig = await client?.getCmsSettings();
            this.setState({ cmsConfig: updatedConfig })

            // Get info by parsing directory 
            const infos = await client?.getThemesInfo();
            infos?.sort((a) => (updatedConfig && a.name === updatedConfig.themeName) ? -1 : 1)
            if (infos) {
                this.setState({
                    packages: infos,
                })
            }
        } catch (e) {
            console.error(e);
        }

        // Get info from DB
        const graphQLClient = getGraphQLClient();
        if (graphQLClient) {
            try {
                const themeEntities: TThemeEntity[] = await graphQLClient.getAllEntities('Theme',
                    graphQLClient.ThemeFragment, 'ThemeFragment');
                if (themeEntities && Array.isArray(themeEntities)) {
                    this.setState({ installedThemes: themeEntities });
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

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
    }

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
            if (updatedConfig)
                this.setState({ cmsConfig: updatedConfig });

            this.state.packages?.sort((a) => (updatedConfig && a.name === updatedConfig.themeName) ? -1 : 1)
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
    }

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
    }

    private handleShowUpdate = (entity?: TThemeEntity, info?: TPackageCromwellConfig, update?: TCCSVersion,) => () => {
        if (entity && update) {
            this.setState({
                updateModalInfo: {
                    entity,
                    update,
                    info,
                }
            });
        }
    }

    private startUpdate = async (theme: TPackageCromwellConfig) => {
        this.themeUnderUpdate[theme.name] = true;
        this.setState({ updateModalInfo: null });
        let success;
        try {
            success = await getRestApiClient().updateTheme(theme.name);
        } catch (error) {
            console.error(error)
        }

        if (success) this.themeUpdates[theme.name] = undefined;

        try {
            await this.getThemeList();
        } catch (error) {
            console.error(error)
        }

        if (success) toast.success('Theme updated');
        else toast.error('Failed to update theme');
        this.themeUnderUpdate[theme.name] = false;
        this.forceUpdate();
        loadPlugins({ onlyNew: true });
    }

    private handleDelete = async (theme: TPackageCromwellConfig) => {
        const positive = await askConfirmation({
            title: `Delete theme ${theme.title ?? theme.name}?`
        });
        if (!positive) return;

        this.themeUnderUpdate[theme.name] = true;
        this.forceUpdate();

        let success;
        try {
            success = await getRestApiClient().deleteTheme(theme.name);
        } catch (error) {
            console.error(error)
        }

        if (success) this.themeUpdates[theme.name] = undefined;

        try {
            await this.getThemeList();
        } catch (error) {
            console.error(error)
        }

        if (success) toast.info('Theme deleted');
        else toast.error('Failed to delete theme');

        this.themeUnderUpdate[theme.name] = false;
        this.forceUpdate();
    }

    private handleOpenMarket = () => {
        this.props.history?.push(themeMarketPageInfo.route);
    }

    private openTheme = (info: TPackageCromwellConfig) => {
        this.setState({
            openedTheme: {
                ...info,
                image: info.image && `data:image/png;base64,${info.image}`,
                images: info.images && info.images.map(img => `data:image/png;base64,${img}`)
            }
        })
    }

    render() {
        const { isLoading, packages, installedThemes, cmsConfig, isChangingTheme } = this.state;
        return (
            <div className={styles.ThemeList} ref={this.pageRef}>
                <Button
                    className={styles.addBtn}
                    onClick={this.handleOpenMarket}
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleOutlineIcon />}
                >Add themes</Button>
                {isLoading && (
                    <div className={styles.list}>
                        {Array(2).fill(1).map((it, index) => (
                            <Skeleton key={index} variant="rectangular" height="388px" width="300px" style={{ margin: '0 10px 20px 10px' }} > </Skeleton>
                        ))}
                    </div>
                )}
                {!isLoading &&
                    <div className={styles.list}>
                        {packages.map(info => {
                            const isActive = Boolean(cmsConfig && cmsConfig.themeName === info.name);
                            const entity = installedThemes?.find(ent => ent.name === info.name);
                            const isInstalled = entity?.isInstalled ?? false;
                            const availableUpdate = this.themeUpdates[info.name];
                            const isUnderUpdate = this.themeUnderUpdate[info.name];

                            return (
                                <div className={`${styles.themeCard} ${commonStyles.paper}`} key={info.name}>
                                    <CardActionArea
                                        className={styles.cardActionArea}
                                        style={{ opacity: isUnderUpdate ? 0.5 : 1 }}
                                    >
                                        <div
                                            style={{ backgroundImage: `url("data:image/png;base64,${info.image}")` }}
                                            className={styles.themeImage}
                                        ></div>
                                        <CardContent className={styles.mainInfo}>
                                            <Badge color="secondary" badgeContent={isActive ? 'Active' : null}>
                                                <Typography gutterBottom variant="h5" component="h2" className={styles.themeTitle}>
                                                    {info.title}
                                                </Typography>
                                            </Badge>
                                            <p className={styles.version}
                                                onClick={this.handleShowUpdate(entity, info, availableUpdate)}
                                                style={{ cursor: availableUpdate ? 'pointer' : 'initial' }}
                                            >{(info?.version ?? '') +
                                                (availableUpdate ? ' > ' + availableUpdate.version + ' Open info' : '')}</p>
                                            <Typography variant="body2" color="textSecondary" component="p">
                                                {info.excerpt}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions
                                        style={{ opacity: isUnderUpdate ? 0.5 : 1 }}
                                        className={styles.themeActions}
                                        disableSpacing
                                    >
                                        {!isInstalled && (
                                            <Button
                                                disabled={isUnderUpdate || isChangingTheme}
                                                size="small" color="primary" variant="contained"
                                                onClick={this.handleActivateTheme(info.name)}
                                            >Install theme</Button>
                                        )}
                                        {isInstalled && isActive && (
                                            <Button
                                                disabled={isUnderUpdate || isChangingTheme}
                                                size="small" color="primary" variant="contained"
                                                onClick={() => {
                                                    const route = `${themeEditPageInfo.baseRoute}`;
                                                    this.props.history.push(route);
                                                }}
                                            >
                                                Edit theme
                                            </Button>
                                        )}
                                        {availableUpdate && (
                                            <Button
                                                disabled={isUnderUpdate || isChangingTheme}
                                                size="small" color="primary" variant="contained"
                                                onClick={() => this.startUpdate(info)}
                                            >Update</Button>
                                        )}
                                        {isInstalled && !isActive && (
                                            <Button size="small" color="primary" variant="contained"
                                                onClick={() => this.handleSetActiveTheme(info)}
                                                disabled={isUnderUpdate || isChangingTheme}
                                            >Set active</Button>
                                        )}
                                        <Button size="small" color="primary" variant="outlined"
                                            disabled={isUnderUpdate || isChangingTheme}
                                            onClick={() => this.handleDelete(info)}
                                        >Delete</Button>
                                        <Button size="small" color="primary" variant="outlined"
                                            onClick={() => this.openTheme(info)}
                                        >Info</Button>
                                        {isUnderUpdate && (
                                            <LinearProgress className={styles.updateProgress} />
                                        )}
                                    </CardActions>
                                </div>
                            )
                        })}
                    </div>}
                <LoadingStatus isActive={isChangingTheme} />
                {/* <ManagerLogger isActive={isChangingTheme} /> */}
                <Modal
                    open={!!this.state.updateModalInfo}
                    onClose={() => this.setState({ updateModalInfo: null })}
                    className={commonStyles.center}
                    blurSelector="#root"
                >
                    <UpdateModalContent
                        underUpdate={this.themeUnderUpdate}
                        {...(this.state?.updateModalInfo ?? {})}
                        onStartUpdate={this.startUpdate}
                        onClose={() => this.setState({ updateModalInfo: null })}
                    />
                </Modal>
                <Modal
                    open={!!this.state.openedTheme}
                    blurSelector="#root"
                    className={commonStyles.center}
                    onClose={() => this.setState({ openedTheme: undefined })}
                >
                    {this.state?.openedTheme && (
                        <MarketModal
                            installedModules={this.state?.installedThemes ?? []}
                            data={this.state.openedTheme}
                            noInstall
                        />
                    )}
                </Modal>
            </div>
        )

    }
}


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
                onClick={() => props.onStartUpdate(info)}
            >Update</Button>
        </Grid>
    )
}


export default ThemeList;