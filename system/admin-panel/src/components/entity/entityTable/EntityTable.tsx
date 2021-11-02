import { gql, DocumentNode } from '@apollo/client';
import { getBlockInstance, TPagedParams, TBaseFilter, TBasePageEntity, TDeleteManyInput, TPagedList, EDBEntity } from '@cromwell/core';
import { CList, getGraphQLClient, TCList } from '@cromwell/core-frontend';
import {
    AccountTreeOutlined as AccountTreeOutlinedIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    List as ListIcon,
    UnfoldLess as UnfoldLessIcon,
    UnfoldMore as UnfoldMoreIcon,
} from '@mui/icons-material';
import { Button, Checkbox, IconButton, Skeleton, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { connect, PropsType } from 'react-redux-ts';
import { useHistory, withRouter, RouteComponentProps } from 'react-router-dom';
import { debounce } from 'throttle-debounce';

import { LoadingStatus } from '../../loadBox/LoadingStatus';
import ConfirmationModal from '../../modal/Confirmation';
import Pagination from '../../pagination/Pagination';
import { listPreloader } from '../../skeleton/SkeletonPreloader';
import { toast } from '../../toast/toast';
import { PageInfo } from '../../../constants/PageInfos';
import {
    countSelectedItems,
    getSelectedInput,
    resetSelected,
    toggleItemSelection,
    toggleSelectAll,
} from '../../../redux/helpers';
import { TAppState } from '../../../redux/store';
import commonStyles from '../../../styles/common.module.scss';
import styles from './EntityTable.module.scss'
import EntityTableItem from './EntityTableItem';
import { TCustomEntityColumn } from '../../../helpers/customEntities';

const mapStateToProps = (state: TAppState) => {
    return {
        allSelected: state.allSelected,
    }
}

export type TEntityTableProps<TEntityType extends TBasePageEntity, TFilterType extends TBaseFilter> = PropsType<TAppState, {
    /**
     * Category of entity to display. Supports default types
     */
    entityCategory: EDBEntity;

    /**
     * If entity is custom, provide custom type
     */
    entityType?: string;

    /**
     * Properties of entity to show in columns
     */
    columns: TCustomEntityColumn[];

    /**
     * Property of an element to use as a name in modals, such as: "Delete MyNewProductName?"
     * Will use ID by default 
     */
    nameProperty?: keyof TEntityType;

    /**
     * Name of one item such as: Product, Post, etc. Used in modals
     */
    entityLabel?: string;

    /**
     * How to name this list / page? 
     */
    listLabel: string;


    /**
     * Page to open when user clicks "edit"
     */
    entityBaseRoute?: PageInfo;

    /**
     * API methods called on user actions
     */
    deleteOne: (id: number) => any;
    deleteMany: (input: TDeleteManyInput) => any;
    deleteManyFiltered: (input: TDeleteManyInput, filter: TFilterType) => any;

    getManyFiltered: (options: {
        pagedParams?: TPagedParams<TEntityType>;
        filterParams?: TFilterType;
        customFragment?: DocumentNode;
        customFragmentName?: string;
    }) => Promise<TPagedList<TEntityType>>;
}, ReturnType<typeof mapStateToProps>> & RouteComponentProps;


export type ListItemProps<TEntityType extends TBasePageEntity, TFilterType extends TBaseFilter> = {
    handleDeleteBtnClick: (item: TEntityType) => void;
    toggleSelection?: (item: TEntityType) => void;
    tableProps: TEntityTableProps<TEntityType, TFilterType>;
}

class EntityTable<TEntityType extends TBasePageEntity, TFilterType extends TBaseFilter>
    extends React.Component<TEntityTableProps<TEntityType, TFilterType>, {
        isLoading: boolean;
        itemToDelete: TEntityType | null;
        deleteSelectedOpen: boolean;
    }> {

    private totalElements: number | null;
    private filterInput: TFilterType = {} as any;
    private listId: string;

    constructor(props) {
        super(props);
        this.listId = `${this.props.entityCategory}_list`;
    }

    private resetList = () => {
        this.totalElements = null;
        const list = getBlockInstance<TCList>(this.listId)?.getContentInstance();
        list?.clearState();
        list?.init();
    }

    private updateList = () => {
        this.totalElements = null;
        const list = getBlockInstance<TCList>(this.listId)?.getContentInstance();
        list?.updateData();
    }

    private handleDeleteBtnClick = (itemToDelete: TEntityType) => {
        this.setState({ itemToDelete });
    }

    private handleDeleteItem = async () => {
        if (this.state?.itemToDelete?.id) {
            try {
                await this.props.deleteOne(this.state?.itemToDelete.id)
                toast.success(`${this.props.entityLabel ?? 'Item'} deleted`);
            } catch (e) {
                console.error(e);
                toast.error(`Failed to delete ${this.props.entityLabel?.toLowerCase() ?? 'item'}`);
            }
            this.updateList();
        }
    }

    private handleDeleteSelectedBtnClick = () => {
        if (countSelectedItems(this.totalElements) > 0)
            this.setState({ deleteSelectedOpen: true });
    }

    private handleCreate = () => {
        this.props.history.push(`${this.props.entityBaseRoute}/new`)
    }

    private handleFilterUpdate = debounce(400, () => {
        this.resetList();
    });

    private getManyFilteredItems = async (params: TPagedParams<TEntityType>) => {
        if (this.props.entityType) {
            if (!this.filterInput.properties) this.filterInput.properties = [];
            this.filterInput.properties.push({
                key: 'entityType',
                value: this.props.entityType,
                exact: true,
            })
        }
        const data = await this.props.getManyFiltered({
            pagedParams: params,
            customFragment: gql`
                fragment ${this.props.entityCategory}ListFragment on ${this.props.entityCategory} {
                    id
                    slug
                    isEnabled
                    ${this.props.columns.map(prop => prop.property).join('\n')}
                }
            `,
            customFragmentName: `${this.props.entityCategory}ListFragment`,
            filterParams: this.filterInput,
        });
        if (data?.pagedMeta?.totalElements) {
            this.totalElements = data.pagedMeta?.totalElements;
        }
        return data;
    }

    private handleToggleItemSelection = (data: TEntityType) => {
        toggleItemSelection(data.id);
    }

    private handleToggleSelectAll = () => {
        toggleSelectAll()
    }

    private handleDeleteSelected = async () => {
        this.setState({ isLoading: true });
        this.totalElements = 0;
        try {
            const input = getSelectedInput();
            await this.props.deleteManyFiltered(input, this.filterInput);
            toast.success(`${this.props.entityLabel ?? 'Items'} deleted`);
        } catch (e) {
            console.error(e);
            toast.error(`Failed to delete ${this.props.entityLabel ?? 'items'}`);
        }
        resetSelected();
        this.updateList();
        this.setState({ isLoading: false, deleteSelectedOpen: false });
    }


    render() {
        return (
            <div className={styles.EntityTable}>
                <div className={styles.header}>
                    <p>{this.props.entityListLabel}</p>
                    <Button>Add new</Button>
                </div>
                <div className={styles.tableHeader}>
                    <div className={commonStyles.center}>
                        <Tooltip title="Select all">
                            <Checkbox
                                style={{ marginRight: '10px' }}
                                checked={this.props.allSelected ?? false}
                                onChange={this.handleToggleSelectAll}
                            />
                        </Tooltip>
                    </div>
                    <div className={styles.tableProperties}>
                        {this.props.columns.map(prop => (
                            <p key={prop.property}>{prop.label}</p>
                        ))}
                    </div>
                </div>
                <CList<TEntityType, ListItemProps<TEntityType, TFilterType>>
                    className={styles.listWrapper}
                    id={this.listId}
                    ListItem={EntityTableItem}
                    useAutoLoading
                    usePagination
                    listItemProps={{
                        handleDeleteBtnClick: this.handleDeleteBtnClick,
                        toggleSelection: this.handleToggleItemSelection,
                        tableProps: this.props,
                    }}
                    useQueryPagination
                    loader={this.getManyFilteredItems}
                    cssClasses={{
                        scrollBox: styles.list,
                        contentWrapper: styles.listContent,
                    }}
                    elements={{
                        pagination: Pagination,
                        preloader: listPreloader
                    }}
                />
                <ConfirmationModal
                    open={Boolean(this.state?.itemToDelete)}
                    onClose={() => this.setState({ itemToDelete: null })}
                    onConfirm={this.handleDeleteItem}
                    title={`Delete ${this.props.entityLabel ?? 'item'} ${this.state?.itemToDelete?.[
                        this.props.nameProperty ?? 'id'] ?? ''}?`}
                />
                <ConfirmationModal
                    open={this.state?.deleteSelectedOpen}
                    onClose={() => this.setState({ deleteSelectedOpen: false })}
                    onConfirm={this.handleDeleteSelected}
                    title={`Delete ${countSelectedItems(this.totalElements)} item(s)?`}
                    disabled={this.state?.isLoading}
                />
            </div>
        )
    }
}


export default connect(mapStateToProps)(withRouter(EntityTable));