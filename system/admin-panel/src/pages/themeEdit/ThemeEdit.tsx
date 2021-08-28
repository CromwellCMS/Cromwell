import { TCromwellBlockData, TPageConfig, TPageInfo, TPluginEntity } from '@cromwell/core';
import { getGraphQLClient, getRestApiClient } from '@cromwell/core-frontend';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import LoadBox from '../../components/loadBox/LoadBox';
import { LoadingStatus } from '../../components/loadBox/LoadingStatus';
import { PageBuilder } from './pageBuilder/PageBuilder';
import styles from './ThemeEdit.module.scss';
import { ThemeEditActions } from './themeEditActions/ThemeEditActions';


class ThemeEditState {
    plugins: TPluginEntity[] | null = null;
    editingPageInfo: TPageConfig | null = null;
    isPageLoading: boolean = false;
    loadingStatus: boolean = false;
}

export default class ThemeEdit extends React.Component<Partial<RouteComponentProps>, ThemeEditState> {
    // Keeps track of modifications that user made (added) currently. Does not store all mods from actual pageCofig!
    // We need to send to the server only newly added modifications! 
    private changedModifications: TCromwellBlockData[] | null | undefined = null;
    public getChangedModifications = () => this.changedModifications;

    private pageBuilderContent = React.createRef<HTMLDivElement>();
    private pageBuilder: PageBuilder;

    constructor(props: any) {
        super(props);
        this.state = new ThemeEditState();
    }

    componentDidMount() {
        this.init();
    }


    private init = async () => {
        const graphQLClient = getGraphQLClient();

        try {
            const pluginEntities: TPluginEntity[] = await graphQLClient.getAllEntities('Plugin',
                graphQLClient.PluginFragment, 'PluginFragment');
            if (pluginEntities && Array.isArray(pluginEntities)) {
                this.setState({ plugins: pluginEntities });
            }
        } catch (e) { console.error(e); }

    }

    private handleOpenPage = async (pageInfo: TPageInfo) => {
        this.setState({ isPageLoading: true });

        let pageConfig: TPageConfig | undefined;
        try {
            if (pageInfo.route && pageInfo.route !== '') {
                pageConfig = await getRestApiClient()?.getPageConfig(pageInfo.route);
            }
        } catch (e) {
            console.error(e);
        }

        this.changedModifications = null;

        this.setState({
            editingPageInfo: pageConfig,
            isPageLoading: false,
        });
    }

    private handlePageModificationsChange = (modifications: TCromwellBlockData[] | null | undefined) => {
        this.changedModifications = modifications;
    }


    public handleTabChange = () => {
        if (this.pageBuilderContent.current) {
            this.pageBuilderContent.current.style.opacity = '0';
            this.pageBuilderContent.current.style.transitionDuration = '0s'
            setTimeout(() => {
                this.pageBuilderContent.current.style.transitionDuration = '0.3s';
                setTimeout(() => {
                    this.pageBuilderContent.current.style.opacity = '1';
                }, 100);
            }, 400);
        }
    }

    public resetModifications = () => {
        this.changedModifications = null;
    }

    public undoModification = () => {
        this.pageBuilder.undoModification();
    }

    public redoModification = () => {
        this.pageBuilder.redoModification();
    }

    render() {
        const {
            editingPageInfo,
            isPageLoading } = this.state;

        return (
            <div className={styles.ThemeEdit}>
                <div className={styles.header}>
                    <ThemeEditActions
                        editingPageInfo={editingPageInfo}
                        themeEditPage={this}
                        openPage={this.handleOpenPage}
                        history={this.props.history}
                        undoModification={this.undoModification}
                        redoModification={this.redoModification}
                    />
                </div>
                <div className={styles.pageBuilder} ref={this.pageBuilderContent}>
                    {(isPageLoading || !editingPageInfo) && (<LoadBox />)}
                    {!isPageLoading && editingPageInfo && (
                        <PageBuilder
                            getInst={inst => this.pageBuilder = inst}
                            plugins={this.state.plugins}
                            editingPageInfo={editingPageInfo}
                            onPageModificationsChange={this.handlePageModificationsChange}
                        />
                    )}
                </div>
                <LoadingStatus isActive={this.state.loadingStatus} />
            </div>
        )
    }
}