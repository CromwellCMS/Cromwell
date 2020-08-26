import { observable } from "mobx";
import { TAttribute, TProduct, TProductReview } from '@cromwell/core';

class ProductPageStore {
    @observable
    product?: TProduct | null;

    @observable
    modifiedProduct: TProduct;

    @observable
    pickedAttributes: Record<string, string[]>;
}

export const productStore = new ProductPageStore();