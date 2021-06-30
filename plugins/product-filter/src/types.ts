import { TProductFilter } from '@cromwell/core';

export type TProductFilterSettings = {
    listId?: string;
    mobileIconPosition?: {
        top: number;
        left: number;
    },
    collapsedByDefault?: boolean;
    mobileCollapsedByDefault?: boolean;
}

export type TInstanceSettings = {
    onChange?: (params: TProductFilter) => void;
    disableMobile?: boolean;
    listId?: string;
}