export type TState = {
  isActive: boolean;
  isLoading: boolean;
  isSelecting: boolean;
  selectingType?: 'image' | 'file';
  isCreatingFolder: boolean;
  hasLoadingStatus: boolean;
};

export interface IFileManager {
  getPhoto: (settings?: { initialPath?: string; initialFileLocation?: string }) => Promise<string | undefined>;

  open: (settings?: { initialPath?: string; initialFileLocation?: string }) => void;
}

export type TItemType = 'image' | 'folder' | 'file';
