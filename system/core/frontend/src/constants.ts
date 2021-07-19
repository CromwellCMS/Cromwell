import {
    getStore,
    getStoreItem,
    TBlockContentProvider,
    TCromwellBlock,
    TCromwellBlockData,
    TCromwellBlockType,
} from '@cromwell/core';
import loadable from '@loadable/component';
import React, { ComponentType } from 'react';

export const CromwellBlockCSSclass = 'CB';
export const cromwellIdToHTML = (id: string): string => `CB_${id}`;
export const cromwellIdFromHTML = (htmlId: string): string => htmlId.replace(/^CB_/, '');
export const blockTypeToClassname = (type: TCromwellBlockType) => `CB_T_${type}`
export const cromwellBlockTypeFromClassname = (classname: string): TCromwellBlockType | null => {
    if (/CB_T_/.test(classname)) {
        return classname.replace(/.*CB_T_/, '').split(' ')[0] as TCromwellBlockType;
    }
    else return null

}
export const cromwellBlockPluginNameToClassname = (name: string) => `CB_P_${name}`;

export const getBlockById = (blockId?: string): TCromwellBlock | undefined | null => {
    const instances = getStoreItem('blockInstances');
    if (instances && blockId) {
        return instances[blockId];
    }
}

export const getBlockDataById = (blockId: string): TCromwellBlockData | undefined => {
    const block = getBlockById(blockId)
    if (block) {
        return block.getData();
    }
}

export const getBlockData = (block: HTMLElement | Element | Node | ParentNode): TCromwellBlockData | undefined => {
    const id = (block as HTMLElement)?.id ? cromwellIdFromHTML((block as HTMLElement).id) : undefined;
    if (id) return getBlockDataById(id);
}

export const getBlockElementById = (id?: string): HTMLElement | undefined | null => {
    if (id) {
        const idStr = cromwellIdToHTML(id);
        return document.getElementById(idStr);
    }
}

export const isAdminPanel = (): boolean => getStoreItem('environment')?.isAdminPanel ?? false;


export const { Consumer: BlockContentConsumer, Provider: BlockContentProvider } = React.createContext<TBlockContentProvider | null>(null);

// In Next.js environment there will be available "dynamic" function, in any other env Next.js module
// will be excluded and @loadable/component used instead
export type TDynamicLoader = ((func: (() => Promise<ComponentType>), options?: any) => ComponentType);
export const getDynamicLoader: () => TDynamicLoader
    = () => getStore().nodeModules?.modules?.['next/dynamic'] ?? loadable;

export const pageRootContainerId = 'root';

export const awaitImporter = async () => {
    const importer = getStoreItem('nodeModules');
    if (importer?.scriptStatuses) {
        const promises: Promise<any>[] = [];
        Object.values(importer.scriptStatuses).forEach(p => {
            if (typeof p === 'object' && p.then) promises.push(p);
        });
        if (promises.length > 0) await Promise.all(promises);
    }
}

