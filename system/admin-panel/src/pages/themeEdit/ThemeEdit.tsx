import {
    genericPageName,
    getRandStr,
    getStoreItem,
    setStoreItem,
    TCromwellBlockData,
    TPageConfig,
    TPageInfo,
    TPluginEntity,
    TThemeConfig,
} from '@cromwell/core';
import { getGraphQLClient, getRestApiClient, loadFrontendBundle } from '@cromwell/core-frontend';
import { Button, IconButton, MenuItem, Popover, Tab, Tabs, Tooltip } from '@material-ui/core';
import {
    AddCircle as AddCircleIcon,
    MoreVertOutlined as MoreVertOutlinedIcon,
    Settings as SettingsIcon,
    SettingsBackupRestore as SettingsBackupRestoreIcon,
    DeleteForever as DeleteForeverIcon,
} from '@material-ui/icons';
import clsx from 'clsx';
import React, { Suspense } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import PageErrorBoundary from '../../components/errorBoundaries/PageErrorBoundary';
import LoadBox from '../../components/loadBox/LoadBox';
import { LoadingStatus } from '../../components/loadBox/LoadingStatus';
import { SkeletonPreloader } from '../../components/SkeletonPreloader';
import { toast } from '../../components/toast/toast';
import { store } from '../../redux/store';
import { PageBuilder } from './pageBuilder/PageBuilder';
import { PageListItem } from './pageListItem/PageListItem';
import { PageSettings } from './pageSettings/PageSettings';
import styles from './ThemeEdit.module.scss';


class ThemeEditState {
    themeConfig: TThemeConfig | null = null;
    pageInfos: TPageInfo[] | null = null;
    plugins: TPluginEntity[] | null = null;
    editingPageInfo: TPageConfig | null = null;
    EditingPage: React.ComponentType<any> | null | undefined = null;
    isPageLoading: boolean = false;
    isPageListLoading: boolean = true;
    loadingStatus: boolean = false;
    isSidebarOpen: boolean = true;
    pageOptionsOpen: boolean = false;
    activeTabNum: number = 0;
}


export default class ThemeEdit extends React.Component<Partial<RouteComponentProps>, ThemeEditState> {

    private changedPageInfo: TPageInfo | null = null;

    // Keeps track of modifications that user made (added) curently. Does not store all mods from actual pageCofig!
    // We need to send to the server only newly added modifications! 
    private changedModifications: TCromwellBlockData[] | null | undefined = null;

    private tabsContent = React.createRef<HTMLDivElement>();
    private optionsAnchorEl = React.createRef<HTMLDivElement>();
    private unregisterBlock;
    private unsavedPrompt = 'Your unsaved changes will be lost. Do you want to discard and leave this page?';

    constructor(props: any) {
        super(props);
        this.state = new ThemeEditState();
    }

    componentDidMount() {
        this.loadInitialInfo();

        this.unregisterBlock = this.props.history?.block(() => {
            if (this.hasUnsavedModifications()) return this.unsavedPrompt;
        });
    }

    componentWillUnmount() {
        this.unregisterBlock?.();
    }

    private loadInitialInfo = async () => {
        const infos = await getRestApiClient()?.getPagesInfo();

        // Get info from DB
        const graphQLClient = getGraphQLClient();
        if (graphQLClient) {
            try {
                const pluginEntities: TPluginEntity[] = await graphQLClient.getAllEntities('Plugin',
                    graphQLClient.PluginFragment, 'PluginFragment');
                if (pluginEntities && Array.isArray(pluginEntities)) {
                    this.setState({ plugins: pluginEntities });
                }
            } catch (e) { console.error(e); }
        }
        if (infos) this.setState({ pageInfos: infos });

        try {
            // const themeInfo = await getRestApiClient()?.getThemeInfo();
            const themeConfig = await getRestApiClient()?.getThemeConfig();

            const theme = getStoreItem('theme') ?? {};
            if (themeConfig?.palette) theme.palette = themeConfig.palette;
            setStoreItem('theme', theme);

            this.setState({ themeConfig });

            const themeCustomConfig = await getRestApiClient()?.getThemeCustomConfig();
            setStoreItem('themeCustomConfig', themeCustomConfig);
        } catch (e) {
            console.error(e)
        }

        this.setState({ isPageListLoading: false });
    }

    private handleOpenPage = async (pageInfo: TPageInfo) => {
        if (this.hasUnsavedModifications() && !window.confirm(this.unsavedPrompt)) return;

        this.setState({ isPageLoading: true });
        setStoreItem('pageConfig', undefined);
        let pageConfig: TPageConfig | undefined;
        try {
            if (pageInfo.route && pageInfo.route !== '') {
                pageConfig = await getRestApiClient()?.getPageConfig(pageInfo.route);
                setStoreItem('pageConfig', pageConfig);
            }
        } catch (e) {
            console.error(e);
        }

        try {
            this.changedPageInfo = null;
            this.changedModifications = null;
            const pageCompPath = pageInfo?.isVirtual ?
                (this.state.themeConfig?.defaultPages?.pages ?? genericPageName) : pageInfo.route;
            const pageComp = await loadFrontendBundle(
                pageCompPath,
                () => getRestApiClient()?.getThemePageBundle(pageCompPath),
            );

            this.setState({
                EditingPage: pageComp,
                editingPageInfo: pageConfig,
            });
        } catch (e) {
            console.error(e)
        }

        this.setState({
            isPageLoading: false
        });
    }

    private handleCloseEditingPage = () => {
        this.setState({
            editingPageInfo: null,
            EditingPage: null
        })
    }

    private handlePageInfoChange = (page: TPageInfo) => {
        this.changedPageInfo = page;
    }
    private handlePageModificationsChange = (modifications: TCromwellBlockData[] | null | undefined) => {
        this.changedModifications = modifications;
    }

    private hasUnsavedModifications = () => !!(this.changedPageInfo || this.changedModifications?.length > 0);

    private handleSaveEditingPage = async () => {
        if (!this.hasUnsavedModifications()) {
            toast.warning('No changes to save');
            return;
        }

        const pageInfo = this.changedPageInfo ?? this.state.editingPageInfo;
        const modifications = this.changedModifications ?? [];

        if (pageInfo) {
            const pageConfig: TPageConfig = {
                ...pageInfo,
                modifications,
            };

            const client = getRestApiClient();
            this.setState({ loadingStatus: true });

            let success;
            try {
                success = await client?.savePageConfig(pageConfig);
            } catch (error) {
                console.error(error);
            }

            try {
                const infos = await getRestApiClient()?.getPagesInfo();
                if (infos) this.setState({ pageInfos: infos });
            } catch (error) {
                console.error(error);
            }

            if (success) {
                toast.success('Saved');

                this.changedPageInfo = null;
                this.changedModifications = null;
                await this.handleOpenPage(pageInfo);
            } else {
                toast.error('Failed to save changes');
            }

            this.setState({ loadingStatus: false });
        }
    }

    private handleDeletePage = () => {

    }

    private handleDeleteCurrentPage = async () => {
        if (this.state.editingPageInfo?.route) {
            let success;
            try {
                success = await getRestApiClient()?.deletePage(this.state.editingPageInfo.route);
            } catch (error) {
                console.error(error);
            }

            if (success) {
                toast.success('Page deleted');
            } else {
                toast.error('Failed to delete page');
            }
        }

        this.setState({
            editingPageInfo: undefined,
            EditingPage: undefined,
            activeTabNum: 0,
            isSidebarOpen: true,
            pageOptionsOpen: false,
        })
        await this.loadInitialInfo();
    }

    private handleResetCurrentPage = async () => {
        if (this.state.editingPageInfo?.route) {
            let success;
            try {
                success = await getRestApiClient()?.resetPage(this.state.editingPageInfo.route);
            } catch (error) {
                console.error(error);
            }

            if (success) {
                toast.success('Page has been reset');
            } else {
                toast.error('Failed to reset page');
            }
        }

        this.setState({
            editingPageInfo: undefined,
            EditingPage: undefined,
            activeTabNum: 0,
            isSidebarOpen: true,
            pageOptionsOpen: false,
        });

        await this.loadInitialInfo();
    }

    private handleOptionsToggle = () => {
        this.setState(prev => ({
            pageOptionsOpen: !prev.pageOptionsOpen,
        }))
    }

    private handleAddCustomPage = () => {
        this.setState(prev => {
            const newPage: TPageInfo = {
                id: `generic_${getRandStr(8)}`,
                route: '',
                name: '',
                isVirtual: true
            };
            const prevPages = prev.pageInfos;
            return {
                pageInfos: prevPages ? [...prevPages, newPage] : [newPage]
            }
        });
    }

    public handleTabChange = (nextTabNum: number) => {
        const activeTabNum = this.state.activeTabNum;
        if (activeTabNum === nextTabNum) return;

        const isPageBuilder = nextTabNum === 1;
        const isGeneral = nextTabNum === 0;

        if (isGeneral) {
            store.setStateProp({
                prop: 'selectedBlock',
                payload: undefined,
            });
        }

        if (isPageBuilder && this.tabsContent.current) {
            this.tabsContent.current.style.opacity = '0';
            this.tabsContent.current.style.transitionDuration = '0s'
            setTimeout(() => {
                this.tabsContent.current.style.transitionDuration = '0.3s';
                setTimeout(() => {
                    this.tabsContent.current.style.opacity = '1';
                }, 100);
            }, 400);
        }

        setTimeout(() => {
            this.setState({
                activeTabNum: nextTabNum,
                isSidebarOpen: isGeneral
            });
        }, 50);
    }

    render() {

        const { pageInfos,
            editingPageInfo,
            EditingPage,
            isPageLoading,
            isPageListLoading,
            isSidebarOpen,
            activeTabNum, } = this.state;

        const defaultPages = pageInfos?.filter(p => !p.isVirtual);
        const customPages = pageInfos?.filter(p => p.isVirtual);

        const ImportedThemeController: null = null;

        return (
            <div className={styles.ThemeEdit}>
                <div>
                    {isPageListLoading && (
                        <SkeletonPreloader style={{
                            maxWidth: '300px',
                            maxHeight: '400px'
                        }} />
                    )}
                    {!isPageListLoading && (
                        <div className={styles.mainContainer}>
                            <div className={`${styles.sidebar} ${isSidebarOpen ? '' : styles.sidebarClosed}`}>
                                {ImportedThemeController && (
                                    <div className={styles.pageList} key="_1_">
                                        <MenuItem className={styles.navBarItem}
                                            onClick={this.handleCloseEditingPage}
                                        >
                                            <p>Theme settings</p>
                                            <IconButton>
                                                <SettingsIcon />
                                            </IconButton>
                                        </MenuItem>
                                    </div>
                                )}
                                {defaultPages && defaultPages.length > 0 && (
                                    <div className={styles.pageList} key="_2_">
                                        <p className={styles.pageListHeader}>Theme pages</p>
                                        {defaultPages.filter(p => !p.isVirtual).map(p => (
                                            <PageListItem
                                                activePage={this.state.editingPageInfo}
                                                key={p.route}
                                                page={p}
                                                handleOpenPage={this.handleOpenPage}
                                                handleDeletePage={this.handleDeletePage}
                                            />
                                        ))}
                                    </div>
                                )}
                                {customPages && (
                                    <div className={styles.pageList} key="_3_">
                                        <p className={styles.pageListHeader}>Custom pages</p>
                                        {customPages.filter(p => p.isVirtual).map(p => (
                                            <PageListItem
                                                activePage={this.state.editingPageInfo}
                                                key={p.route}
                                                page={p}
                                                handleOpenPage={this.handleOpenPage}
                                                handleDeletePage={this.handleDeletePage}
                                            />

                                        ))}
                                        <Tooltip title="Add a new page">
                                            <MenuItem
                                                className={clsx(styles.addPageItem, styles.navBarItem)}
                                            >
                                                <IconButton
                                                    aria-label="add page"
                                                    onClick={this.handleAddCustomPage}
                                                >
                                                    <AddCircleIcon />
                                                </IconButton>
                                            </MenuItem>
                                        </Tooltip>
                                    </div>
                                )}
                            </div>
                            <div className={styles.pageSettingsContainer}>
                                {/** If no page selected to edit settings, display Theme's AdminPanel controller */}
                                {!editingPageInfo && ImportedThemeController && (
                                    <div className={styles.adminPanelThemeController} >
                                        <PageErrorBoundary>
                                            <Suspense fallback={<LoadBox />}>
                                                <ImportedThemeController />
                                            </Suspense>
                                        </PageErrorBoundary>
                                    </div>
                                )}
                                {/* Header */}
                                {(editingPageInfo || EditingPage) && (
                                    <div className={styles.pageBarActions}>
                                        <Tabs
                                            value={activeTabNum}
                                            indicatorColor="primary"
                                            textColor="primary"
                                            onChange={(event: React.ChangeEvent<any>, newValue: number) => {
                                                this.handleTabChange(newValue);
                                            }}
                                        >
                                            <Tab label="Settings" />
                                            <Tab label="Page builder" />
                                        </Tabs>
                                        <div className={styles.bottomBlock} ref={this.optionsAnchorEl}>
                                            <Tooltip title="Options">
                                                <IconButton
                                                    onClick={this.handleOptionsToggle}
                                                    className={styles.actionBtn}
                                                    aria-label="Options"
                                                >
                                                    <MoreVertOutlinedIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Popover open={this.state.pageOptionsOpen}
                                                anchorEl={this.optionsAnchorEl.current}
                                                style={{ zIndex: 9999 }}
                                                onClose={this.handleOptionsToggle}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'left',
                                                }}
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'left',
                                                }}
                                            >
                                                <div>
                                                    <MenuItem
                                                        onClick={this.handleResetCurrentPage} className={styles.optionsItem}>
                                                        <SettingsBackupRestoreIcon />
                                                        <p>Reset to default</p>
                                                    </MenuItem>
                                                    <MenuItem
                                                        disabled={!this.state.editingPageInfo?.isVirtual}
                                                        onClick={this.handleDeleteCurrentPage} className={styles.optionsItem}>
                                                        <DeleteForeverIcon />
                                                        <p>Delete page</p>
                                                    </MenuItem>
                                                </div>
                                            </Popover>
                                            <Button variant="contained" color="primary"
                                                className={styles.saveBtn}
                                                size="small"
                                                onClick={this.handleSaveEditingPage}
                                            >Save</Button>
                                        </div>
                                    </div>
                                )}
                                <div className={styles.tabs}>
                                    <div className={styles.tabsContent} ref={this.tabsContent}>
                                        <TabPanel value={activeTabNum} index={0}>
                                            {!isPageLoading && editingPageInfo && (
                                                <PageSettings initialPageConfig={editingPageInfo}
                                                    handlePageInfoChange={this.handlePageInfoChange}
                                                />
                                            )}
                                        </TabPanel>
                                        <TabPanel value={activeTabNum} index={1}>
                                            {/* <FramePortal
                                        className={styles.builderFrame}
                                        id="builderFrame"
                                    >
                                        {!isPageLoading && EditingPage && (
                                            <PageBuilder
                                                plugins={this.state.plugins}
                                                editingPageInfo={editingPageInfo}
                                                onPageModificationsChange={this.handlePageModificationsChange}
                                                EditingPage={EditingPage}
                                            />
                                        )}
                                    </FramePortal> */}
                                            {!isPageLoading && EditingPage && (
                                                <PageBuilder
                                                    plugins={this.state.plugins}
                                                    editingPageInfo={editingPageInfo}
                                                    onPageModificationsChange={this.handlePageModificationsChange}
                                                    EditingPage={EditingPage}
                                                />
                                            )}
                                        </TabPanel>
                                    </div>
                                </div>
                                {isPageLoading && (<LoadBox />)}
                            </div>
                        </div>
                    )}
                </div>
                {/* {editingPage && (
                <div>
                    <iframe
                        src={`${frontendUrl}/${editingPage.route}`}
                        ref={editingFrameRef}
                    />
                </div>
            )} */}
                <LoadingStatus isActive={this.state.loadingStatus} />
            </div>
        )
    }
}


interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index } = props;

    if (value === index) return <>{children}</>;
    return <></>;
}

