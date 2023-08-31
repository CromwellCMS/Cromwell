import { gql } from '@apollo/client';
import {
  getBlockInstance,
  TBasePageEntity,
  TCustomEntityColumn,
  TCustomGraphQlProperty,
  TPagedParams,
} from '@cromwell/core';
import { CList, Lightbox, TCList } from '@cromwell/core-frontend';
import queryString from 'query-string';
import React from 'react';

import { getCustomFieldsFor } from '../../../helpers/customFields';
import { countSelectedItems, getSelectedInput, resetSelected, toggleItemSelection } from '../../../redux/helpers';
import { askConfirmation } from '../../modal/Confirmation';
import Pagination from '../../pagination/Pagination';
import { listPreloader } from '../../skeleton/SkeletonPreloader';
import { toast } from '../../toast/toast';
import { IEntityListPage, TBaseEntityFilter, TEntityPageProps, TListItemProps, TSearchStore } from '../types';
import { customGraphQlPropertyToFragment } from '../utils';
import EntityTableItem from './components/EntityTableItem';
import { PageHeader } from './components/PageHeader';
import { TableHeader } from './components/TableHeader';
import styles from './EntityTable.module.scss';

export const configuredColumnsKey = 'crw_entity_table_columns';

class EntityTable<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter>
  extends React.Component<
    TEntityPageProps<TEntityType, TFilterType>,
    {
      isLoading: boolean;
      deleteSelectedOpen: boolean;
      configureColumnsOpen: boolean;
      columnSearch?: TCustomEntityColumn | null;
    }
  >
  implements IEntityListPage<TEntityType, TFilterType>
{
  private totalElements: number | null;
  private listId: string;
  private actionsWidth = 64;
  private setLightbox?: (open: boolean, index: number, images: string[]) => void;

  private searchStore: TSearchStore = {};

  constructor(props) {
    super(props);
    this.listId = `${this.props.entityCategory}_list`;

    const configuredColumns = this.loadConfiguredColumns();
    this.searchStore.sortedColumns = configuredColumns[this.props.entityType ?? this.props.entityCategory] ?? {};

    const parsedUrl = queryString.parseUrl(window.location.href, { parseFragmentIdentifier: true });
    const tableFilter = parsedUrl.query?.filter;
    if (typeof tableFilter === 'string' && tableFilter !== '') {
      try {
        const store = JSON.parse(atob(tableFilter));
        this.searchStore.filters = store.filters;
        this.searchStore.sortBy = store.sortBy;
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
  };

  public updateList = () => {
    this.totalElements = null;
    const list = getBlockInstance<TCList>(this.listId)?.getContentInstance();
    list?.updateData();
  };

  public handleDeleteItem = async (itemToDelete: TEntityType): Promise<boolean> => {
    const confirm = await askConfirmation({
      title: `Delete ${(this.props.entityLabel ?? 'item').toLocaleLowerCase()} ${
        itemToDelete?.[this.props.nameProperty ?? 'id'] ?? ''
      }?`,
    });
    if (!confirm) return false;
    if (!itemToDelete?.id) return false;

    try {
      await this.props.deleteOne!(itemToDelete.id);
      toast.success(`${this.props.entityLabel ?? 'Item'} deleted`);
    } catch (e) {
      console.error(e);
      toast.error(`Failed to delete ${this.props.entityLabel?.toLowerCase() ?? 'item'}`);
    }
    this.updateList();
    return true;
  };

  private handleToggleItemSelection = (data: TEntityType) => {
    toggleItemSelection(data.id);
  };

  private handleDeleteSelected = async () => {
    if (countSelectedItems(this.totalElements) <= 0) return;
    const confirm = await askConfirmation({
      title: `Delete ${countSelectedItems(this.totalElements)} item(s)?`,
    });
    if (!confirm) return;

    const input = getSelectedInput();
    if (!(input.all || input.ids?.length)) return;
    const filterInput = this.getFilterInput();

    this.setState({ isLoading: true });
    this.totalElements = 0;
    try {
      await this.props.deleteMany!(input, filterInput);
      toast.success(`${this.props.entityLabel ?? 'Items'} deleted`);
    } catch (e) {
      console.error(e);
      toast.error(`Failed to delete ${this.props.entityLabel ?? 'items'}`);
    }
    resetSelected();
    this.updateList();
    this.setState({ isLoading: false, deleteSelectedOpen: false });
  };

  public getFilterInput = (tableColumns?: TCustomEntityColumn[]): TFilterType => {
    let filterInput: TFilterType = {} as any;
    const store = this.searchStore;

    if (!tableColumns) tableColumns = this.getColumns();
    if (!store.filters) store.filters = [];

    if (this.props.entityType) {
      filterInput.entityType = this.props.entityType;
    }

    if (store.sortBy?.column) {
      filterInput.sorts = [
        {
          key: store.sortBy.column.name,
          inMeta: store.sortBy.column.meta,
          sort: store.sortBy.sort,
        },
      ];
    } else if (!filterInput.sorts) {
      filterInput.sorts = [
        {
          key: 'id',
          sort: 'DESC',
        },
      ];
    }

    if (store.filters) {
      filterInput.filters = store.filters.filter((filter) => {
        if (!filter.key) return false;
        const col = tableColumns?.find((col) => col.name === filter.key);
        if (col?.applyFilter) return false;
        return true;
      });
    } else {
      filterInput.filters = [];
    }

    for (const col of tableColumns) {
      if (col.applyFilter) {
        const value = store.filters.find((filter) => filter.key === col.name);
        filterInput = col.applyFilter(value?.value, filterInput);
      }
    }

    return filterInput;
  };

  private getManyFilteredItems = async (params: TPagedParams<TEntityType>) => {
    if (!this.props.getMany) {
      console.error('this.props.getMany in not defined, you must provide getMany for list to be displayed');
      return;
    }
    const tableColumns = this.getColumns();
    const filterInput = this.getFilterInput(tableColumns);

    const entityProperties = [
      ...new Set([
        'id',
        ...['slug', 'isEnabled', this.props.entityType && 'entityType', 'createDate', 'updateDate'].filter(
          (prop) => tableColumns.find((col) => col.name === prop)?.visible,
        ),
        ...tableColumns
          .filter((col) => !col.meta && col.visible && !col.customGraphQlFragment && !col.customGraphQlProperty)
          .map((col) => col.name),
      ]),
    ].filter(Boolean);

    const metaProperties = [
      ...new Set([
        ...tableColumns
          .filter((col) => col.meta && col.visible && !col.customGraphQlFragment && !col.customGraphQlProperty)
          .map((col) => col.name),
      ]),
    ].filter(Boolean);

    const customFragments = tableColumns
      .filter((col) => col.visible && col.customGraphQlFragment)
      .map((col) => col.customGraphQlFragment);

    const customProperties = customGraphQlPropertyToFragment(
      tableColumns.map((c) => c.customGraphQlProperty).filter(Boolean) as TCustomGraphQlProperty[],
    );

    const data =
      (await this.props
        .getMany({
          pagedParams: params,
          customFragment: gql`
        fragment ${this.props.entityCategory}ListFragment on ${this.props.entityCategory} {
          ${customFragments.join('\n')}
          ${entityProperties.join('\n')}
          ${customProperties}
          ${metaProperties?.length ? `customMeta(keys: ${JSON.stringify(metaProperties)})` : ''}
        }
      `,
          customFragmentName: `${this.props.entityCategory}ListFragment`,
          filterParams: filterInput,
        })
        .catch((err) => console.error(err))) || undefined;

    if (data?.pagedMeta?.totalElements) {
      this.totalElements = data.pagedMeta?.totalElements;
    }

    const query = { filters: this.searchStore.filters, sortBy: this.searchStore.sortBy };
    if (!query.sortBy) delete query.sortBy;
    if (!query.filters?.length) delete query.filters;
    const parsedUrl = queryString.parseUrl(window.location.href, { parseFragmentIdentifier: true });

    if (Object.keys(query).length) {
      parsedUrl.query.filter = btoa(JSON.stringify(query));
    } else delete parsedUrl.query.filter;
    window.history.replaceState({}, '', queryString.stringifyUrl(parsedUrl));

    return data;
  };

  public getColumns = (): TCustomEntityColumn[] => {
    const customFields = getCustomFieldsFor(this.props.entityType ?? this.props.entityCategory);
    const store = this.searchStore;
    return [
      ...(this.props.columns ?? []),
      ...customFields.map(
        (field): TCustomEntityColumn => ({
          label: field.column?.label || field.label || '',
          name: field.key,
          meta: true,
          type: field.column?.type ?? field.fieldType,
          order: field.column?.order ?? field.order,
          visible: field.column?.visible,
        }),
      ),
    ]
      .filter((col) => col.type !== 'Text editor' && col.type !== 'Gallery')
      .map((col) => ({
        ...col,
        visible: store.sortedColumns?.[col.name]?.visible ?? col.visible ?? false,
        order: store.sortedColumns?.[col.name]?.order ?? col.order,
      }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  };

  public getColumnStyles = (column: TCustomEntityColumn, allColumns?: TCustomEntityColumn[]): React.CSSProperties => {
    if (!allColumns?.length) return {};
    const normalWidth = 100 / allColumns.filter((col) => col.visible).length + '%';
    const css: React.CSSProperties = {
      width: normalWidth,
      minWidth: '5px',
    };
    if (column.type === 'Image') {
      css.width = '90px';
      css.minWidth = '90px';
    }

    if (column.minWidth) css.minWidth = column.minWidth;
    if (column.maxWidth) css.maxWidth = column.maxWidth;
    if (column.width) css.width = column.width;

    return css;
  };

  private loadConfiguredColumns = () => {
    let configuredColumns: Record<string, TSearchStore['sortedColumns']> = {};
    const prevData = window.localStorage.getItem(configuredColumnsKey);
    try {
      if (prevData) configuredColumns = JSON.parse(prevData);
    } catch (error) {
      console.error(error);
    }
    return configuredColumns ?? {};
  };

  public clearAllFilters = () => {
    this.props.onClearAllFilters?.();
    this.searchStore.sortBy = undefined;
    this.searchStore.filters = [];
    this.forceUpdate();
    this.resetList();
  };

  private maximizeImages = (urls: string[], index: number) => {
    this.setLightbox?.(true, index, urls);
  };

  render() {
    const itemProps: TListItemProps<TEntityType, TFilterType> = {
      tableProps: this.props,
      actionsWidth: this.actionsWidth,
      searchStore: this.searchStore,
      totalElements: this.totalElements,
      getColumns: this.getColumns,
      loadConfiguredColumns: this.loadConfiguredColumns,
      resetList: this.resetList,
      getColumnStyles: this.getColumnStyles,
      handleDeleteBtnClick: this.handleDeleteItem,
      toggleSelection: this.handleToggleItemSelection,
      handleDeleteSelected: this.handleDeleteSelected,
      clearAllFilters: this.clearAllFilters,
      maximizeImages: this.maximizeImages,
    };

    return (
      <div className={styles.EntityTable}>
        <PageHeader {...itemProps} />
        {this.props.customElements?.getTableContent?.(itemProps) || (
          <div className={styles.table}>
            <TableHeader<TEntityType, TFilterType> {...itemProps} />
            <CList<TEntityType, TListItemProps<TEntityType, TFilterType>>
              className={styles.listWrapper}
              id={this.listId}
              ListItem={EntityTableItem}
              useAutoLoading
              usePagination
              listItemProps={{ ...itemProps }}
              useQueryPagination
              loader={({ pagedParams }) => this.getManyFilteredItems(pagedParams)}
              cssClasses={{
                scrollBox: styles.list,
                contentWrapper: styles.listContent,
              }}
              elements={{
                pagination: Pagination,
                preloader: listPreloader,
              }}
            />
          </div>
        )}
        <Lightbox
          getState={(setOpen) => {
            this.setLightbox = setOpen;
          }}
        />
      </div>
    );
  }
}

export default EntityTable;
