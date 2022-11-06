import { makeAutoObservable } from 'mobx';

export type TSignInFormType = 'sign-in' | 'sign-up';

class State {
  constructor() {
    makeAutoObservable(this);
  }

  isCartOpen: boolean = false;
  isWishlistOpen: boolean = false;
  isCompareOpen: boolean = false;
  isWatchedOpen: boolean = false;
  isQuickViewOpen: boolean = false;
  quickViewProductId: number | undefined;
  isSignInOpen: boolean = false;
  signInFormType: TSignInFormType = 'sign-in';

  closeAllModals() {
    if (appState.isCartOpen) appState.isCartOpen = false;
    if (appState.isSignInOpen) appState.isSignInOpen = false;
    if (appState.isWishlistOpen) appState.isWishlistOpen = false;
    if (appState.isCompareOpen) appState.isCompareOpen = false;
    if (appState.isWatchedOpen) appState.isWatchedOpen = false;
    if (appState.isQuickViewOpen) appState.isQuickViewOpen = false;
    if (appState.quickViewProductId) appState.quickViewProductId = undefined;
  }
}

export const appState = new State();
