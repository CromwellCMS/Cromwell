import { makeAutoObservable } from 'mobx';

class State {
    constructor() {
        makeAutoObservable(this)
    }

    isSignInOpen: boolean = false;
    isCartOpen: boolean = false;
    isWishlistOpen: boolean = false;
    isCompareOpen: boolean = false;
    isWatchedOpen: boolean = false;
    isQuickViewOpen: boolean = false;
    quickViewProductId: number | undefined;
}

export const appState = new State();