import { create } from 'zustand';

import { IFileManager } from './types';

export const fileManagerStore = create<{
  instance: IFileManager | null;
  setInstance: (instance: IFileManager) => void;
}>((set) => ({
  instance: null,
  setInstance: (instance: IFileManager) => set({ instance }),
}));

export const getFileManager = (): IFileManager | null => {
  return fileManagerStore.getState().instance;
};
