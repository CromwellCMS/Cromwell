import { TCCSModuleInfoDto } from '@cromwell/core';
import { CList, getCentralServerClient } from '@cromwell/core-frontend';
import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Pagination from '../../components/pagination/Pagination';
import { listPreloader } from '../../components/SkeletonPreloader';
import styles from './PluginMarket.module.scss';
import PluginMarketItem from './PluginMarketItem';

export default class PluginMarket extends Component<Partial<RouteComponentProps>> {

    private listId = 'plugin_market';

    public loadList = async (props) => {
        return getCentralServerClient().getPluginList(props);
    }

    render() {
        return (
            <div className={styles.PluginMarket}>
                <CList<TCCSModuleInfoDto>
                    className={styles.listWrapper}
                    id={this.listId}
                    ListItem={PluginMarketItem}
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
            </div>
        )
    }
}
