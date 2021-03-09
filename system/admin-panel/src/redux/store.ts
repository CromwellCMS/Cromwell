import { createStore } from 'react-redux-ts';

export type TAppState = {
    selectedItems: Record<string, boolean>;
    allSelected: boolean;
}

export const store = createStore<TAppState>();

export type DispatchType = typeof store.dispatch;
export type StoreAction = ReturnType<typeof store.dispatch>;

