import { gql } from '@apollo/client';
import { getBlockInstance, TBasePageEntity, TCustomEntityColumn, TPagedParams } from '@cromwell/core';
import { CList, TCList } from '@cromwell/core-frontend';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { Button, Checkbox, IconButton, Tooltip, Popover } from '@mui/material';
import clsx from 'clsx';
import React, { useState } from 'react';
import { connect, PropsType } from 'react-redux-ts';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { debounce } from 'throttle-debounce';

import { getCustomFieldsFor } from '../../../helpers/customFields';
import {
    countSelectedItems,
    getSelectedInput,
    resetSelected,
    toggleItemSelection,
    toggleSelectAll,
} from '../../../redux/helpers';
import { TAppState } from '../../../redux/store';
import commonStyles from '../../../styles/common.module.scss';
import ConfirmationModal from '../../modal/Confirmation';
import { DraggableList } from '../../draggableList/DraggableList';
import Pagination from '../../pagination/Pagination';
import { listPreloader } from '../../skeleton/SkeletonPreloader';
import { toast } from '../../toast/toast';
import { TBaseEntityFilter, TEntityPageProps } from '../types';
import styles from './EntityTable.module.scss';
import EntityTableItem from './EntityTableItem';

const mapStateToProps = (state: TAppState) => {
    return {
        allSelected: state.allSelected,
    }
}

export type TEntityTableProps<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter>
    = PropsType<TAppState, TEntityPageProps<TEntityType, TFilterType>,
        ReturnType<typeof mapStateToProps>> & RouteComponentProps;

export type TTableColumn = TCustomEntityColumn & { hidden?: boolean };

export type TListItemProps<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter> = {
    handleDeleteBtnClick: (item: TEntityType) => void;
    toggleSelection?: (item: TEntityType) => void;
    tableProps: TEntityTableProps<TEntityType, TFilterType>;
    getColumns: () => TTableColumn[];
    getColumnStyles: (column: TTableColumn, allColumns: TTableColumn[]) => React.CSSProperties;
}

class EntityTable<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter>
    extends React.Component<TEntityTableProps<TEntityType, TFilterType>, {
        isLoading: boolean;
        itemToDelete: TEntityType | null;
        deleteSelectedOpen: boolean;
        configureColumnsOpen: boolean;
    }> {

    private totalElements: number | null;
    private filterInput: TFilterType = {} as any;
    private listId: string;
    private configureColumnsButtonRef = React.createRef<HTMLButtonElement>();
    private configuredColumnsKey = 'crw_entity_table_columns';

    public sortedColumns: Record<string, {
        name: string;
        order?: number;
        hidden?: boolean;
    }> = {};

    constructor(props) {
        super(props);
        this.listId = `${this.props.entityCategory}_list`;

        const configuredColumns = this.loadConfiguredColumns();
        this.sortedColumns = configuredColumns[this.props.entityType ?? this.props.entityCategory] ?? {};
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
            this.setState({ itemToDelete: null });
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
        const tableColumns = this.getColumns();
        if (this.props.entityType) {
            this.filterInput.entityType = this.props.entityType;
        }
        const entityProperties = [...new Set([
            'id', 'slug', 'isEnabled', 'entityType', 'createDate',
            ...tableColumns.filter(col => !col.meta).map(col => col.name),
        ])];
        const metaProperties = [...new Set([
            ...tableColumns.filter(col => col.meta).map(col => col.name)
        ])];

        const data = await this.props.getManyFiltered({
            pagedParams: params,
            customFragment: gql`
                fragment ${this.props.entityCategory}ListFragment on ${this.props.entityCategory} {
                    ${entityProperties.join('\n')}
                    customMeta(fields: ${JSON.stringify(metaProperties)})
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

    public getColumns = (): TTableColumn[] => {
        const customFields = getCustomFieldsFor(this.props.entityType ?? this.props.entityCategory);
        return [
            ...(this.props.columns ?? []),
            ...customFields.map(field => ({
                label: field.label,
                name: field.key,
                meta: true,
                type: field.fieldType,
                order: field.order,
            }))
        ].filter(col => col.type !== 'Text editor' && col.type !== 'Gallery')
            .map(col => ({
                ...col,
                hidden: this.sortedColumns[col.name]?.hidden,
                order: this.sortedColumns[col.name]?.order ?? col.order,
            }))
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    public getColumnStyles = (column: TTableColumn, allColumns: TTableColumn[]): React.CSSProperties => {
        const normalWidth = 100 / allColumns.filter(col => !col.hidden).length + '%';
        return {
            minWidth: column.minWidth && column.minWidth + 'px',
            maxWidth: column.maxWidth && column.maxWidth + 'px',
            width: column.width ? column.width + 'px' : normalWidth,
        }
    }

    private toggleConfigureColumns = () => {
        this.setState(prev => {
            const isOpen = !prev?.configureColumnsOpen;
            if (!isOpen) {
                this.resetList();
                this.saveConfiguredColumns();
            }
            return { configureColumnsOpen: isOpen }
        });
    }

    private changeColumnsOrder = (columns: (TColumnConfigureItemData<TEntityType, TFilterType>)[]) => {
        columns.forEach((item, idx) => {
            if (!this.sortedColumns[item.column.name])
                this.sortedColumns[item.column.name] = { name: item.column.name };
            this.sortedColumns[item.column.name].order = idx;
        });
    }

    private saveConfiguredColumns = () => {
        const configuredColumns = this.loadConfiguredColumns();
        configuredColumns[this.props.entityType ?? this.props.entityCategory] = this.sortedColumns;
        window.localStorage.setItem(this.configuredColumnsKey, JSON.stringify(configuredColumns));
    }

    private loadConfiguredColumns = () => {
        let configuredColumns: Record<string, EntityTable<TEntityType, TFilterType>['sortedColumns']> = {};
        const prevData = window.localStorage.getItem(this.configuredColumnsKey);
        try {
            if (prevData) configuredColumns = JSON.parse(prevData);
        } catch (error) {
            console.error(error);
        }
        return configuredColumns ?? {};
    }

    render() {
        const tableColumns = this.getColumns();
        return (
            <div className={styles.EntityTable}>
                <div className={styles.header}>
                    <h1 className={styles.pageTitle}>{this.props.listLabel}</h1>
                    <Button variant="contained"
                        size="small"
                        onClick={this.handleCreate}
                    >Add new</Button>
                </div>
                <div className={styles.tableHeader}>
                    <div className={commonStyles.center}>
                        <Tooltip title="Select all">
                            <Checkbox
                                checked={this.props.allSelected ?? false}
                                onChange={this.handleToggleSelectAll}
                            />
                        </Tooltip>
                    </div>
                    <div className={styles.tableColumnNames}>
                        {tableColumns.map(col => {
                            if (col.hidden) return null;
                            return (
                                <p key={col.name}
                                    style={this.getColumnStyles(col, tableColumns)}
                                    className={clsx(styles.columnName, styles.ellipsis)}
                                >{col.label}</p>
                            )
                        })}
                    </div>
                    <div className={clsx(commonStyles.center, styles.headerSettings)}>
                        <Tooltip title="Configure columns">
                            <IconButton
                                onClick={this.toggleConfigureColumns}
                                ref={this.configureColumnsButtonRef}
                                disabled={!tableColumns?.length}
                            >
                                <SettingsIcon />
                            </IconButton>
                        </Tooltip>
                        <Popover
                            open={!!this.state?.configureColumnsOpen}
                            anchorEl={this.configureColumnsButtonRef.current}
                            onClose={this.toggleConfigureColumns}
                            classes={{ paper: styles.popoverPaper }}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            elevation={0}
                        >
                            <div className={styles.columnsConfigure}>
                                <DraggableList<TColumnConfigureItemData<TEntityType, TFilterType>>
                                    data={tableColumns.map(col => ({
                                        id: col.name,
                                        column: { ...col },
                                        sortedColumns: this.sortedColumns,
                                    })).sort((a, b) => (a.sortedColumns[a.column.name]?.order ?? 0)
                                        - (b.sortedColumns[b.column.name]?.order ?? 0))}
                                    onChange={this.changeColumnsOrder}
                                    component={ColumnConfigureItem}
                                />
                            </div>
                        </Popover>
                    </div>
                </div>
                <CList<TEntityType, TListItemProps<TEntityType, TFilterType>>
                    className={styles.listWrapper}
                    id={this.listId}
                    ListItem={EntityTableItem}
                    useAutoLoading
                    usePagination
                    listItemProps={{
                        handleDeleteBtnClick: this.handleDeleteBtnClick,
                        toggleSelection: this.handleToggleItemSelection,
                        tableProps: this.props,
                        getColumns: this.getColumns,
                        getColumnStyles: this.getColumnStyles,
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
                    open={!!this.state?.itemToDelete}
                    onClose={() => this.setState({ itemToDelete: null })}
                    onConfirm={this.handleDeleteItem}
                    title={`Delete ${this.props.entityLabel ?? 'item'} ${this.state?.itemToDelete?.[
                        this.props.nameProperty ?? 'id'] ?? ''}?`}
                />
                <ConfirmationModal
                    open={!!this.state?.deleteSelectedOpen}
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


type TColumnConfigureItemData<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter> = {
    id: string;
    column: TTableColumn;
    sortedColumns: EntityTable<TEntityType, TFilterType>['sortedColumns'];
}

const ColumnConfigureItem = <TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter>(props: {
    data: TColumnConfigureItemData<TEntityType, TFilterType>;
}) => {
    const data = props.data;
    const [hidden, setHidden] = useState(data.sortedColumns[data.column.name]?.hidden);
    const toggleVisibility = () => {
        setHidden(!hidden);
        if (!data.sortedColumns[data.column.name]) data.sortedColumns[data.column.name] = {
            name: data.column.name,
        };
        data.sortedColumns[data.column.name].hidden = !hidden;
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <p className={styles.ellipsis} style={{ minWidth: '20px' }}>{props.data.column.label}</p>
            <div className={commonStyles.center}>
                <Tooltip title={!hidden ? 'Visible' : 'Hidden'}>
                    <Checkbox
                        checked={!hidden}
                        onChange={toggleVisibility}
                    />
                </Tooltip>
            </div>
        </div>
    )
}