import { getRandStr, TPageConfig, TPageInfo } from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import { Button, Drawer, IconButton, MenuItem, Popover, Tooltip } from '@material-ui/core';
import {
    AddCircle as AddCircleIcon,
    DeleteForever as DeleteForeverIcon,
    MoreVertOutlined as MoreVertOutlinedIcon,
    SettingsBackupRestore as SettingsBackupRestoreIcon,
    InfoOutlined as InfoOutlinedIcon,
    Pages as PagesIcon,
    Redo as RedoIcon, Undo as UndoIcon,
    Close as CloseIcon,
} from '@material-ui/icons';
import clsx from 'clsx';
import { History } from 'history';
import React, { Component } from 'react';
import { LoadingStatus } from '../../../components/loadBox/LoadingStatus';
import { toast } from '../../../components/toast/toast';
import { PageListItem } from '../pageListItem/PageListItem';
import { PageSettings } from '../pageSettings/PageSettings';
import ThemeEdit from '../ThemeEdit';
import styles from './ThemeEditActions.module.scss';


export class ThemeEditActions extends Component<{
    editingPageInfo: TPageConfig | null;
    themeEditPage: ThemeEdit;
    openPage: (pageInfo: TPageInfo) => any;
    history: History;
    undoModification: () => void;
    redoModification: () => void;
}, {
    pageOptionsOpen: boolean;
    pageMetaOpen: boolean;
    loadingStatus: boolean;
    isSidebarOpen: boolean;
    pageInfos: TPageInfo[] | null;
}> {

    private optionsAnchorEl = React.createRef<HTMLButtonElement>();
    private wrapperRef = React.createRef<HTMLDivElement>();
    private changedPageInfo: TPageInfo | null = null;
    private unregisterBlock;
    private unsavedPrompt = 'Your unsaved changes will be lost. Do you want to discard and leave this page?';

    constructor(props: any) {
        super(props);
        this.state = {
            pageOptionsOpen: false,
            pageMetaOpen: false,
            loadingStatus: false,
            isSidebarOpen: false,
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

    public hasUnsavedModifications = () => !!(this.changedPageInfo || this.props.themeEditPage?.getChangedModifications()?.length > 0);


    private init = async () => {
        try {
            const infos = await getRestApiClient()?.getPagesInfo();
            if (infos) this.setState({ pageInfos: infos });

            this.handleOpenPage(infos[0])
        } catch (error) {
            console.error(error);
        }
    }

    private handleOptionsToggle = () => {
        this.setState(prev => ({
            pageOptionsOpen: !prev.pageOptionsOpen,
        }))
    }

    private handleMetaToggle = () => {
        this.setState(prev => ({
            pageMetaOpen: !prev.pageMetaOpen,
        }))
    }

    private handlePagesToggle = () => {
        this.setState(prev => ({
            isSidebarOpen: !prev.isSidebarOpen,
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

    private handleDeleteCurrentPage = async () => {
        if (this.props.editingPageInfo?.route) {
            let success;
            try {
                success = await getRestApiClient()?.deletePage(this.props.editingPageInfo.route);
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
            pageOptionsOpen: false,
        })
    }

    private handlePageInfoChange = (page: TPageInfo) => {
        this.changedPageInfo = page;
    }

    private handleDeletePage = () => {

    }


    private handleResetCurrentPage = async () => {
        if (this.props.editingPageInfo?.route) {
            let success;
            try {
                success = await getRestApiClient()?.resetPage(this.props.editingPageInfo.route);
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
            pageOptionsOpen: false,
        });
    }

    private handleSaveEditingPage = async () => {
        const themeEditPage = this.props.themeEditPage;

        if (!this.hasUnsavedModifications()) {
            toast.warning('No changes to save');
            return;
        }

        const pageInfo = this.changedPageInfo ?? this.props.editingPageInfo;
        const modifications = themeEditPage.getChangedModifications() ?? [];

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

            if (success) {
                themeEditPage.resetModifications();
                toast.success('Saved');
            } else {
                toast.error('Failed to save changes');
            }

            this.setState({ loadingStatus: false });
        }
    }

    private handleOpenPage = async (pageInfo: TPageInfo) => {
        if (this.hasUnsavedModifications() && !window.confirm(this.unsavedPrompt)) return;
        this.changedPageInfo = null;
        await this.props.openPage(pageInfo);
    }

    private undoModification = () => {
        this.props.themeEditPage.undoModification();
    }

    private redoModification = () => {
        this.props.themeEditPage.redoModification();
    }

    render() {
        const { pageInfos, isSidebarOpen } = this.state;
        const { editingPageInfo } = this.props;
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
                        <PageSettings initialPageConfig={editingPageInfo}
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
                                disabled={!this.props.editingPageInfo?.isVirtual}
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
                            {defaultPages.filter(p => !p.isVirtual).map(p => (
                                <PageListItem
                                    activePage={editingPageInfo}
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
                                    activePage={editingPageInfo}
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
            </Drawer>
        </>)
    }
}
