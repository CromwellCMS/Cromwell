import { TBaseFilter, TBasePageEntity, TCustomEntityColumn } from '@cromwell/core';
import { ChevronDownIcon, TableIcon, XIcon } from '@heroicons/react/24/outline';
import { Close as CloseIcon } from '@mui/icons-material';
import { Popover, Theme, Tooltip } from '@mui/material';
import { useTheme } from '@mui/styles';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { connect } from 'react-redux-ts';

import { useForceUpdate } from '../../../../helpers/forceUpdate';
import { toggleSelectAll } from '../../../../redux/helpers';
import { TAppState } from '../../../../redux/store';
import commonStyles from '../../../../styles/common.module.scss';
import { TextButton } from '../../../buttons/TextButton';
import { DraggableList } from '../../../draggableList/DraggableList';
import { CheckboxInput } from '../../../inputs/CheckboxInput';
import { TBaseEntityFilter, TListItemProps } from '../../types';
import { configuredColumnsKey } from '../EntityTable';
import styles from '../EntityTable.module.scss';
import { ColumnConfigureItem, TColumnConfigureItemData } from './ColumnConfigureItem';
import { SearchContent } from './SearchContent';

const mapStateToProps = (state: TAppState) => {
  return {
    allSelected: state.allSelected,
  };
};

type PropsType<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter> = TListItemProps<
  TEntityType,
  TFilterType
> &
  Partial<ReturnType<typeof mapStateToProps>>;

export type TGetAutocompleteValueFromSearch = (
  value: string | undefined | null | number | boolean | Date,
  column?: TCustomEntityColumn,
) =>
  | {
      value: string;
      label: string;
    }
  | {
      value: string;
      label: string;
    }[]
  | null;

export function TableHeader<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter>(
  props: PropsType<TEntityType, TFilterType>,
) {
  const { getColumnStyles, getColumns, searchStore, resetList, actionsWidth, loadConfiguredColumns, tableProps } =
    props;
  const tableColumns = getColumns();

  const currentSearchRef = useRef<string | number | boolean | Date>('');
  const configureColumnsButtonRef = useRef<HTMLDivElement>();
  const forceUpdate = useForceUpdate();
  const { allSelected }: ReturnType<typeof mapStateToProps> = useSelector(mapStateToProps);
  const [columnSearch, setColumnSearch] = useState<TCustomEntityColumn | null>(null);
  const [configureColumnsOpen, setConfigureColumnsOpen] = useState<boolean>(false);
  const theme = useTheme<Theme>();

  const getAutocompleteValueFromSearch: TGetAutocompleteValueFromSearch = (value, column) => {
    if (!column.searchOptions) return null;
    if (column?.multipleOptions && value && typeof value === 'string') {
      try {
        const searches = JSON.parse(value);
        if (Array.isArray(searches)) {
          return searches.map((search) => column.searchOptions.find((opt) => opt.value === search));
        }
      } catch (error) {
        console.error(error);
      }
    }
    return column.searchOptions.find((opt) => opt.value === value);
  };

  const handleToggleSelectAll = () => {
    toggleSelectAll();
  };

  const openColumnSearch = (column: TCustomEntityColumn) => {
    currentSearchRef.current = searchStore.filters?.find((filter) => filter.key === column?.name)?.value;
    setColumnSearch(column);
  };

  const closeColumnSearch = () => {
    if (!columnSearch) return;
    if (!searchStore.filters) searchStore.filters = [];
    const filters = searchStore.filters;

    let value = currentSearchRef.current;
    currentSearchRef.current = undefined;

    if (value === '') value = null;
    if (value === undefined) value = null;
    let hasChanged = false;

    const prevSearch = filters.find((filter) => filter.key === columnSearch.name);
    if (value === null && prevSearch?.value && prevSearch.value !== '') {
      searchStore.filters = filters.filter((filter) => filter.key !== columnSearch.name);
      hasChanged = true;
    }

    const getFilter = () => {
      const base: TBaseFilter['filters'][0] = {
        key: columnSearch.name,
        inMeta: columnSearch.meta,
        exact: columnSearch.exactSearch,
      };
      if (columnSearch.type === 'Date' || columnSearch.type === 'Datetime') {
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
    };

    if (value !== null) {
      if (prevSearch && prevSearch.value !== value) {
        searchStore.filters = searchStore.filters.map((filter) => {
          if (filter.key === columnSearch.name) {
            return getFilter();
          }
          return filter;
        });
        hasChanged = true;
      }

      if (!prevSearch) {
        searchStore.filters.push(getFilter());
        hasChanged = true;
      }
    }

    setColumnSearch(null);

    if (hasChanged) {
      resetList();
    }
  };

  const clearColumnSearch = (column: TCustomEntityColumn) => {
    currentSearchRef.current = undefined;
    if (searchStore.filters) {
      searchStore.filters = searchStore.filters.filter((filter) => filter.key !== column.name);
      forceUpdate();
      resetList();
    }
  };

  const toggleOrderBy = (column: TCustomEntityColumn) => {
    const store = searchStore;
    const sameColumn = store.sortBy?.column.name === column.name;
    store.sortBy = {
      column,
      sort: !sameColumn ? 'DESC' : store.sortBy.sort === 'DESC' ? 'ASC' : 'DESC',
    };
    forceUpdate();
    resetList();
  };

  const changeColumnsOrder = (columns: TColumnConfigureItemData[]) => {
    columns.forEach((item, idx) => {
      if (!searchStore.sortedColumns[item.column.name])
        searchStore.sortedColumns[item.column.name] = { name: item.column.name };
      searchStore.sortedColumns[item.column.name].order = idx;
    });
  };

  const saveConfiguredColumns = () => {
    const configuredColumns = loadConfiguredColumns();
    configuredColumns[tableProps.entityType ?? tableProps.entityCategory] = searchStore.sortedColumns;
    window.localStorage.setItem(configuredColumnsKey, JSON.stringify(configuredColumns));
  };

  const toggleConfigureColumns = () => {
    setConfigureColumnsOpen((prev) => {
      const isOpen = !prev;
      if (!isOpen) {
        resetList();
        saveConfiguredColumns();
        forceUpdate();
      }
      return isOpen;
    });
  };

  const resetConfiguredColumns = () => {
    const configuredColumns = loadConfiguredColumns();
    delete configuredColumns[tableProps.entityType ?? tableProps.entityCategory];
    window.localStorage.setItem(configuredColumnsKey, JSON.stringify(configuredColumns));
    searchStore.sortedColumns = {};
    toggleConfigureColumns();
  };

  const { filters, sortBy, sortedColumns } = searchStore;

  return (
    <div className={clsx(styles.tableHeader, 'shadow-lg shadow-white')}>
      <div className={commonStyles.center}>
        <Tooltip title="Select all">
          <CheckboxInput checked={allSelected ?? false} onChange={handleToggleSelectAll} />
        </Tooltip>
      </div>
      <div className={styles.tableColumnNames}>
        {tableColumns.map((col) => {
          if (!col.visible) return null;
          const columnFilter = filters?.find((filter) => filter.key === col.name);
          let searchQuery =
            columnFilter?.value !== null && columnFilter?.value !== undefined && columnFilter.value !== ''
              ? columnFilter.value
              : null;

          if (columnFilter?.from && columnFilter.to && (col.type === 'Date' || col.type === 'Datetime')) {
            searchQuery = `${new Date(columnFilter.from as string).toDateString()} - ${new Date(
              columnFilter.to as string,
            ).toDateString()}`;
          }

          if (col.searchOptions) {
            const autocompleteVal = getAutocompleteValueFromSearch(searchQuery, col);
            if (Array.isArray(autocompleteVal)) {
              searchQuery = autocompleteVal.map((val) => val.label).join(', ');
            } else if (autocompleteVal) {
              searchQuery = autocompleteVal.label;
            }
          }

          const isSortBy = sortBy?.column?.name === col.name;

          return (
            <div
              key={col.name}
              id={`column_${col.name}`}
              className={clsx(styles.columnName)}
              style={getColumnStyles(col, tableColumns)}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip
                  title={col.disableSearch ? '' : 'Open search for ' + col.label}
                  placement="top"
                  enterDelay={500}
                >
                  <p
                    onClick={col.disableSearch ? null : () => openColumnSearch(col)}
                    className={clsx(styles.ellipsis, styles.columnNameText)}
                    style={{
                      cursor: !col.disableSearch ? 'pointer' : 'initial',
                      color: isSortBy ? theme?.palette?.primary?.main || '#333' : '#333',
                    }}
                  >
                    {col.label}
                  </p>
                </Tooltip>
                {!col.disableSort && (
                  <Tooltip title="Toggle sort" placement="top" enterDelay={500}>
                    <div onClick={() => toggleOrderBy(col)} className={styles.orderButton}>
                      <ChevronDownIcon
                        className={'h-3 w-3 ml-1'}
                        style={{
                          transform: isSortBy && sortBy?.sort === 'ASC' ? 'rotate(180deg)' : undefined,
                          transition: '0.3s',
                          color: isSortBy ? theme?.palette?.primary?.main || '#333' : '#333',
                        }}
                      />
                    </div>
                  </Tooltip>
                )}
              </div>
              {searchQuery && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <p className={clsx(styles.searchQuery, styles.ellipsis)}>{String(searchQuery)}</p>
                  <Tooltip title="Clear search" enterDelay={500}>
                    <div onClick={() => clearColumnSearch(col)} style={{ cursor: 'pointer' }}>
                      <CloseIcon
                        style={{
                          fontSize: '14px',
                          color: '#555',
                        }}
                      />
                    </div>
                  </Tooltip>
                </div>
              )}
            </div>
          );
        })}
        <div
          className={clsx(commonStyles.center, styles.headerSettings)}
          style={{
            ...getColumnStyles({ name: 'actions', label: 'Actions' }, tableColumns),
            minWidth: actionsWidth + (tableProps.customActionsWidth || 0) + 'px',
          }}
        >
          <div
            className={`${open ? 'text-indigo-700' : ''} font-bold flex-none cursor-pointer text-xs`}
            onClick={toggleConfigureColumns}
            ref={configureColumnsButtonRef}
          >
            <TableIcon className="h-5 mr-1 bottom-[1.5px] w-5 relative inline" />
            <span className="rounded-lg bg-indigo-200 mr-1 px-1">
              {tableColumns.filter((col) => col.visible).length}
            </span>
            Columns
          </div>
          <Popover
            open={!!configureColumnsOpen}
            anchorEl={configureColumnsButtonRef.current}
            onClose={toggleConfigureColumns}
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
              <TextButton onClick={resetConfiguredColumns} style={{ margin: '10px 0 10px 10px' }}>
                Reset
              </TextButton>
              <DraggableList<TColumnConfigureItemData>
                data={tableColumns.map((col) => ({
                  id: col.name,
                  column: col,
                  sortedColumns: sortedColumns,
                }))}
                onChange={changeColumnsOrder}
                component={ColumnConfigureItem}
              />
            </div>
          </Popover>
          <Popover
            open={!!columnSearch}
            anchorEl={() => document.getElementById(`column_${columnSearch?.name}`)}
            onClose={closeColumnSearch}
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
            <div
              className={styles.columnSearch}
              style={{
                width: columnSearch?.type === 'Date' || columnSearch?.type === 'Datetime' ? '400px' : '300px',
              }}
            >
              <XIcon className="w-4 h-5 absolute top-1 right-1 cursor-pointer" onClick={closeColumnSearch} />
              <SearchContent
                getAutocompleteValueFromSearch={getAutocompleteValueFromSearch}
                currentSearchRef={currentSearchRef}
                columnSearch={columnSearch}
              />
            </div>
          </Popover>
        </div>
      </div>
    </div>
  );
}

export default connect(mapStateToProps)(TableHeader);
