import { TProduct, TSciprtMetaInfo } from '@cromwell/core';

export type TStoreListItem = {
    product?: TProduct;
    pickedAttributes?: Record<string, string[]>;
    amount?: number;
}