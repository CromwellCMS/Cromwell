import { TAttribute, TProductCategory, TProductFilter, TProductFilterMeta } from '@cromwell/core';

export type TProductFilterSettings = {
  listId?: string;
  mobileBreakpoint?: number;
  mobileIconPosition?: {
    top: number;
    left: number;
  };
  collapsedByDefault?: boolean;
  mobileCollapsedByDefault?: boolean;
};

export type IFrontendFilter = {
  setFilterMeta: (filterMeta: TProductFilterMeta | undefined) => void;
  handleMobileOpen: () => any;
  handleMobileClose: () => any;
  setFilter: (filterParams: TProductFilter) => void;
};

export type TInstanceSettings = {
  onChange?: (params: TProductFilter) => void;
  disableMobile?: boolean;
  listId?: string;
  getInstance: (inst: IFrontendFilter) => any;
  onMount: (inst: IFrontendFilter) => any;
  /**
   * Custom on category click handler. Return true to
   * skip default handler (navigate to category)
   * */
  onCategoryClick?: (category: TProductCategory) => boolean;
  cacheSessionData?: boolean;
};

export type TInitialFilterData = {
  attributes?: TAttribute[];
  filterMeta?: TProductFilterMeta;
  productCategory?: TProductCategory;
};

export type TPluginProductFilterData = {
  slug?: string | string[] | null;
  pluginSettings?: TProductFilterSettings;
};
