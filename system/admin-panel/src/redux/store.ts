import { createStore } from 'react-redux-ts';
import { TCromwellBlock, TThemeConfig } from '@cromwell/core';
import { Draggable } from '../helpers/Draggable/Draggable';

export type TAppState = {
    selectedItems: Record<string, boolean>;
    allSelected: boolean;
    selectedBlock?: TCromwellBlock;
    draggable?: Draggable;
    activeTheme?: TThemeConfig;
}

export const store = createStore<TAppState>(undefined, {
    selectedItems: {},
    allSelected: false,
});

export type DispatchType = typeof store.dispatch;
export type StoreAction = ReturnType<typeof store.dispatch>;

