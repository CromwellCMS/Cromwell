import { observable } from "mobx";
import { TAttribute, TProduct, TProductReview } from '@cromwell/core';
import * as actions from './productActions';

export type TProductListItem = {
    product?: TProduct;
    pickedAttributes?: Record<string, string[]>;
    amount?: number;
}


class ProductListStore {
    @observable
    cart: TProductListItem[] = actions.getCart();

    @observable
    wishlist: TProductListItem[] = actions.getWishlist();

    @observable
    compare: TProductListItem[] = actions.getCompare();
}

export const productListStore = new ProductListStore();