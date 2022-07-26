import { DocumentNode } from '@apollo/client';
import {
    EDBEntity,
    TBaseFilter,
    TBasePageEntity,
    TCustomEntityColumn,
    TDefaultPageName,
    TDeleteManyInput,
    TPagedList,
    TCustomFieldSimpleTextType,
    TPagedParams,
    TCustomFieldType,
} from '@cromwell/core';

export interface IEntityListPage<TFilterType extends TBaseEntityFilter> {
    resetList: () => void;
    updateList: () => void;
    forceUpdate: () => void;
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
        listLeftActions?: JSX.Element;
        listRightActions?: JSX.Element;
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
    getPageListInstance?: (inst: IEntityListPage<TFilterType>) => any;

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
  