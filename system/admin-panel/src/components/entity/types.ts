import { DocumentNode } from '@apollo/client';
import {
  EDBEntity,
  TBaseFilter,
  TBasePageEntity,
  TCustomEntityColumn,
  TCustomFieldSimpleTextType,
  TCustomFieldType,
  TDefaultPageName,
  TDeleteManyInput,
  TPagedList,
  TPagedParams,
} from '@cromwell/core';

export interface IEntityListPage<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter> {
  resetList: () => void;
  updateList: () => void;
  forceUpdate: () => void;
  handleDeleteItem: (itemToDelete: TEntityType) => Promise<boolean>;
  getColumns: () => TCustomEntityColumn[];
  getFilterInput: () => TFilterType;
}

export type TBaseEntityFilter = TBaseFilter & {
  entityType?: string;
}

export type TEntityPageProps<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter> = {
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
  columns?: TCustomEntityColumn[];

  /**
   * Property of an element to use as a name in modals, such as: "Delete MyNewProductName?"
   * Will use ID by default 
   */
  nameProperty?: string

  /**
   * Name of one item such as: Product, Post, etc. Used in modals
   */
  entityLabel?: string;

  /**
   * How to name this list / page? 
   */
  listLabel: string;


  /**
   * Page to open when user clicks "edit" in list view page
   */
  entityBaseRoute?: string;

  /**
   * Page to open when user clicks "back to list" in entity view page
   */
  entityListRoute?: string;

  /**
   * Default page name if the page is one default CMS pages, or it will be taken from
   * entityType prop for other pages.
   */
  defaultPageName?: TDefaultPageName;

  /**
   * Hide "Add new" button
   */
  hideAddNew?: boolean;

  /**
   * Disable meta fields such as title, description, etc.
   */
  disableMeta?: boolean;

  /**
   * Get JSX input fields for entity properties
   */
  renderFields?: (data: TEntityType) => JSX.Element;

  /**
   * Get user input data on "save" button click
   */
  getInput?: () => Omit<TEntityType, 'id'>;

  /**
   * API methods called on user actions
   */
  getById?: (id: number, customFragment?: DocumentNode, customFragmentName?: string) => Promise<TEntityType>;
  update?: (id: number, input: Omit<TEntityType, 'id'>) => Promise<TEntityType>;
  create?: (input: Omit<TEntityType, 'id'>) => Promise<TEntityType>;
  deleteOne?: (id: number) => any;
  deleteMany?: (input: TDeleteManyInput, filter: TFilterType) => any;
  getMany?: (options: {
    pagedParams?: TPagedParams<TEntityType>;
    filterParams?: TFilterType;
    customFragment?: DocumentNode;
    customFragmentName?: string;
  }) => Promise<TPagedList<TEntityType> | undefined>;

  customElements?: {
    getHeaderLeftActions?: (props: TListItemProps<TEntityType, TFilterType>) => JSX.Element;
    getHeaderRightActions?: (props: TListItemProps<TEntityType, TFilterType>) => JSX.Element;
    getTableContent?: (props: TListItemProps<TEntityType, TFilterType>) => JSX.Element;
    getEntityFields?: (props: TFieldsComponentProps<TEntityType>) => JSX.Element;
    getEntityHeaderCenter?: (props: TFieldsComponentProps<TEntityType>) => JSX.Element;
  }

  /** 
   * Show additional actions per record, appear near edit/delete buttons. Use together with `customActionsWidth`. 
   */
  getItemCustomActions?: (entity: TEntityType, itemInstance: React.Component<any>) => JSX.Element;

  /** Define actions width to properly render columns (otherwise table layout will be broken) */
  customActionsWidth?: number;

  /**
   * Get React class component instance
   */
  getPageListInstance?: (inst: IEntityListPage<TEntityType, TFilterType>) => any;

  /**
   * When user presses "clear filters" button
   */
  onClearAllFilters?: () => void;

  /**
   * Are any additional filters applied? Used to highlight "clear filters" button
   */
  isFilterActive?: () => boolean;
}


export type TEditField<TEntityType> = {
  key: string;
  type: TCustomFieldType | 'custom';
  simpleTextType?: TCustomFieldSimpleTextType;
  label?: string;
  tooltip?: string;
  options?: ({
    value: string | number | undefined;
    label: string;
  } | string | number | undefined)[];
  width?: {
    xs?: number;
    sm?: number;
  };
  component?: React.ComponentType<{
    value: any;
    onChange: (value: any) => void;
    entity: TBasePageEntity;
    canValidate?: boolean;
    error?: boolean;
  }>;
  customGraphQlFragment?: string;
  saveValue?: (value: any) => any;
  required?: boolean;
  onlyOnCreate?: boolean;
  getInitialValue?: (value: any, entityData: TEntityType) => any;
}

export type TListItemProps<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter> = {
  searchStore: TSearchStore;
  tableProps: TEntityPageProps<TEntityType, TFilterType>;
  actionsWidth: number;
  totalElements: number;
  handleDeleteBtnClick: (item: TEntityType) => void;
  toggleSelection?: (item: TEntityType) => void;
  getColumns: () => TCustomEntityColumn[];
  getColumnStyles: (column: TCustomEntityColumn, allColumns: TCustomEntityColumn[]) => React.CSSProperties;
  resetList: () => void;
  loadConfiguredColumns: () => Record<string, TSearchStore['sortedColumns']>;
  handleDeleteSelected: () => void;
  clearAllFilters: () => void;
}

export type TSavedConfiguredColumn = {
  name: string;
  order?: number;
  visible?: boolean;
}

export type TSearchStore = {
  sortBy?: {
    column: TCustomEntityColumn;
    sort: 'ASC' | 'DESC';
  } | undefined;
  filters?: TBaseFilter['filters'];
  sortedColumns?: Record<string, TSavedConfiguredColumn>;
}

export type TEntityEditState<TEntityType> = {
  entityData?: TEntityType;
  isLoading?: boolean;
  notFound?: boolean;
  isSaving?: boolean;
  canValidate?: boolean;
}

export type TFieldsComponentProps<TEntityType> = TEntityEditState<TEntityType> & {
  refetchMeta: () => Promise<Record<string, string>>;
  onSave: () => Promise<void>;
};
