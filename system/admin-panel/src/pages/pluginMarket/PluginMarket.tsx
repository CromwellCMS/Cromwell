import { TCCSModuleInfoDto, TPackageCromwellConfig } from '@cromwell/core';
import { CList, getCentralServerClient, getRestAPIClient } from '@cromwell/core-frontend';
import React, { Component } from 'react';
import { Skeleton } from '@material-ui/lab';
import { RouteComponentProps } from 'react-router-dom';

import Pagination from '../../components/pagination/Pagination';
import { toast } from '../../components/toast/toast';
import Modal from '../../components/modal/Modal';
import { listPreloader } from '../../components/SkeletonPreloader';
import styles from './PluginMarket.module.scss';
import commonStyles from '../../styles/common.module.scss';
import PluginMarketItem from './PluginMarketItem';
import PluginModal from './PluginModal';


export type ListItemProps = {
    installedPlugins: TPackageCromwellConfig[];
    open: (info: TCCSModuleInfoDto) => any;
    install: (info: TCCSModuleInfoDto) => Promise<boolean>;
}

export default class PluginMarket extends Component<Partial<RouteComponentProps>, {
    installedPlugins: TPackageCromwellConfig[];
    isLoading: boolean;
    openedPlugin?: TCCSModuleInfoDto;
}> {

    private listId = 'plugin_market';

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            installedPlugins: [],
        }
    }

    componentDidMount() {
        this.init();
    }

    private async init() {
        this.setState({ isLoading: true });
        await this.getPluginList();
        this.setState({ isLoading: false });
    }

    private getPluginList = async () => {
        try {
            const pluginInfos = await getRestAPIClient()?.getPluginList();
            if (pluginInfos && Array.isArray(pluginInfos)) {
                this.setState({
                    installedPlugins: pluginInfos,
                })
            }
        } catch (e) {
            console.error(e);
        }
    }


    public loadList = async (props) => {
        return getCentralServerClient().getPluginList(props);
    }

    public openPlugin = (info: TCCSModuleInfoDto) => {
        this.setState({ openedPlugin: info });
    }

    public installPlugin = async (info: TCCSModuleInfoDto): Promise<boolean> => {
        let success = false;
        try {
            success = await getRestAPIClient().installPlugin(info.name);
        } catch (error) {
            console.error(error);
        }
        await this.getPluginList();

        if (success) {
            toast.success('Plugin installed');
        } else {
            toast.error('Failed to install plugin');
        }
        return success;
    }

    render() {
        return (
            <div className={styles.PluginMarket}>
                {this.state.isLoading && Array(4).fill(1).map((it, index) => {
                    return (
                        <Skeleton key={index} variant="rect" height="388px" width="300px" style={{ margin: '0 10px 20px 10px' }} > </Skeleton>
                    )
                })}
                {!this.state.isLoading && (
                    <CList<TCCSModuleInfoDto, ListItemProps>
                        className={styles.listWrapper}
                        id={this.listId}
                        ListItem={PluginMarketItem}
                        listItemProps={{
                            installedPlugins: this.state?.installedPlugins ?? [],
                            install: this.installPlugin,
                            open: this.openPlugin,
                        }}
                        useAutoLoading
                        usePagination
                        useQueryPagination
                        loader={this.loadList}
                        cssClasses={{
                            scrollBox: styles.list,
                            page: styles.listContainer
                        }}
                        elements={{
                            pagination: Pagination,
                            preloader: listPreloader
                        }}
                    />
                )}
                <Modal
                    open={!!this.state.openedPlugin}
                    blurSelector="#root"
                    className={commonStyles.center}
                    onClose={() => this.setState({ openedPlugin: undefined })}
                >
                    {this.state.openedPlugin && (
                        <PluginModal
                            installedPlugins={this.state?.installedPlugins ?? []}
                            install={this.installPlugin}
                            data={this.state.openedPlugin}
                        />
                    )}
                </Modal>
            </div>
        )
    }
}
