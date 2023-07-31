import { TProduct } from '@cromwell/core';
import React from 'react';

export type TProductStore = {
  productRef: { data: TProduct | null };
  tab?: number;
  onTabChange?: (() => void)[];
};

export const ProductContext = React.createContext<{
  store: TProductStore;
  setStore: (value: TProductStore) => void;
}>({} as any);
