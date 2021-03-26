import { TCromwellBlockData, TCromwellBlockType, getStoreItem, TBlockContentProvider, TCromwellBlock } from '@cromwell/core';
import React from 'react';
import loadable from '@loadable/component';
import dynamic from 'next/dynamic';

export const cromwellIdToHTML = (id: string): string => `CromwellBlock_${id}`;
export const cromwellIdFromHTML = (htmlId: string): string => htmlId.replace(/^CromwellBlock_/, '');
export const blockTypeToClassname = (type: TCromwellBlockType) => `CromwellBlock_Type_${type}`
export const cromwellBlockTypeFromClassname = (classname: string): TCromwellBlockType | null => {
    if (/CromwellBlock_Type_/.test(classname)) {
        return classname.replace(/.*CromwellBlock_Type_/, '').split(' ')[0] as TCromwellBlockType;
    }
    else return null

}
export const cromwellBlockPluginNameToClassname = (name: string) => `CromwellBlock_PluginName_${name}`;

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
export const dynamicLoader = dynamic ?? loadable;

export const pageRootContainerId = 'page-root-container';


export const awaitBlocksRender = async () => {
    const instances = getStoreItem('blockInstances');
    if (instances) {
        const promises: Promise<void>[] = [];
        Object.values(instances).forEach(inst => {
            const p = inst?.getRenderPromise();
            if (p?.then) promises.push(p);
        });
        if (promises.length > 0) await Promise.all(promises);
    }
}

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