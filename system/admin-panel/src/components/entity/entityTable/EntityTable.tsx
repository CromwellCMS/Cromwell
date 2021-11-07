import { gql } from '@apollo/client';
import { getBlockInstance, TBasePageEntity, TCustomEntityColumn, TPagedParams, TBaseFilter } from '@cromwell/core';
import { CList, TCList } from '@cromwell/core-frontend';
import { ArrowDropDown as ArrowDropDownIcon, Settings as SettingsIcon } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Checkbox, IconButton, Popover, TextField, Tooltip, Autocomplete } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { connect, PropsType } from 'react-redux-ts';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import queryString from 'query-string';

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
import { DraggableList } from '../../draggableList/DraggableList';
import ConfirmationModal from '../../modal/Confirmation';
import Pagination from '../../pagination/Pagination';
import { listPreloader } from '../../skeleton/SkeletonPreloader';
import { toast } from '../../toast/toast';
import { IEntityListPage, TBaseEntityFilter, TEntityPageProps } from '../types';
import { ColumnConfigureItem, TColumnConfigureItemData } from './components/ColumnConfigureItem';
import DeleteSelectedButton from './components/DeleteSelectedButton';
import EntityTableItem from './components/EntityTableItem';
import styles from './EntityTable.module.scss';
import ClearAllIcon from '@mui/icons-material/ClearAll';

const mapStateToProps = (state: TAppState) => {
    return {
        allSelected: state.allSelected,
    }
}

export type TEntityTableProps<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter>
    = PropsType<TAppState, TEntityPageProps<TEntityType, TFilterType>,
        ReturnType<typeof mapStateToProps>> & RouteComponentProps;

export type TListItemProps<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter> = {
    handleDeleteBtnClick: (item: TEntityType) => void;
    toggleSelection?: (item: TEntityType) => void;
    tableProps: TEntityTableProps<TEntityType, TFilterType>;
    getColumns: () => TCustomEntityColumn[];
    getColumnStyles: (column: TCustomEntityColumn, allColumns: TCustomEntityColumn[]) => React.CSSProperties;
}

export type TSavedConfiguredColumn = {
    name: string;
    order?: number;
    visible?: boolean;
}

class EntityTable<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter>
    extends React.Component<TEntityTableProps<TEntityType, TFilterType>, {
        isLoading: boolean;
        itemToDelete: TEntityType | null;
        deleteSelectedOpen: boolean;
        configureColumnsOpen: boolean;
        columnSearch?: TCustomEntityColumn | null;
    }> implements IEntityListPage<TFilterType> {

    private totalElements: number | null;
    private filterInput: TFilterType | undefined = {} as any;
    private listId: string;
    private configureColumnsButtonRef = React.createRef<HTMLButtonElement>();
    private configuredColumnsKey = 'crw_entity_table_columns';
    private currentSearch: string | undefined | null;

    public sortedColumns: Record<string, TSavedConfiguredColumn> = {};

    public sortBy: {
        column: TCustomEntityColumn;
        sort: 'ASC' | 'DESC';
    } | undefined;

    public filters?: TBaseFilter['filters'];

    constructor(props) {
        super(props);
        this.listId = `${this.props.entityCategory}_list`;

        const configuredColumns = this.loadConfiguredColumns();
        this.sortedColumns = configuredColumns[this.props.entityType ?? this.props.entityCategory] ?? {};

        const parsedUrl = queryString.parseUrl(window.location.href, { parseFragmentIdentifier: true });
        const tableFilter = parsedUrl.query?.tableFilter;
        if (typeof tableFilter === 'string' && tableFilter !== '') {
            try {
                this.filterInput = JSON.parse(atob(tableFilter));
                this.filters = this.filterInput?.filters;
            } catch (error) {
                console.error('Failed to parse base64 filter string in URL', error);
            }
        }

        this.props.getPageListInstance?.(this);
    }

    componentDidMount() {
        resetSelected();
    }

    componentWillUnmount() {
        resetSelected();
    }

    public resetList = () => {
        this.totalElements = null;
        const list = getBlockInstance<TCList>(this.listId)?.getContentInstance();
        list?.clearState();
        list?.init();
    }

    public updateList = () => {
        this.totalElements = null;
        const list = getBlockInstance<TCList>(this.listId)?.getContentInstance();
        list?.updateData();
    }

    public getFilterInput = () => this.filterInput;

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

    private handleDeleteSelectedClick = () => {
        if (countSelectedItems(this.totalElements) > 0)
            this.setState({ deleteSelectedOpen: true });
    }

    private handleCreate = () => {
        this.props.history.push(`${this.props.entityBaseRoute}/new`)
    }

    private getManyFilteredItems = async (params: TPagedParams<TEntityType>) => {
        if (!this.props.getManyFiltered) {
            console.error('this.props.getManyFiltered in not defined, you must provide getManyFiltered for list to be displayed');
            return;
        }

        if (!this.filterInput) this.filterInput = {} as any;

        const tableColumns = this.getColumns();
        if (this.props.entityType) {
            this.filterInput.entityType = this.props.entityType;
        }

        const entityProperties = [...new Set([
            'id',
            ...['slug', 'isEnabled', this.props.entityType && 'entityType', 'createDate', 'updateDate']
                .filter(prop => tableColumns.find(col => col.name === prop)?.visible),
            ...tableColumns.filter(col => !col.meta && col.visible).map(col => col.name),
        ])].filter(Boolean);
        const metaProperties = [...new Set([
            ...tableColumns.filter(col => col.meta && col.visible).map(col => col.name)
        ])].filter(Boolean);

        if (this.sortBy?.column) {
            this.filterInput.sorts = [{
                key: this.sortBy.column.name,
                inMeta: this.sortBy.column.meta,
                sort: this.sortBy.sort,
            }];
        } else if (!this.filterInput.sorts) {
            this.filterInput.sorts = [{
                key: 'id',
                sort: 'DESC',
            }];
        }

        if (this.filters) {
            this.filterInput.filters = this.filters.filter(filter => filter.key
                && filter.value && filter.value !== '');
        } else {
            this.filterInput.filters = [];
        }

        const data = (await this.props.getManyFiltered({
            pagedParams: params,
            customFragment: gql`
                fragment ${this.props.entityCategory}ListFragment on ${this.props.entityCategory} {
                    ${entityProperties.join('\n')}
                    customMeta(fields: ${JSON.stringify(metaProperties)})
                }
            `,
            customFragmentName: `${this.props.entityCategory}ListFragment`,
            filterParams: this.filterInput,
        }).catch(err => console.error(err))) || undefined;

        if (data?.pagedMeta?.totalElements) {
            this.totalElements = data.pagedMeta?.totalElements;
        }

        const parsedUrl = queryString.parseUrl(window.location.href, { parseFragmentIdentifier: true });
        parsedUrl.query.tableFilter = btoa(JSON.stringify(this.filterInput));
        window.history.replaceState({}, '', queryString.stringifyUrl(parsedUrl));

        return data;
    }

    private handleToggleItemSelection = (data: TEntityType) => {
        toggleItemSelection(data.id);
    }

    private handleToggleSelectAll = () => {
        toggleSelectAll()
    }

    private handleDeleteSelected = async () => {
        const input = getSelectedInput();
        if (!(input.all || input.ids?.length)) return;

        this.setState({ isLoading: true });
        this.totalElements = 0;
        try {
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

    public getColumns = (): TCustomEntityColumn[] => {
        const customFields = getCustomFieldsFor(this.props.entityType ?? this.props.entityCategory);
        return [
            ...(this.props.columns ?? []),
            ...customFields.map((field): TCustomEntityColumn => ({
                label: field.column?.label ?? field.label,
                name: field.key,
                meta: true,
                type: field.column?.type ?? field.fieldType,
                order: field.column?.order ?? field.order,
                visible: field.column?.visible,
            }))
        ].filter(col => col.type !== 'Text editor' && col.type !== 'Gallery')
            .map(col => ({
                ...col,
                visible: this.sortedColumns[col.name]?.visible ?? col.visible,
                order: this.sortedColumns[col.name]?.order ?? col.order,
            }))
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    public getColumnStyles = (column: TCustomEntityColumn, allColumns: TCustomEntityColumn[]): React.CSSProperties => {
        const normalWidth = 100 / allColumns.filter(col => col.visible).length + '%';
        const css: React.CSSProperties = {
            width: normalWidth,
            minWidth: '5px'
        }
        if (column.type === 'Image') {
            css.width = '90px';
            css.minWidth = '90px';
        }

        if (column.minWidth) css.minWidth = column.minWidth;
        if (column.maxWidth) css.maxWidth = column.maxWidth;
        if (column.width) css.width = column.width;

        return css;
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

    private changeColumnsOrder = (columns: (TColumnConfigureItemData)[]) => {
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

    private toggleOrderBy = (column: TCustomEntityColumn) => {
        const sameColumn = this.sortBy?.column.name === column.name;
        this.sortBy = {
            column,
            sort: !sameColumn ? 'DESC' : this.sortBy.sort === 'DESC' ? 'ASC' : 'DESC',
        }
        this.forceUpdate();
        this.resetList();
    }

    private openColumnSearch = (column: TCustomEntityColumn) => {
        this.currentSearch = this.filters?.find(filter => filter.key === column?.name)?.value;
        this.setState({ columnSearch: column });
    }

    private closeColumnSearch = () => {
        if (!this.state?.columnSearch) return;
        if (!this.filters) this.filters = [];
        let value = this.currentSearch;
        this.currentSearch = undefined;

        if (value === '') value = null;
        let hasChanged = false;

        const prevSearch = this.filters.find(filter => filter.key === this.state.columnSearch.name);
        if (!value && prevSearch?.value && prevSearch.value !== '') {
            this.filters = this.filters.filter(filter => filter.key !== this.state.columnSearch.name);
            hasChanged = true;
        }

        if (value) {
            if (prevSearch && prevSearch.value !== value) {
                this.filters = this.filters.map(filter => {
                    if (filter.key === this.state.columnSearch.name) {
                        return {
                            ...filter,
                            value
                        }
                    }
                    return filter;
                });
                hasChanged = true;
            }

            if (!prevSearch) {
                this.filters.push({
                    key: this.state.columnSearch.name,
                    inMeta: this.state.columnSearch.meta,
                    exact: this.state.columnSearch.exactSearch,
                    value: value,
                });
                hasChanged = true;
            }
        }

        this.setState({ columnSearch: null });
        if (hasChanged) {
            this.resetList();
        }
    }

    private clearColumnSearch = (column: TCustomEntityColumn) => {
        this.currentSearch = undefined;
        if (this.filters) {
            this.filters = this.filters.filter(filter => filter.key !== column.name);
            this.forceUpdate();
            this.resetList();
        }
    }

    public clearAllFilters = () => {
        this.props.onClearAllFilters?.();
        this.sortBy = undefined;
        this.filters = [];
        this.filterInput = undefined;
        this.forceUpdate();
        this.resetList();
    }

    render() {
        const tableColumns = this.getColumns();
        return (
            <div className={styles.EntityTable}>
                <div className={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <h1 className={styles.pageTitle}>{this.props.listLabel}</h1>
                        {this.props.customElements?.listLeftActions}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {this.props.customElements?.listRightActions}
                        {!!(this.filters?.length || this.filterInput?.filters?.length
                            || this.sortBy?.column || this.props.isFilterActive?.()) && (
                                <Tooltip title="Clear filters">
                                    <IconButton onClick={this.clearAllFilters}>
                                        <ClearAllIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                        <DeleteSelectedButton
                            style={{ marginRight: '10px' }}
                            onClick={this.handleDeleteSelectedClick}
                            totalElements={this.totalElements}
                        />
                        <Button variant="contained"
                            size="small"
                            onClick={this.handleCreate}
                        >Add new</Button>
                    </div>
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
                            if (!col.visible) return null;
                            const columnFilter = this.filters?.find(filter => filter.key === col.name);
                            const searchQuery = columnFilter?.value && columnFilter.value !== '' ? columnFilter.value : null;
                            return (
                                <div key={col.name}
                                    id={`column_${col.name}`}
                                    className={clsx(styles.columnName)}
                                    style={this.getColumnStyles(col, tableColumns)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Tooltip title="Open search" placement="top" enterDelay={500}>
                                            <p onClick={() => this.openColumnSearch(col)}
                                                className={clsx(styles.ellipsis, styles.columnNameText)}>{col.label}</p>
                                        </Tooltip>
                                        <Tooltip title="Toggle sort" placement="top" enterDelay={500}>
                                            <div onClick={() => this.toggleOrderBy(col)}
                                                className={styles.orderButton}>
                                                <ArrowDropDownIcon
                                                    style={{
                                                        transform: this.sortBy?.column?.name === col.name
                                                            && this.sortBy?.sort === 'ASC' ? 'rotate(180deg)' : undefined,
                                                        transition: '0.3s',
                                                        color: this.sortBy?.column?.name !== col.name ? '#aaa' : undefined,
                                                        fontSize: this.sortBy?.column?.name === col.name ? '26px' : undefined,
                                                    }}
                                                />
                                            </div>
                                        </Tooltip>
                                    </div>
                                    {searchQuery && (
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <p className={clsx(styles.searchQuery, styles.ellipsis)}>{searchQuery}</p>
                                            <Tooltip title="Clear search" enterDelay={500}>
                                                <div onClick={() => this.clearColumnSearch(col)}
                                                    style={{ cursor: 'pointer' }}>
                                                    <CloseIcon style={{
                                                        fontSize: '14px',
                                                        color: '#555'
                                                    }} />
                                                </div>
                                            </Tooltip>
                                        </div>
                                    )}
                                </div>
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
                                <DraggableList<TColumnConfigureItemData>
                                    data={tableColumns.map(col => ({
                                        id: col.name,
                                        column: col,
                                        sortedColumns: this.sortedColumns,
                                    }))}
                                    onChange={this.changeColumnsOrder}
                                    component={ColumnConfigureItem}
                                />
                            </div>
                        </Popover>
                        <Popover
                            open={!!this.state?.columnSearch}
                            anchorEl={() => document.getElementById(`column_${this.state?.columnSearch?.name}`)}
                            onClose={this.closeColumnSearch}
                            classes={{ paper: styles.popoverPaper }}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            elevation={0}
                        >
                            <div className={styles.columnsConfigure}
                                style={{ padding: '10px 15px' }}>
                                {this.state?.columnSearch?.searchOptions ? (
                                    <Autocomplete
                                        options={this.state.columnSearch.searchOptions}
                                        getOptionLabel={(option) => option?.label ?? ''}
                                        defaultValue={this.state.columnSearch.searchOptions.find(opt =>
                                            opt.key === this.currentSearch)}
                                        className={styles.filterItem}
                                        onChange={(event, newVal) =>
                                            this.currentSearch = typeof newVal === 'object' ? newVal?.key : newVal}
                                        renderInput={(params) => <TextField
                                            {...params}
                                            variant="standard"
                                            fullWidth
                                            label={`Search ${this.state?.columnSearch?.label ?? ''}`}
                                        />}
                                    />
                                ) : (
                                    <TextField
                                        fullWidth
                                        onChange={(event) => this.currentSearch = event.target.value}
                                        variant="standard"
                                        label={`Search ${this.state?.columnSearch?.label ?? ''}`}
                                        defaultValue={this.currentSearch}
                                    />
                                )}
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
            </div >
        )
    }
}

export default connect(mapStateToProps)(withRouter(EntityTable));
