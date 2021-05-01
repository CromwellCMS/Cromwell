
export type TState = {
    isActive: boolean;
    isLoading: boolean;
    isSelecting: boolean;
    isCreatingFolder: boolean;
}

export interface IFileManager {
    getPhoto: (settings?: {
        initialPath?: string;
        initialFileLocation?: string;
    }) => Promise<string | undefined>;
}

declare global {
    namespace NodeJS {
        interface Global {
            CromwellFileManager?: IFileManager;
        }
    }
    interface Window {
        CromwellFileManager?: IFileManager;
    }
}

export type TItemType = 'image' | 'folder' | 'file';