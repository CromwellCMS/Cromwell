import '../../helpers/Draggable/Draggable.css';

import {
    genericPageName,
    getRandStr,
    setStoreItem,
    TCromwellBlockData,
    TPageConfig,
    TPageInfo,
    TPluginEntity,
} from '@cromwell/core';
import { getGraphQLClient, getRestAPIClient, loadFrontendBundle } from '@cromwell/core-frontend';
import { Button, IconButton, MenuItem, Tab, Tabs, Tooltip } from '@material-ui/core';
import { AddCircle as AddCircleIcon, Settings as SettingsIcon } from '@material-ui/icons';
import clsx from 'clsx';
import React, { Suspense } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';

import PageErrorBoundary from '../../components/errorBoundaries/PageErrorBoundary';
import LoadBox from '../../components/loadBox/LoadBox';
import { LoadingStatus } from '../../components/loadBox/LoadingStatus';
import { SkeletonPreloader } from '../../components/SkeletonPreloader';
import { PageBuilder } from './pageBuilder/PageBuilder';
import { PageListItem } from './pageListItem/PageListItem';
import { PageSettings } from './pageSettings/PageSettings';
import styles from './ThemeEdit.module.scss';


class ThemeEditState {
    pageInfos: TPageInfo[] | null = null;
    plugins: TPluginEntity[] | null = null;
    editingPageInfo: TPageInfo | null = null;
    EditingPage: React.ComponentType<any> | null | undefined = null;
    isPageLoading: boolean = false;
    isPageListLoading: boolean = true;
    loadingStatus: boolean = false;
    isSidebarOpen: boolean = true;
    activeTabNum: number = 0;
}


export default class ThemeEdit extends React.Component<Partial<RouteComponentProps>, ThemeEditState> {

    private changedPageInfo: TPageInfo | null = null;

    // Keeps track of modifications that user made (added) curently. Does not store all mods from actual pageCofig!
    // We need to send to the server only newly added modifications! 
    private changedModifications: TCromwellBlockData[] | null | undefined = null;

    private tabsContent = React.createRef<HTMLDivElement>();

    constructor(props: any) {
        super(props);
        this.state = new ThemeEditState();
    }

    componentDidMount() {
        (async () => {
            const infos = await getRestAPIClient()?.getPagesInfo();

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
            this.setState({ isPageListLoading: false });
        })();
    }

    private handleOpenPage = async (pageInfo: TPageInfo) => {
        this.setState({ isPageLoading: true });


        const pageCofig: TPageConfig | undefined =
            await getRestAPIClient()?.getPageConfig(pageInfo.route);
        // const themeInfo = await getRestAPIClient()?.getThemeInfo();
        const themeConfig = await getRestAPIClient()?.getThemeConfig();
        const themeCustomConfig = await getRestAPIClient()?.getThemeCustomConfig();
        setStoreItem('pageConfig', pageCofig);
        setStoreItem('themeCustomConfig', themeCustomConfig);
        setStoreItem('palette', themeConfig?.palette);

        this.changedPageInfo = null;
        this.changedModifications = null;
        const pageCompPath = pageInfo?.isVirtual ? genericPageName : pageInfo.route;
        let pageComp = await loadFrontendBundle(pageCompPath,
            () => getRestAPIClient()?.getThemePageBundle(pageCompPath),
            (func: (() => Promise<React.ComponentType>)) => {
                return func();
            }
        );

        this.setState({
            EditingPage: pageComp,
            editingPageInfo: pageInfo,
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

    private handleSaveEditingPage = async () => {
        if (!this.changedPageInfo &&
            (!this.changedModifications || this.changedModifications.length === 0)) {
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

            const client = getRestAPIClient();
            this.setState({ loadingStatus: true });
            const success = await client?.savePageConfig(pageConfig);

            if (success) {
                toast.success('Saved');
            } else {
                toast.error('Failed to save changes');
            }

            const infos = await getRestAPIClient()?.getPagesInfo();
            if (infos) this.setState({ pageInfos: infos });

            this.setState({ loadingStatus: false });

        }

    }

    private handleDeletePage = (page: TPageInfo) => {

    }

    private handleAddCustomPage = () => {
        this.setState(prev => {
            const newPage: TPageInfo = {
                id: `generic_${getRandStr(8)}`,
                route: '',
                name: '',
                isVirtual: true
            };
            const prevPage = prev.pageInfos;
            return {
                pageInfos: prevPage ? [...prevPage, newPage] : [newPage]
            }
        });
    }

    public handleTabChange = (nextTabNum: number) => {
        const activeTabNum = this.state.activeTabNum;
        if (activeTabNum === nextTabNum) return;

        const isPageBuilder = nextTabNum === 1;
        const isGeneral = nextTabNum === 0;

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
                                        <p className={styles.pageListHeader}>Default pages</p>
                                        {defaultPages.filter(p => !p.isVirtual).map(p => (
                                            <PageListItem
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
                                            onChange={(event: React.ChangeEvent<{}>, newValue: number) => {
                                                this.handleTabChange(newValue);
                                            }}
                                        >
                                            <Tab label="General settings" />
                                            <Tab label="Page builder" />
                                        </Tabs>
                                        <div>
                                            <Button variant="contained" color="primary"
                                                className={styles.saveBtn}
                                                size="small"
                                                onClick={this.handleSaveEditingPage}>
                                                Save
                                        </Button>
                                            {/* <IconButton
                                                aria-label="close"
                                                onClick={this.handleCloseEditingPage}
                                            >
                                                <HighlightOffIcon />
                                            </IconButton> */}
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
    const { children, value, index, ...other } = props;

    if (value === index) return <>{children}</>;
    return <></>;
}

