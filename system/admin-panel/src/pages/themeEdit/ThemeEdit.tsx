import { TCromwellBlockData, TPageConfig, TPageInfo, TPluginEntity } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { LoadingStatus } from '../../components/loadBox/LoadingStatus';
import { PageBuilder } from './pageBuilder/PageBuilder';
import styles from './ThemeEdit.module.scss';
import { ThemeEditActions } from './themeEditActions/ThemeEditActions';

export type TExtendedPageInfo = TPageInfo & {
    isSaved?: boolean;
    previewUrl?: string;
}

export type TEditorInstances = {
    pageBuilder?: PageBuilder;
    actions?: ThemeEditActions;
    themeEditor?: ThemeEdit;
}

export type TExtendedPageConfig = TPageConfig & TExtendedPageInfo;

type ThemeEditState = {
    plugins: TPluginEntity[] | null;
    isPageLoading: boolean;
    loadingStatus: boolean;
}

export default class ThemeEdit extends React.Component<Partial<RouteComponentProps>, ThemeEditState> {
    // Keeps track of modifications that user made (added) currently. Does not store all mods from actual pageCofig!
    // We need to send to the server only newly added modifications! 
    private changedModifications: TCromwellBlockData[] | null | undefined = null;
    public getChangedModifications = () => this.changedModifications;

    private pageBuilderContent = React.createRef<HTMLDivElement>();

    private editingPageConfig: TExtendedPageConfig | null | undefined = null;
    public getEditingPageConfig = () => this.editingPageConfig;
    public setEditingPageConfig = (info: TPageConfig | null) => this.editingPageConfig = info;

    private instances: TEditorInstances = { themeEditor: this };

    constructor(props: any) {
        super(props);
        this.state = {
            plugins: null,
            isPageLoading: false,
            loadingStatus: false,
        };
    }

    componentDidMount() {
        this.init();
    }

    public init = async () => {
        const graphQLClient = getGraphQLClient();

        try {
            const pluginEntities: TPluginEntity[] = await graphQLClient.getAllEntities('Plugin',
                graphQLClient.PluginFragment, 'PluginFragment');
            if (pluginEntities && Array.isArray(pluginEntities)) {
                this.setState({ plugins: pluginEntities });
            }
        } catch (e) { console.error(e); }
    }

    private handlePageModificationsChange = (modifications: TCromwellBlockData[] | null | undefined) => {
        this.changedModifications = modifications;
    }

    public pageChangeStart = () => {
        this.instances.pageBuilder?.pageChangeStart();
    }

    public pageChangeFinish = () => {
        this.instances.pageBuilder?.pageChangeFinish();
    }

    public resetModifications = () => {
        this.changedModifications = null;
    }

    public undoModification = () => {
        this.instances.pageBuilder.undoModification();
    }

    public redoModification = () => {
        this.instances.pageBuilder.redoModification();
    }

    render() {
        const { isPageLoading } = this.state;

        return (
            <div className={styles.ThemeEdit}>
                <div className={styles.header}>
                    <ThemeEditActions
                        instances={this.instances}
                        history={this.props.history}
                        undoModification={this.undoModification}
                        redoModification={this.redoModification}
                    />
                </div>
                {/* {(isPageLoading || !this.editingPageConfig) && (<LoadBox />)} */}
                <div className={styles.pageBuilder} ref={this.pageBuilderContent}>
                    {this.editingPageConfig && !isPageLoading && (
                        <PageBuilder
                            instances={this.instances}
                            plugins={this.state.plugins}
                            editingPageInfo={this.editingPageConfig}
                            onPageModificationsChange={this.handlePageModificationsChange}
                        />
                    )}
                </div>
                <LoadingStatus isActive={this.state.loadingStatus || isPageLoading} />
            </div>
        )
    }
}