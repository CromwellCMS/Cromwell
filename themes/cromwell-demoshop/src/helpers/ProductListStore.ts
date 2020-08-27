import { observable } from "mobx";
import { TAttribute, TProduct, TProductReview } from '@cromwell/core';
import { getCart, getWishlist, getCompare } from '@cromwell/core-frontend';

export type TProductListItem = {
    product?: TProduct;
    pickedAttributes?: Record<string, string[]>;
    amount?: number;
}


class ProductListStore {
    @observable
    cart: TProductListItem[] = getCart();

    @observable
    isCartOpen: boolean = false;

    @observable
    wishlist: TProductListItem[] = getWishlist();

    @observable
    isWishlistOpen: boolean = false;

    @observable
    compare: TProductListItem[] = getCompare();

    @observable
    isCompareOpen: boolean = false;
}

export const productListStore = new ProductListStore();