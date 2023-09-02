import { TPagedList, TPagedParams } from '@cromwell/core';
import React from 'react';

export type TCssClasses = {
  scrollBox?: string;
  contentWrapper?: string;
  page?: string;
  pagination?: string;
  paginationLink?: string;
  paginationArrowLink?: string;
  paginationActiveLink?: string;
  paginationDisabledLink?: string;
};

export type TPaginationProps = {
  count: number;
  page: number;
  onChange: (page: number) => void;
};

export type TElements = {
  arrowLeft?: React.ReactNode;
  arrowRight?: React.ReactNode;
  arrowFirst?: React.ReactNode;
  arrowLast?: React.ReactNode;
  pagination?: React.ComponentType<TPaginationProps>;
  showMore?: React.ComponentType<{
    onClick: () => void;
  }>;
  /** Preloader to show during first data request  */
  preloader?: React.ReactNode;
};

export type TCListProps<DataType, ListItemProps> = {
  /** CBlock id */
  id: string;

  /** HTML Class attribute for wrapper container */
  className?: string;

  /** Component that will display items */
  ListItem: React.ComponentType<TListItemProps<DataType, ListItemProps>>;

  /** Prop object to pass for each component in a list */
  listItemProps?: ListItemProps;

  /** Array of data to create components for each piece and virtualize. Won't work with "loader" prop */
  dataList?: DataType[];

  /** Loader function that will be called to load more data during scroll
   * Needed if dataList wasn't provided. Doesn't work with dataLst.
   * If returned data is TPagedList, then will use pagination. If returned data is an array, then it won't be called anymore
   */
  loader?: TListLoader<DataType, ListItemProps>;

  /** Page size to first use in TPagedParams of "loader". After first batch recieved will use pageSize from pagedMeta if pagedMeta has it */
  pageSize?: number | (() => number | null | undefined) | null;

  /** First batch / page. Can be used with "loader". Supposed to be used in SSR to prerender page  */
  firstBatch?: TPagedList<DataType> | (() => TPagedList<DataType> | null | undefined) | null;

  /** Max pages to render at screen. 10 by default */
  maxDomPages?: number;

  /** Label to show when data array is empty. "No data" by default */
  noDataLabel?: string;

  /** Auto load more pages when scroll reached end of start in minRangeToLoad (px) */
  useAutoLoading?: boolean;

  /** Threshold in px where automatically request next or prev page. 200 by default. Use with useAutoLoading */
  minRangeToLoad?: number;

  /** If useAutoLoading disabled can show button to load next page in the same container */
  useShowMoreButton?: boolean;

  /** When useShowMoreButton and usePagination enabled CList needs to know
   * container that scrolls pages to define current page during scrolling  */
  scrollContainerSelector?: string;

  /** Display pagination */
  usePagination?: boolean;

  /** Disable caching of loaded pages from "loader" prop when open a new page by pagination. Caching is working by default */
  disableCaching?: boolean;

  /** Max number of page links to display. 10 by default */
  paginationButtonsNum?: number;

  /** Parse and set pageNumber in url as query param */
  useQueryPagination?: boolean;

  /** Force to show preloader instead of a list */
  isLoading?: boolean;

  cssClasses?: TCssClasses;

  elements?: TElements;

  /** window.location.pathname for SSR to prerender pagination links */
  pathname?: string;
};

/** Public API of CList instance */
export type TCList<DataType = any, ListItemProps = any> = {
  /** Get React component props. */
  getProps: () => TCListProps<DataType, ListItemProps>;
  /** Replace props. Will use them in any render after instead of React props. Behavior can be reset by setting null */
  setProps: (props: TCListProps<DataType, ListItemProps> | null) => void;
  /** Clear all internal data about pages and cache, set current pageNumber = 1 */
  clearState: () => void;
  /** Re-init component, parse first batch with metainfo, create pagination info */
  init: () => void;
  /** Clear state/data and request new from loader */
  updateData: () => Promise<void>;
  /** Navigate to specified page */
  openPage: (pageNumber: number) => void;
  /** Get scrollbox wrapper DOM element */
  getScrollboxEl: () => HTMLDivElement | null;
  /** event listeners */
  addListener: (type: TListenerType, cb: () => void) => void;
  /** Set additional params to use in "loader" prop. */
  setPagedParams: (val: TPagedParams<DataType>) => void;
  /** Get currently used params in "loader" prop */
  getPagedParams: () => TPagedParams<DataType>;
  /** Re-render */
  rerenderData: () => void;
  /** Get usage some stats that the list recorded */
  getListStats: () => TListStats;
  /** Re-inits state and fetches new data */
  reset: () => Promise<void>;

  /**
   * Register custom data loader. When new data has to be loaded (for example new page is requested),
   * CList will collect registered loaders and the one with the highest priority will be used.
   * Loader getter will provide current context and your app might decide whether or not provide custom loader.
   * If in particular case custom loader is not needed - loader getter can return undefined and
   * default loader will be used.
   * With this feature custom product filters can be implemented. Check `@cromwell/plugin-product-filter` to see how it used.
   */
  registerLoaderGetter: (key: string, getter: TLoaderGetter<DataType>) => void;
  unregisterLoaderGetter: (key: string) => void;
};

export type TListenerType = 'componentDidUpdate';

export type TListItemProps<DataType, ListItemProps> = {
  data?: DataType | undefined;
  listItemProps?: ListItemProps;
  pageNumber?: number;
  numberOnPage?: number;
  numberOnScreen?: number;
  prevItemProps?: TListItemProps<DataType, ListItemProps>;
};

export type TListStats = { lastPageSize?: number };

export type TListLoaderArgs<DataType, ListItemProps = any> = {
  pagedParams: TPagedParams<DataType>;
  listProps: TCListProps<DataType, ListItemProps>;
  listStats: TListStats;
  currentPageNum: number;
};

export type TListLoaderResult<DataType> =
  | Promise<TPagedList<DataType> | DataType[] | undefined | null>
  | undefined
  | null;

export type TListLoader<DataType, ListItemProps> = (
  args: TListLoaderArgs<DataType, ListItemProps>,
) => TListLoaderResult<DataType>;

export type TLoaderGetter<DataType, ListItemProps = any> = (args: TListLoaderArgs<DataType, ListItemProps>) =>
  | {
      loader?: TListLoader<DataType, ListItemProps>;
      priority?: number;
    }
  | undefined;
