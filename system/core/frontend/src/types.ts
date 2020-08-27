import { TProduct } from '@cromwell/core';

export type TProductListItem = {
    product?: TProduct;
    pickedAttributes?: Record<string, string[]>;
    amount?: number;
}
