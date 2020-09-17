import '../../helpers/Draggable/Draggable.css';

import { setStoreItem, TCromwellBlockData, TPageConfig, TPageInfo } from '@cromwell/core';
import { CromwellBlockCSSclass, getRestAPIClient } from '@cromwell/core-frontend';
import { Button, IconButton, MenuItem, Tab, Tabs, Tooltip } from '@material-ui/core';
import { AddCircle as AddCircleIcon, HighlightOff as HighlightOffIcon } from '@material-ui/icons';
//@ts-ignore
import { ImportedThemeController, importLazyPage } from 'CromwellImports';
import React, { Suspense, useEffect, useRef, useState } from 'react';

import PageErrorBoundary from '../../components/errorBoundaries/PageErrorBoundary';
import LoadBox from '../../components/loadBox/LoadBox';
import { PageListItem } from '../../components/themeEdit/pageListItem/PageListItem';
import { PageSettings } from '../../components/themeEdit/pageSettings/PageSettings';
import { Draggable } from '../../helpers/Draggable/Draggable';
import styles from './ThemeEdit.module.scss';


let draggable: Draggable;

export default function ThemeEdit() {
    const [pageInfos, setPageInfos] = useState<TPageInfo[] | null>(null);
    const editorWindowRef = useRef<HTMLDivElement>(null);
    const [editingPageInfo, setEditingPageInfo] = useState<TPageInfo | null>(null);
    const [EditingPage, setEditingPage] = useState<React.LazyExoticComponent<
        React.ComponentType<any>> | null | undefined>(null);
    const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
    const [isPageListLoading, setIsPageListLoading] = useState<boolean>(true);
    const [activeTabNum, setActiveTabNum] = React.useState(0);
    // const { themeName } = useParams();

    const changedPageInfo = useRef<TPageInfo | null>(null);

    // Keeps track of modifications that user made (added) curently. Does not store all mods from actual pageCofig!
    // We need to send to the server only newly added modifications! 
    const changedModifications = useRef<TCromwellBlockData[] | null | undefined>(null);


    useEffect(() => {
        (async () => {
            const infos = await getRestAPIClient()?.getPagesInfo();
            if (infos) setPageInfos(infos);
            setIsPageListLoading(false);
        })();
    }, []);

    const handleOpenPageBuilder = async (pageInfo: TPageInfo) => {
        setIsPageLoading(true);
        const pageCofig: TPageConfig | undefined =
            await getRestAPIClient()?.getPageConfig(pageInfo.route);
        const appConfig = await getRestAPIClient()?.getAppConfig();
        const appCustomConfig = await getRestAPIClient()?.getAppCustomConfig();
        // console.log('pageModifications', pageModifications);
        setStoreItem('pageConfig', pageCofig);
        setStoreItem('appConfig', appConfig);
        setStoreItem('appCustomConfig', appCustomConfig);

        changedPageInfo.current = null;

        setEditingPageInfo(pageInfo);
        // const pageComp = importStaticPage(pageCofig.route);
        const pageComp = importLazyPage(pageInfo.route);

        setEditingPage(pageComp);
        setIsPageLoading(false);

        draggable = new Draggable(`.${CromwellBlockCSSclass}`,
            editorWindowRef.current ? editorWindowRef.current : undefined);

    }

    const handleCloseEditingPage = () => {
        setEditingPageInfo(null);
        setEditingPage(null);
    }

    const handlePageInfoChange = (page: TPageInfo) => {
        changedPageInfo.current = page;
    }
    const handlePageModificationsChange = (modifications: TCromwellBlockData[]) => {
        changedModifications.current = modifications;
    }

    const handleSaveEditingPage = () => {
        if (!changedPageInfo.current && !changedModifications.current) {
            // nothing to save
            return;
        }

        const pageInfo = changedPageInfo.current ?? editingPageInfo;
        const modifications = changedModifications.current ?? [];

        if (pageInfo) {
            const pageConfig: TPageConfig = {
                ...pageInfo,
                modifications
            }
        }

    }

    const handleDeletePage = (page: TPageInfo) => {

    }

    const handleAddCustomPage = () => {
        setPageInfos(prev => {
            const newPage: TPageInfo = {
                route: '',
                name: '',
                isVirtual: true
            };
            return prev ? [...prev, newPage] : [newPage];
        })
    }

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
                            {defaultPages && defaultPages.length > 0 && (
                                <div className={styles.pageList}>
                                    <p className={styles.pageListHeader}>Default pages</p>
                                    {defaultPages.filter(p => !p.isVirtual).map(p => (
                                        <PageListItem page={p} handleOpenPageBuilder={handleOpenPageBuilder}
                                            handleDeletePage={handleDeletePage}
                                        />
                                    ))}
                                </div>
                            )}
                            {customPages && (
                                <div className={styles.pageList}>
                                    <p className={styles.pageListHeader}>Custom pages</p>
                                    {customPages.filter(p => p.isVirtual).map(p => (
                                        <PageListItem page={p} handleOpenPageBuilder={handleOpenPageBuilder}
                                            handleDeletePage={handleDeletePage}
                                        />

                                    ))}
                                    <Tooltip title="Add a new page">
                                        <MenuItem
                                            className={styles.addPageItem}
                                        >
                                            <IconButton
                                                aria-label="add page"
                                                onClick={handleAddCustomPage}
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
                                    {/* <div> */}
                                    <Tabs
                                        value={activeTabNum}
                                        indicatorColor="primary"
                                        textColor="primary"
                                        onChange={(event: React.ChangeEvent<{}>, newValue: number) => {
                                            setActiveTabNum(newValue);
                                        }}
                                    >
                                        <Tab label="Page settings" />
                                        <Tab label="Page builder" />
                                    </Tabs>
                                    {/* <p className={styles.pageBarTitle}>
                                            {EditingPage ? 'Page builder' : editingPageConfig ? 'Page settings' : ''}
                                        </p> */}
                                    {/* </div> */}
                                    <div>
                                        <Button variant="outlined" color="primary"
                                            className={styles.saveBtn}
                                            size="small"
                                            onClick={() => handleSaveEditingPage()}>
                                            Save
                                        </Button>
                                        <IconButton
                                            aria-label="close"
                                            onClick={handleCloseEditingPage}
                                        >
                                            <HighlightOffIcon />
                                        </IconButton>
                                    </div>
                                </div>
                            )}
                            <TabPanel value={activeTabNum} index={0}>
                                {/** Display page settings */}
                                {!isPageLoading && editingPageInfo && (
                                    <PageSettings initialPageConfig={editingPageInfo}
                                        handleSavePage={handleSaveEditingPage}
                                    />
                                )}
                            </TabPanel>
                            <TabPanel value={activeTabNum} index={1}>
                                {/* Display page builder */}
                                {!isPageLoading && EditingPage && (
                                    <div className={styles.EditorWindow} ref={editorWindowRef}>
                                        <PageErrorBoundary>
                                            <Suspense fallback={<LoadBox />}>
                                                <EditingPage />
                                            </Suspense>
                                        </PageErrorBoundary>
                                    </div>
                                )}
                            </TabPanel>
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
            {isPageLoading && (<LoadBox />)}

        </div>
    )
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
