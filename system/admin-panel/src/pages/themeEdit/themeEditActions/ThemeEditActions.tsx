import { getRandStr, TPageConfig } from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import { Button, Drawer, IconButton, MenuItem, Popover, Tooltip } from '@material-ui/core';
import {
    AddCircle as AddCircleIcon,
    Close as CloseIcon,
    DeleteForever as DeleteForeverIcon,
    InfoOutlined as InfoOutlinedIcon,
    MoreVertOutlined as MoreVertOutlinedIcon,
    Pages as PagesIcon,
    Redo as RedoIcon,
    SettingsBackupRestore as SettingsBackupRestoreIcon,
    Undo as UndoIcon,
} from '@material-ui/icons';
import clsx from 'clsx';
import { History } from 'history';
import React, { Component } from 'react';

import { LoadingStatus } from '../../../components/loadBox/LoadingStatus';
import { askConfirmation } from '../../../components/modal/Confirmation';
import { toast } from '../../../components/toast/toast';
import { PageListItem } from '../pageListItem/PageListItem';
import { PageSettings } from '../pageSettings/PageSettings';
import { TEditorInstances, TExtendedPageInfo } from '../ThemeEdit';
import styles from './ThemeEditActions.module.scss';

export class ThemeEditActions extends Component<{
    instances: TEditorInstances;
    history: History;
    undoModification: () => void;
    redoModification: () => void;
}, {
    pageOptionsOpen: boolean;
    pageMetaOpen: boolean;
    loadingStatus: boolean;
    isSidebarOpen: boolean;
    pageInfos: TExtendedPageInfo[] | null;
}> {

    private optionsAnchorEl = React.createRef<HTMLButtonElement>();
    private wrapperRef = React.createRef<HTMLDivElement>();
    private hasChangedPageInfo: boolean = false;
    private unregisterBlock;
    private unsavedPrompt = 'Your unsaved changes will be lost. Do you want to discard and leave this page?';

    constructor(props) {
        super(props);
        props.instances.actions = this;
        this.state = {
            pageOptionsOpen: false,
            pageMetaOpen: false,
            loadingStatus: false,
            isSidebarOpen: true,
            pageInfos: null,
        }
    }

    componentDidMount() {
        this.init();

        this.unregisterBlock = this.props.history?.block(() => {
            if (this.hasUnsavedModifications()) return this.unsavedPrompt;
        });
    }

    componentWillUnmount() {
        this.unregisterBlock?.();
    }

    private getThemeEditor = () => this.props.instances.themeEditor;

    public hasUnsavedModifications = () => !!(this.hasChangedPageInfo
        || this.getThemeEditor()?.getChangedModifications()?.length > 0);


    private init = async () => {
        const infos = await this.getPageInfos();
        if (infos?.[0]) this.handleOpenPage(infos?.[0]);
    }

    private getPageInfos = async () => {
        try {
            let infos: TExtendedPageInfo[] = await getRestApiClient()?.getPagesInfo();
            if (infos) {
                // Set page preview for generic pages as a first id 
                infos = infos.map(page => {
                    const isGeneric = page.route && (page.route.endsWith('[slug]') || page.route.endsWith('[id]'));
                    if (isGeneric && !page.previewUrl) {
                        page.previewUrl = page.route.replace('[slug]', '1').replace('[id]', '1');
                    }
                    return page;
                })
                this.setState({ pageInfos: infos });
            }
            return infos;
        } catch (error) {
            console.error(error);
        }
    }

    private handleOptionsToggle = () => {
        this.setState(prev => ({
            pageOptionsOpen: !prev.pageOptionsOpen,
        }));
    }

    private handleMetaToggle = () => {
        this.setState(prev => ({
            pageMetaOpen: !prev.pageMetaOpen,
        }));
    }

    private handlePagesToggle = () => {
        if (!(this.props.instances.pageBuilder.getSelectedBlock() &&
            this.state.isSidebarOpen)) {

            this.setState(prev => ({
                isSidebarOpen: !prev.isSidebarOpen,
            }));
        }

        if (this.props.instances.pageBuilder.getSelectedBlock()) {
            this.props.instances.pageBuilder.deselectCurrentBlock();
        }
    }

    private handleAddCustomPage = () => {
        this.setState(prev => {
            const newPage: TExtendedPageInfo = {
                id: `generic_${getRandStr(8)}`,
                route: 'pages/new',
                name: 'New page',
                isVirtual: true,
                isSaved: false,
            };
            const prevPages = prev.pageInfos;
            return {
                pageInfos: prevPages ? [...prevPages, newPage] : [newPage]
            }
        });
    }

    private handlePageInfoChange = (page: TPageConfig) => {
        this.getThemeEditor().setEditingPageConfig(page);
        this.hasChangedPageInfo = true;
        this.forceUpdate();
    }

    private handleDeleteCurrentPage = async () => {
        this.setState({
            pageOptionsOpen: false,
        });
        const editingPageConfig = this.getThemeEditor().getEditingPageConfig();
        if (!editingPageConfig?.route) return;

        this.hasChangedPageInfo = false;
        this.getThemeEditor().resetModifications();
        await this.handleDeletePage(editingPageConfig);
        await this.init();
    }

    private handleDeletePage = async (pageInfo: TExtendedPageInfo) => {
        if (! await askConfirmation({
            title: `Delete page ${pageInfo.name} ?`,
        })) return;

        let success;
        if (pageInfo.isSaved === false) {
            success = true;
        } else {
            try {
                success = await getRestApiClient()?.deletePage(pageInfo.route);
            } catch (error) {
                console.error(error);
            }
        }

        if (success) {
            this.setState(prev => ({
                pageInfos: prev.pageInfos.filter(page => page.id !== pageInfo.id),
            }))
            toast.success('Page deleted');
        } else {
            toast.error('Failed to delete page');
        }
    }

    private handleResetCurrentPage = async () => {
        this.setState({
            pageOptionsOpen: false,
        });

        const editingPageConfig = this.getThemeEditor().getEditingPageConfig();
        if (!editingPageConfig?.route) return;
        this.hasChangedPageInfo = false;
        this.getThemeEditor().resetModifications();

        if (! await askConfirmation({
            title: `Reset page ${editingPageConfig?.name} ?`,
        })) return;

        let success;
        try {
            success = await getRestApiClient()?.resetPage(editingPageConfig.route);
        } catch (error) {
            console.error(error);
        }

        this.handleOpenPage(editingPageConfig);

        if (success) {
            toast.success('Page has been reset');
        } else {
            toast.error('Failed to reset page');
        }
    }

    private handleSaveEditingPage = async () => {
        const themeEditor = this.getThemeEditor();
        const editingPageConfig = this.getThemeEditor().getEditingPageConfig();

        if (!this.hasUnsavedModifications() && (editingPageConfig as TExtendedPageInfo).isSaved !== false) {
            toast.warning('No changes to save');
            return;
        }

        const modifications = themeEditor.getChangedModifications() ?? [];

        if (!editingPageConfig) return;

        const pageConfig: TPageConfig = {
            ...editingPageConfig,
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

        if (success) {
            themeEditor.resetModifications();
            this.hasChangedPageInfo = false;
            toast.success('Saved');

            let hasChangedRoute = false;
            delete (editingPageConfig as TExtendedPageInfo).isSaved;
            this.setState(prev => {
                return {
                    pageInfos: prev.pageInfos.map(page => {
                        if (page.id === pageConfig.id) {
                            if (page.route !== pageConfig.route) hasChangedRoute = true;
                            return pageConfig;
                        }
                        return page;
                    })
                }
            });

            if (hasChangedRoute) {
                this.handleOpenPage(pageConfig);
            }
        } else {
            toast.error('Failed to save changes');
        }
        this.setState({ loadingStatus: false });
    }

    private handleOpenPage = async (pageInfo: TExtendedPageInfo) => {
        if (this.hasUnsavedModifications() && !window.confirm(this.unsavedPrompt)) return;
        this.hasChangedPageInfo = false;
        this.getThemeEditor().resetModifications();
        this.getThemeEditor().setState({ isPageLoading: true });

        let pageConfig: TPageConfig | undefined;
        if (pageInfo?.isSaved !== false) {
            try {
                if (pageInfo.route && pageInfo.route !== '') {
                    pageConfig = await getRestApiClient()?.getPageConfig(pageInfo.route);
                }
            } catch (e) {
                console.error(e);
            }
        }

        this.forceUpdate();
        this.getThemeEditor().handlePageChange();
        this.getThemeEditor().setEditingPageConfig(Object.assign({}, pageInfo, pageConfig));
        this.getThemeEditor().setState({ isPageLoading: false });
    }

    private undoModification = () => {
        this.getThemeEditor().undoModification();
    }

    private redoModification = () => {
        this.getThemeEditor().redoModification();
    }

    private handlePreviewChange = (pageConfig: TExtendedPageInfo) => (url: string) => {
        const editingPageConfig = this.getThemeEditor().getEditingPageConfig();
        if (editingPageConfig.id === pageConfig.id) {
            this.getThemeEditor().setEditingPageConfig(Object.assign({}, editingPageConfig, {
                previewUrl: url,
            }));

            this.getThemeEditor().setState({ isPageLoading: true });
            setTimeout(() => {
                this.getThemeEditor().setState({ isPageLoading: false });
            }, 100);
            this.getThemeEditor().handlePageChange();
        }

        this.setState(prev => ({
            pageInfos: prev.pageInfos.map(page => {
                if (page.id === pageConfig.id) {
                    page.previewUrl = url;
                }
                return page;
            }),
        }));
    }

    render() {
        const { isSidebarOpen } = this.state;
        const editingPageConfig = this.getThemeEditor().getEditingPageConfig();
        const pageInfos = this.state.pageInfos?.map(p => {
            if (p.id === editingPageConfig?.id) {
                return Object.assign({}, p, editingPageConfig);
            }
            return p;
        });
        const defaultPages = pageInfos?.filter(p => !p.isVirtual);
        const customPages = pageInfos?.filter(p => p.isVirtual);

        return (<>
            <div className={styles.ThemeEditActions} ref={this.wrapperRef}>
                <div>
                    <Tooltip title="Pages">
                        <IconButton
                            onClick={this.handlePagesToggle}
                        >
                            <PagesIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Page meta info">
                        <IconButton
                            onClick={this.handleMetaToggle}
                        >
                            <InfoOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                    <Popover open={this.state.pageMetaOpen}
                        anchorEl={this.wrapperRef.current}
                        style={{ zIndex: 9999 }}
                        onClose={this.handleMetaToggle}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        <PageSettings
                            pageConfig={editingPageConfig}
                            handlePageInfoChange={this.handlePageInfoChange}
                        />
                    </Popover>
                    <Tooltip title="Undo">
                        <IconButton
                            onClick={this.undoModification}
                        >
                            <UndoIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Redo">
                        <IconButton
                            onClick={this.redoModification}
                        >
                            <RedoIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <div className={styles.bottomBlock} >
                    <Tooltip title="Options">
                        <IconButton
                            onClick={this.handleOptionsToggle}
                            className={styles.actionBtn}
                            aria-label="Options"
                            ref={this.optionsAnchorEl}
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
                                disabled={!editingPageConfig?.isVirtual}
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
            <LoadingStatus isActive={this.state.loadingStatus} />
            <Drawer
                classes={{ paper: styles.sidebarPaper }}
                variant="persistent"
                anchor={'left'}
                open={isSidebarOpen}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.sidebar}>
                    <Tooltip title="Close">
                        <IconButton
                            className={styles.sidebarCloseBtn}
                            onClick={this.handlePagesToggle}>
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                    {defaultPages && defaultPages.length > 0 && (
                        <div className={styles.pageList} key="_2_">
                            <p className={styles.pageListHeader}>Theme pages</p>
                            {defaultPages.map(p => (
                                <PageListItem
                                    activePage={editingPageConfig}
                                    key={p.id + p.route}
                                    page={p}
                                    handleOpenPage={this.handleOpenPage}
                                    handleDeletePage={this.handleDeletePage}
                                    onPreviewChange={this.handlePreviewChange(p)}
                                />
                            ))}
                        </div>
                    )}
                    {customPages && (
                        <div className={styles.pageList} key="_3_">
                            <p className={styles.pageListHeader}>Custom pages</p>
                            {customPages.map(p => (
                                <PageListItem
                                    activePage={editingPageConfig}
                                    key={p.id + p.route}
                                    page={p}
                                    handleOpenPage={this.handleOpenPage}
                                    handleDeletePage={this.handleDeletePage}
                                    onPreviewChange={this.handlePreviewChange(p)}
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
            </Drawer>
        </>)
    }
}
