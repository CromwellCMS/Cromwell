import { observable } from "mobx";

class ProductListStore {
    @observable
    isCartOpen: boolean = false;

    @observable
    isWishlistOpen: boolean = false;

    @observable
    isCompareOpen: boolean = false;
}

export const productListStore = new ProductListStore();