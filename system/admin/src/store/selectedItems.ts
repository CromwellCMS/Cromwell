import { TDeleteManyInput } from '@cromwell/core';
import { create } from 'zustand';

const selectedItemsStore = create<{
  selectedItems: Record<number, boolean>;
  allSelected: boolean;
  setAllSelected: (allSelected: boolean) => void;
  setSelectedItems: (selectedItems: Record<number, boolean>) => void;
}>((set) => ({
  selectedItems: {},
  allSelected: false,
  setAllSelected: (allSelected: boolean) => set({ allSelected }),
  setSelectedItems: (selectedItems: Record<number, boolean>) => set({ selectedItems }),
}));

export function useSelectedItems() {
  const selectedItems = selectedItemsStore((state) => state.selectedItems);
  const allSelected = selectedItemsStore((state) => state.allSelected);

  return {
    selectedItems,
    allSelected,
  };
}

export const toggleItemSelection = (itemId: number) => {
  const state = selectedItemsStore.getState();

  state.setSelectedItems({
    ...state.selectedItems,
    [itemId]: !state.selectedItems[itemId],
  });
};

export const toggleSelectAll = () => {
  const state = selectedItemsStore.getState();

  state.setAllSelected(!state.allSelected);
  state.setSelectedItems({});
};

export const countSelectedItems = (totalElements?: number | null) => {
  const state = selectedItemsStore.getState();

  let selectedItemsCount: number = Object.values(state.selectedItems ?? {}).filter(Boolean).length;
  if (state.allSelected) {
    selectedItemsCount = totalElements ? totalElements - selectedItemsCount : 0;
  }
  return selectedItemsCount;
};

export const resetSelected = () => {
  const state = selectedItemsStore.getState();

  state.setAllSelected(false);
  state.setSelectedItems({});
};

export const getSelectedInput = (): TDeleteManyInput => {
  const state = selectedItemsStore.getState();
  const selectedItems = state.selectedItems;

  return {
    all: state.allSelected,
    ids: Object.keys(selectedItems)
      .filter((id) => selectedItems[id])
      .map(Number)
      .filter(Boolean),
  };
};
