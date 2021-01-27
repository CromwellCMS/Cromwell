import { TPagedList } from '@cromwell/core';

export type TProductFilterSettings = {
    productListId?: string;
    mobileIconPosition?: {
        top: number;
        left: number;
    },
    collapsedByDefault?: boolean;
    mobileCollapsedByDefault?: boolean;
}

export type TProductFilter = {
    minPrice?: number;
    maxPrice?: number;
    attributes?: TProductFilterAttribute[];
    nameSearch?: string;
}
export type TProductFilterAttribute = {
    key: string;
    values: string[];
}

export type TFilteredList<T> = TPagedList<T> & {
    filterMeta: TFilterMeta;
}

export type TFilterMeta = {
    minPrice?: number;
    maxPrice?: number;
}
