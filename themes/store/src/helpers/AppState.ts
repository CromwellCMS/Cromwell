import { observable } from "mobx";
import { TProduct } from '@cromwell/core';

class State {
    @observable
    isSigninOpen: boolean = false;

    @observable
    isCartOpen: boolean = false;

    @observable
    isWishlistOpen: boolean = false;

    @observable
    isCompareOpen: boolean = false;

    @observable
    isWatchedOpen: boolean = false;

    @observable
    isQuickViewOpen: boolean = false;

    @observable
    quickViewProductId: string | undefined;
}

export const appState = new State();