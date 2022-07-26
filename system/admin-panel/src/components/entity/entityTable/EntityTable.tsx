import { gql } from '@apollo/client';
import { getBlockInstance, TBaseFilter, TBasePageEntity, TCustomEntityColumn, TPagedParams } from '@cromwell/core';
import { CList, TCList } from '@cromwell/core-frontend';
import { ChevronDownIcon, TableIcon, XIcon } from '@heroicons/react/outline';
import { Close as CloseIcon } from '@mui/icons-material';
import { Popover, Theme, Tooltip } from '@mui/material';
import { withStyles } from '@mui/styles';
import clsx from 'clsx';
import queryString from 'query-string';
import React from 'react';
import { connect, PropsType } from 'react-redux-ts';
import { RouteComponentProps, withRouter } from 'react-router-dom';

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
import { IconButton } from '../../buttons/IconButton';
import { TextButton } from '../../buttons/TextButton';
import { Datepicker } from '../../inputs/DateInput';
import { DraggableList } from '../../draggableList/DraggableList';
import { Autocomplete } from '../../inputs/AutocompleteInput';
import { CheckboxInput } from '../../inputs/CheckboxInput';
import { TextInputField } from '../../inputs/TextInput';
import { ClearFilterIcon } from '../../icons/clearFilter';
import { askConfirmation } from '../../modal/Confirmation';
import Pagination from '../../pagination/Pagination';
import { listPreloader } from '../../skeleton/SkeletonPreloader';
import { toast } from '../../toast/toast';
import { IEntityListPage, TBaseEntityFilter, TEntityPageProps } from '../types';
import { ColumnConfigureItem, TColumnConfigureItemData } from './components/ColumnConfigureItem';
import DeleteSelectedButton from './components/DeleteSelectedButton';
import EntityTableItem from './components/EntityTableItem';
import styles from './EntityTable.module.scss';


const mapStateToProps = (state: TAppState) => {
  return {
    allSelected: state.allSelected,
  }
}

export type TEntityTableProps<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter>
  = PropsType<TAppState, TEntityPageProps<TEntityType, TFilterType>,
    ReturnType<typeof mapStateToProps>> & RouteComponentProps & { theme?: Theme };

export type TListItemProps<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter> = {
  handleDeleteBtnClick: (item: TEntityType) => void;
  toggleSelection?: (item: TEntityType) => void;
  tableProps: TEntityTableProps<TEntityType, TFilterType>;
  getColumns: () => TCustomEntityColumn[];
  getColumnStyles: (column: TCustomEntityColumn, allColumns: TCustomEntityColumn[]) => React.CSSProperties;
  actionsWidth: number;
}

export type TSavedConfiguredColumn = {
  name: string;
  order?: number;
  visible?: boolean;
}

class EntityTable<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter>
  extends React.Component<TEntityTableProps<TEntityType, TFilterType>, {
    isLoading: boolean;
    deleteSelectedOpen: boolean;
    configureColumnsOpen: boolean;
    columnSearch?: TCustomEntityColumn | null;
  }> implements IEntityListPage<TFilterType> {

  private totalElements: number | null;
  // private filterInput: TFilterType | undefined = {} as any;
  private listId: string;
  private configureColumnsButtonRef = React.createRef<HTMLDivElement>();
  private configuredColumnsKey = 'crw_entity_table_columns';
  private currentSearch: string | undefined | null | number | boolean | Date;
  private actionsWidth = 64;

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
    const tableFilter = parsedUrl.query?.filter;
    if (typeof tableFilter === 'string' && tableFilter !== '') {
      try {
        const filterInput: TFilterType | undefined = JSON.parse(atob(tableFilter));
        this.filters = filterInput?.filters;
        this.sortBy = {
          column: {
            name: filterInput?.sorts?.[0]?.key,
            meta: filterInput?.sorts?.[0]?.inMeta,
            label: '',
          },
          sort: filterInput?.sorts?.[0].sort,
        }
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

  private handleDeleteItem = async (itemToDelete: TEntityType) => {
    const confirm = await askConfirmation({
      title: `Delete ${(this.props.entityLabel ?? 'item').toLocaleLowerCase()} ${itemToDelete?.[
        this.props.nameProperty ?? 'id'] ?? ''}?`
    });
    if (!confirm) return;
    if (!itemToDelete?.id) return;

    try {
      await this.props.deleteOne(itemToDelete.id)
      toast.success(`${this.props.entityLabel ?? 'Item'} deleted`);
    } catch (e) {
      console.error(e);
      toast.error(`Failed to delete ${this.props.entityLabel?.toLowerCase() ?? 'item'}`);
    }
    this.updateList();
  }

  private handleToggleItemSelection = (data: TEntityType) => {
    toggleItemSelection(data.id);
  }

  private handleToggleSelectAll = () => {
    toggleSelectAll()
  }

  private handleDeleteSelected = async () => {
    if (countSelectedItems(this.totalElements) <= 0) return;
    const confirm = await askConfirmation({
      title: `Delete ${countSelectedItems(this.totalElements)} item(s)?`
    });
    if (!confirm) return;

    const input = getSelectedInput();
    if (!(input.all || input.ids?.length)) return;
    const filterInput = this.getFilterInput();

    this.setState({ isLoading: true });
    this.totalElements = 0;
    try {
      await this.props.deleteMany(input, filterInput);
      toast.success(`${this.props.entityLabel ?? 'Items'} deleted`);
    } catch (e) {
      console.error(e);
      toast.error(`Failed to delete ${this.props.entityLabel ?? 'items'}`);
    }
    resetSelected();
    this.updateList();
    this.setState({ isLoading: false, deleteSelectedOpen: false });
  }

  private handleCreate = () => {
    this.props.history.push(`${this.props.entityBaseRoute}/new`)
  }

  public getFilterInput = (tableColumns?: TCustomEntityColumn[]): TFilterType => {
    let filterInput: TFilterType = {} as any;

    if (!tableColumns) tableColumns = this.getColumns();
    if (!this.filters) this.filters = [];

    if (this.props.entityType) {
      filterInput.entityType = this.props.entityType;
    }

    if (this.sortBy?.column) {
      filterInput.sorts = [{
        key: this.sortBy.column.name,
        inMeta: this.sortBy.column.meta,
        sort: this.sortBy.sort,
      }];
    } else if (!filterInput.sorts) {
      filterInput.sorts = [{
        key: 'id',
        sort: 'DESC',
      }];
    }

    if (this.filters) {
      filterInput.filters = this.filters.filter(filter => {
        if (!filter.key) return false;
        const col = tableColumns.find(col => col.name === filter.key);
        if (col.applyFilter) return false;
        return true;
      });
    } else {
      filterInput.filters = [];
    }

    for (const col of tableColumns) {
      if (col.applyFilter) {
        const value = this.filters.find(filter => filter.key === col.name);
        filterInput = col.applyFilter(value?.value, filterInput);
      }
    }

    return filterInput;
  }

  private getManyFilteredItems = async (params: TPagedParams<TEntityType>) => {
    if (!this.props.getMany) {
      console.error('this.props.getMany in not defined, you must provide getMany for list to be displayed');
      return;
    }
    const tableColumns = this.getColumns();
    const filterInput = this.getFilterInput(tableColumns);

    const entityProperties = [...new Set([
      'id',
      ...['slug', 'isEnabled', this.props.entityType && 'entityType', 'createDate', 'updateDate']
        .filter(prop => tableColumns.find(col => col.name === prop)?.visible),
      ...tableColumns.filter(col => !col.meta && col.visible && !col.customGraphQlFragment).map(col => col.name),
    ])].filter(Boolean);

    const metaProperties = [...new Set([
      ...tableColumns.filter(col => col.meta && col.visible && !col.customGraphQlFragment).map(col => col.name)
    ])].filter(Boolean);

    const customFragments = tableColumns.filter(col => col.visible && col.customGraphQlFragment)
      .map(col => col.customGraphQlFragment);

    const data = (await this.props.getMany({
      pagedParams: params,
      customFragment: gql`
                fragment ${this.props.entityCategory}ListFragment on ${this.props.entityCategory} {
                    ${customFragments.join('\n')}
                    ${entityProperties.join('\n')}

                    ${metaProperties?.length ? `customMeta(keys: ${JSON.stringify(metaProperties)})` : ''}
                }
            `,
      customFragmentName: `${this.props.entityCategory}ListFragment`,
      filterParams: filterInput,
    }).catch(err => console.error(err))) || undefined;

    if (data?.pagedMeta?.totalElements) {
      this.totalElements = data.pagedMeta?.totalElements;
    }

    const parsedUrl = queryString.parseUrl(window.location.href, { parseFragmentIdentifier: true });
    parsedUrl.query.filter = btoa(JSON.stringify(filterInput));
    window.history.replaceState({}, '', queryString.stringifyUrl(parsedUrl));

    return data;
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

  public getColumnStyles = (column: TCustomEntityColumn, allColumns?: TCustomEntityColumn[]): React.CSSProperties => {
    if (!allColumns?.length) return {};
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

  private resetConfiguredColumns = () => {
    const configuredColumns = this.loadConfiguredColumns();
    delete configuredColumns[this.props.entityType ?? this.props.entityCategory];
    window.localStorage.setItem(this.configuredColumnsKey, JSON.stringify(configuredColumns));
    this.sortedColumns = {};
    this.toggleConfigureColumns();
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
    if (value === undefined) value = null;
    let hasChanged = false;

    const prevSearch = this.filters.find(filter => filter.key === this.state.columnSearch.name);
    if (value === null && prevSearch?.value && prevSearch.value !== '') {
      this.filters = this.filters.filter(filter => filter.key !== this.state.columnSearch.name);
      hasChanged = true;
    }

    const getFilter = () => {
      const base: TBaseFilter['filters'][0] = {
        key: this.state.columnSearch.name,
        inMeta: this.state.columnSearch.meta,
        exact: this.state.columnSearch.exactSearch,
      }
      if (this.state.columnSearch.type === 'Date' || this.state.columnSearch.type === 'Datetime') {
        const range: [Date, Date] = JSON.parse((value || '[]') as string);
        const from = range[0] ? new Date(range[0]) : new Date();
        const to = range[1] ? new Date(range[1]) : new Date();
        from.setHours(0);
        from.setMinutes(0);
        to.setHours(23);
        to.setMinutes(59);
        base.from = from;
        base.to = to;
      } else {
        base.value = value;
      }
      return base;
    }

    if (value !== null) {
      if (prevSearch && prevSearch.value !== value) {
        this.filters = this.filters.map(filter => {
          if (filter.key === this.state.columnSearch.name) {
            return getFilter();
          }
          return filter;
        });
        hasChanged = true;
      }

      if (!prevSearch) {
        this.filters.push(getFilter());
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
    this.forceUpdate();
    this.resetList();
  }

  private getAutocompleteValueFromSearch = (value: string | undefined | null | number | boolean | Date,
    column?: TCustomEntityColumn): {
      value: string;
      label: string;
    } | {
      value: string;
      label: string;
    }[] | null => {
    if (!column.searchOptions) return null;
    if (column?.multipleOptions && value && typeof value === 'string') {
      try {
        const searches = JSON.parse(value);
        if (Array.isArray(searches)) {
          return searches.map(search =>
            column.searchOptions.find(opt =>
              opt.value === search)
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
    return column.searchOptions.find(opt =>
      opt.value === value);
  }

  private getSearchContent = () => {
    if (this.state?.columnSearch?.searchOptions) {
      // Select
      return (
        <Autocomplete
          multiple={this.state.columnSearch.multipleOptions}
          options={this.state.columnSearch.searchOptions}
          inlineOptions
          paperStyle={{
            // marginLeft: '-15px',
            // marginRight: '-15px',
            // width: 'calc(100% + 30px)',
          }}
          getOptionLabel={(option: any) => option?.label ?? ''}
          defaultValue={this.getAutocompleteValueFromSearch(this.currentSearch,
            this.state.columnSearch)}
          className={styles.filterItem}
          onChange={(event, newVal) => {
            if (Array.isArray(newVal)) newVal = JSON.stringify(newVal.map(val => typeof val === 'object' ? val?.value : val));
            this.currentSearch = typeof newVal === 'object' ? newVal?.value : newVal
          }}
          classes={{ popper: styles.autocompletePopper }}
          label={`Search ${this.state?.columnSearch?.label ?? ''}`}
        />
      );
    }

    if (this.state?.columnSearch?.type === 'Date' || this.state?.columnSearch?.type === 'Datetime') {
      // Datepicker range
      return (
        <Datepicker
          defaultValue={JSON.parse(String(this.currentSearch || '[]'))}
          onChange={(value) => this.currentSearch = JSON.stringify(value)}
          range
        />
      );
    }

    return (
      <TextInputField
        onChange={(event) => this.currentSearch = event.target.value}
        label={`Search ${this.state?.columnSearch?.label ?? ''}`}
        defaultValue={this.currentSearch as string}
      />
    )
  }

  render() {
    const tableColumns = this.getColumns();
    return (
      <div className={styles.EntityTable}>
        <div className={styles.pageHeader}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 className={styles.pageTitle}>{this.props.listLabel}</h1>
            {this.props.customElements?.listLeftActions}
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {this.props.customElements?.listRightActions}
            {!!(this.filters?.length || this.sortBy?.column
              || this.props.isFilterActive?.()) && (
                <Tooltip title="Clear filters">
                  <span>
                    <IconButton className={clsx(styles.iconButton)}
                      onClick={this.clearAllFilters}
                    ><ClearFilterIcon className="w-5 h-5" />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            <DeleteSelectedButton
              style={{ marginRight: '10px' }}
              onClick={this.handleDeleteSelected}
              totalElements={this.totalElements}
            />
            {this.props.entityBaseRoute && !this.props.hideAddNew && (
              <TextButton
                onClick={this.handleCreate}
              >Add new</TextButton>
            )}
          </div>
        </div>
        <div className={styles.table}>
          <div className={clsx(styles.tableHeader, 'shadow-lg shadow-white')}>
            <div className={commonStyles.center}>
              <Tooltip title="Select all">
                <CheckboxInput
                  checked={this.props.allSelected ?? false}
                  onChange={this.handleToggleSelectAll}
                />
              </Tooltip>
            </div>
            <div className={styles.tableColumnNames}>
              {tableColumns.map(col => {
                if (!col.visible) return null;
                const columnFilter = this.filters?.find(filter => filter.key === col.name);
                let searchQuery = columnFilter?.value !== null && columnFilter?.value !== undefined &&
                  columnFilter.value !== '' ? columnFilter.value : null;

                if (columnFilter?.from && columnFilter.to && (col.type === 'Date' || col.type === 'Datetime')) {
                  searchQuery = `${new Date(columnFilter.from as string).toDateString()
                    } - ${new Date(columnFilter.to as string).toDateString()}`;
                }

                if (col.searchOptions) {
                  const autocompleteVal = this.getAutocompleteValueFromSearch(searchQuery, col);
                  if (Array.isArray(autocompleteVal)) {
                    searchQuery = autocompleteVal.map(val => val.label).join(', ');
                  } else if (autocompleteVal) {
                    searchQuery = autocompleteVal.label;
                  }
                }

                const isSortBy = this.sortBy?.column?.name === col.name;

                return (
                  <div key={col.name}
                    id={`column_${col.name}`}
                    className={clsx(styles.columnName)}
                    style={this.getColumnStyles(col, tableColumns)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Tooltip title={col.disableSearch ? '' : 'Open search for ' + col.label} placement="top" enterDelay={500}>
                        <p onClick={col.disableSearch ? null : () => this.openColumnSearch(col)}
                          className={clsx(styles.ellipsis, styles.columnNameText)}
                          style={{
                            cursor: !col.disableSearch ? 'pointer' : 'initial',
                            color: isSortBy ? this.props.theme?.palette?.primary?.main || '#333' : '#333',
                          }}
                        >{col.label}</p>
                      </Tooltip>
                      {!col.disableSort && (
                        <Tooltip title="Toggle sort" placement="top" enterDelay={500}>
                          <div onClick={() => this.toggleOrderBy(col)}
                            className={styles.orderButton}>
                            <ChevronDownIcon
                              className={"h-3 w-3 ml-1"}
                              style={{
                                transform: isSortBy && this.sortBy?.sort === 'ASC' ? 'rotate(180deg)' : undefined,
                                transition: '0.3s',
                                color: isSortBy ? this.props.theme?.palette?.primary?.main || '#333' : '#333',
                              }}
                            />
                          </div>
                        </Tooltip>
                      )}
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
              <div className={clsx(commonStyles.center, styles.headerSettings)}
                style={{
                  ...this.getColumnStyles({ name: 'actions', label: 'Actions' }, tableColumns),
                  minWidth: this.actionsWidth + (this.props.customActionsWidth || 0) + 'px'
                }}>
                <div className={`${open ? "text-indigo-700" : ""} font-bold flex-none cursor-pointer text-xs`}
                  onClick={this.toggleConfigureColumns}
                  ref={this.configureColumnsButtonRef}
                >
                  <TableIcon className="h-5 mr-1 bottom-[1.5px] w-5 relative inline" />
                  <span className="rounded-lg bg-indigo-200 mr-1 px-1">
                    {tableColumns.filter(col => col.visible).length}
                  </span>
                  Columns
                </div>
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
                    <TextButton
                      onClick={this.resetConfiguredColumns}
                      style={{ margin: '10px 0 10px 10px' }}
                    >Reset</TextButton>
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
                  <div className={styles.columnSearch}>
                    <XIcon className="w-4 h-5 absolute top-1 right-1 cursor-pointer" onClick={this.closeColumnSearch} />
                    {this.getSearchContent()}
                  </div>
                </Popover>
              </div>
            </div>
          </div>
          <CList<TEntityType, TListItemProps<TEntityType, TFilterType>>
            className={styles.listWrapper}
            id={this.listId}
            ListItem={EntityTableItem}
            useAutoLoading
            usePagination
            listItemProps={{
              handleDeleteBtnClick: this.handleDeleteItem,
              toggleSelection: this.handleToggleItemSelection,
              tableProps: this.props,
              getColumns: this.getColumns,
              getColumnStyles: this.getColumnStyles,
              actionsWidth: this.actionsWidth,
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
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(withStyles({}, { withTheme: true })(withRouter(EntityTable)));
