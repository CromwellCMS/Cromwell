import { observable } from "mobx";

class State {
    @observable
    isSigninOpen: boolean = false;

    @observable
    isCartOpen: boolean = false;

    @observable
    isWishlistOpen: boolean = false;

    @observable
    isCompareOpen: boolean = false;
}

export const appState = new State();