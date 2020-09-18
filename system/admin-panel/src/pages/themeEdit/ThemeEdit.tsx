import '../../helpers/Draggable/Draggable.css';

import { setStoreItem, getStoreItem, TCromwellBlockData, TPageConfig, TPageInfo } from '@cromwell/core';
import {
    CromwellBlockCSSclass, getRestAPIClient, cromwellBlockTypeFromClassname,
    getBlockDataById, cromwellIdFromHTML
} from '@cromwell/core-frontend';
import { Button, IconButton, MenuItem, Tab, Tabs, Tooltip, Drawer, Collapse } from '@material-ui/core';
import { AddCircle as AddCircleIcon, HighlightOff as HighlightOffIcon, Settings as SettingsIcon } from '@material-ui/icons';
//@ts-ignore
import { ImportedThemeController, importLazyPage } from 'CromwellImports';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';


import LoadBox from '../../components/loadBox/LoadBox';
import { PageListItem } from '../../components/themeEdit/pageListItem/PageListItem';
import { PageSettings } from '../../components/themeEdit/pageSettings/PageSettings';
import { PageBuilder } from '../../components/themeEdit/pageBuilder/PageBuilder';
import PageErrorBoundary from '../../components/errorBoundaries/PageErrorBoundary';
import styles from './ThemeEdit.module.scss';


class ThemeEditState {
    pageInfos: TPageInfo[] | null = null;
    editingPageInfo: TPageInfo | null = null;
    EditingPage: React.LazyExoticComponent<React.ComponentType<any>> | null | undefined = null;
    isPageLoading: boolean = false;
    isPageListLoading: boolean = true;
    isSidebarOpen: boolean = true;
    activeTabNum: number = 0;
}


export default class ThemeEdit extends React.Component<{}, ThemeEditState> {

    private changedPageInfo: TPageInfo | null = null;

    // Keeps track of modifications that user made (added) curently. Does not store all mods from actual pageCofig!
    // We need to send to the server only newly added modifications! 
    private changedModifications: TCromwellBlockData[] | null | undefined = null;

    constructor(props: {}) {
        super(props);
        this.state = new ThemeEditState();
    }

    componentDidMount() {
        (window as any).ThemeEditPage = this;

        (async () => {
            const infos = await getRestAPIClient()?.getPagesInfo();
            if (infos) this.setState({ pageInfos: infos });
            this.setState({ isPageListLoading: false });
        })();
    }

    private handleOpenPageBuilder = async (pageInfo: TPageInfo) => {
        this.setState({ isPageLoading: true });
        const pageCofig: TPageConfig | undefined =
            await getRestAPIClient()?.getPageConfig(pageInfo.route);
        const appConfig = await getRestAPIClient()?.getAppConfig();
        const appCustomConfig = await getRestAPIClient()?.getAppCustomConfig();
        // console.log('pageModifications', pageModifications);
        setStoreItem('pageConfig', pageCofig);
        setStoreItem('appConfig', appConfig);
        setStoreItem('appCustomConfig', appCustomConfig);

        this.changedPageInfo = null;

        // const pageComp = importStaticPage(pageCofig.route);
        const pageComp = importLazyPage(pageInfo.route);

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
    private handlePageModificationsChange = (modifications: TCromwellBlockData[]) => {
        this.changedModifications = modifications;
    }

    private handleSaveEditingPage = () => {
        if (!this.changedPageInfo && !this.changedModifications) {
            // nothing to save
            return;
        }

        const pageInfo = this.changedPageInfo ?? this.state.editingPageInfo;
        const modifications = this.changedModifications ?? [];

        if (pageInfo) {
            const pageConfig: TPageConfig = {
                ...pageInfo,
                modifications
            }
        }

    }

    private handleDeletePage = (page: TPageInfo) => {

    }

    private handleAddCustomPage = () => {
        this.setState(prev => {
            const newPage: TPageInfo = {
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

        return (
            <div className={styles.ThemeEdit}>
                <div>
                    {isPageListLoading && (
                        <LoadBox />
                    )}
                    {!isPageListLoading && (
                        <div className={styles.mainContainer}>
                            <div className={styles.sidebar}>
                                {ImportedThemeController && (
                                    <div className={styles.pageList}>
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
                                    <div className={styles.pageList}>
                                        <p className={styles.pageListHeader}>Default pages</p>
                                        {defaultPages.filter(p => !p.isVirtual).map(p => (
                                            <PageListItem page={p} handleOpenPageBuilder={this.handleOpenPageBuilder}
                                                handleDeletePage={this.handleDeletePage}
                                            />
                                        ))}
                                    </div>
                                )}
                                {customPages && (
                                    <div className={styles.pageList}>
                                        <p className={styles.pageListHeader}>Custom pages</p>
                                        {customPages.filter(p => p.isVirtual).map(p => (
                                            <PageListItem page={p} handleOpenPageBuilder={this.handleOpenPageBuilder}
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
                                <IconButton
                                    aria-label="close"
                                    onClick={() => this.setState(prev => ({ isSidebarOpen: !prev.isSidebarOpen }))}
                                >
                                    <AddCircleIcon />
                                </IconButton>
                            </div>
                            <div className={styles.pageSettingsContainer}>
                                {/** If no page selected to edit settings, display Theme's AdminPanel controller */}
                                {!editingPageInfo && ImportedThemeController && (
                                    <div className={styles.adminPanelThemeController}>
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
                                                this.setState({ activeTabNum: newValue });
                                            }}
                                        >
                                            <Tab label="Page settings" />
                                            <Tab label="Page builder" />
                                        </Tabs>
                                        <div>
                                            <Button variant="outlined" color="primary"
                                                className={styles.saveBtn}
                                                size="small"
                                                onClick={() => this.handleSaveEditingPage()}>
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
                                <TabPanel value={activeTabNum} index={0}>
                                    {!isPageLoading && editingPageInfo && (
                                        <PageSettings initialPageConfig={editingPageInfo}
                                            handleSavePage={this.handleSaveEditingPage}
                                        />
                                    )}
                                </TabPanel>
                                <TabPanel value={activeTabNum} index={1}>
                                    {!isPageLoading && EditingPage && (
                                        <PageBuilder EditingPage={EditingPage} />
                                    )}
                                </TabPanel>
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

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <div className={styles.tabContent}>{children}</div>
            )}
        </div>
    );
}
