import { createStore } from 'react-redux-ts';
import { TCromwellBlock, TThemeConfig, TCmsStatus, onStoreChange } from '@cromwell/core';
import { Draggable } from '../helpers/Draggable/Draggable';
import { startUpdateChecker } from './helpers';

export type TAppState = {
  selectedItems: Record<number, boolean>;
  allSelected: boolean;
  selectedItem?: number;
  selectedBlock?: TCromwellBlock;
  draggable?: Draggable;
  activeTheme?: TThemeConfig;
  status?: TCmsStatus;
  forceUpdateSidebar?: () => void;
  forceUpdateApp?: () => void;
};

export const store = createStore<TAppState>(undefined, {
  selectedItems: {},
  allSelected: false,
});

export type DispatchType = typeof store.dispatch;
export type StoreAction = ReturnType<typeof store.dispatch>;

setTimeout(() => {
  startUpdateChecker();

  onStoreChange('userInfo', () => {
    startUpdateChecker();
  });
}, 100);
