import { CromwellStoreType } from './types';
export declare const getStoreItem: <K extends "modulesData" | "cmsconfig" | "blocksData">(itemName: K) => CromwellStoreType[K];
export declare const setStoreItem: <K extends "modulesData" | "cmsconfig" | "blocksData">(itemName: K, item: CromwellStoreType[K]) => void;
