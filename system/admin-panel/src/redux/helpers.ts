import { getStoreItem, TDeleteManyInput } from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';

import { store } from './store';

export const toggleItemSelection = (itemId: string) => {
    store.setStateProp({
        prop: 'selectedItems',
        payload: {
            ...store.getState().selectedItems,
            [itemId]: !store.getState().selectedItems[itemId],
        },
    });
}

export const toggleSelectAll = () => {
    store.setStateProp({
        prop: 'allSelected',
        payload: !store.getState().allSelected
    });
    store.setStateProp({
        prop: 'selectedItems',
        payload: {},
    });
}

export const countSelectedItems = (totalElements?: number) => {
    let selectedItemsCount: number = Object.values(store.getState().selectedItems ?? {}).filter(Boolean).length;
    if (store.getState().allSelected) {
        selectedItemsCount = totalElements ?
            totalElements - selectedItemsCount : 0;
    }
    return selectedItemsCount;
}

export const resetSelected = () => {
    store.setStateProp({
        prop: 'allSelected',
        payload: false
    });
    store.setStateProp({
        prop: 'selectedItems',
        payload: {}
    });
    store.setStateProp({
        prop: 'selectedItem',
        payload: undefined,
    });
}

export const getSelectedInput = (): TDeleteManyInput => {
    const selectedItems = store.getState().selectedItems;
    return {
        all: store.getState().allSelected,
        ids: Object.keys(selectedItems).filter(id => selectedItems[id])
    }
}

export const updateStatus = async () => {
    try {
        const status = await getRestApiClient().getCmsStatus({ disableLog: true });
        if (status) {
            store.setStateProp({
                prop: 'status',
                payload: status,
            })
        }
    } catch (error) {
        console.error(error);
    }
}

let isChecking = false;
export const startUpdateChecker = () => {
    if (isChecking) return;

    if (getStoreItem('userInfo')?.role === 'administrator'
        || getStoreItem('userInfo')?.role === 'guest') {
        isChecking = true;
        updateChecker();
    }
}

const updateChecker = async () => {
    await updateStatus();
    requestAnimationFrame(() => setTimeout(updateChecker, 30000));
}