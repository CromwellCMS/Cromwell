import { TFilteredProductList, TProductCategory, TProductFilter } from '@cromwell/core';

export type TProductFilterSettings = {
    listId?: string;
    mobileIconPosition?: {
        top: number;
        left: number;
    },
    collapsedByDefault?: boolean;
    mobileCollapsedByDefault?: boolean;
}

export type IFrontendFilter = {
    updateFilterMeta: (filteredList: TFilteredProductList | undefined) => void;
    handleMobileOpen: () => any;
    handleMobileClose: () => any;
}

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
}