import { create } from 'zustand';

export const appStore = create<{
  forceUpdateSidebar?: () => void;
  forceUpdateApp?: () => void;
  setForceUpdateSidebar: (forceUpdateSidebar: () => void) => void;
}>((set) => ({
  setForceUpdateSidebar: (forceUpdateSidebar: () => void) => set({ forceUpdateSidebar }),
}));

export function forceUpdateSidebar() {
  appStore.getState().forceUpdateSidebar?.();
}
