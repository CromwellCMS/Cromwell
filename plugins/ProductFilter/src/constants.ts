import { TProductFilterSettings } from './types';

type Required<T> = {
    [P in keyof T]-?: T[P];
};

export const defaultSettings: Required<TProductFilterSettings> = {
    productListId: "Category_ProductList",
    mobileIconPosition: {
        top: 100,
        left: 10
    },
    collapsedByDefault: false,
    mobileCollapsedByDefault: true,
}