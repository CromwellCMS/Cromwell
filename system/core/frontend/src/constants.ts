import { TCromwellBlockData, TCromwellBlockType, getStoreItem, TBlockContentGetter } from '@cromwell/core';
import React from 'react';
import loadable from '@loadable/component';
import dynamic from 'next/dynamic';

export const cromwellIdToHTML = (id: string): string => `CromwellBlock_${id}`;
export const cromwellIdFromHTML = (htmlId: string): string => htmlId.replace(/^CromwellBlock_/, '');
export const cromwellBlockTypeToClassname = (type: TCromwellBlockType) => `CromwellBlock_Type_${type}`
export const cromwellBlockTypeFromClassname = (classname: string): TCromwellBlockType | null => {
    if (/CromwellBlock_Type_/.test(classname)) {
        return classname.replace(/.*CromwellBlock_Type_/, '').split(' ')[0] as TCromwellBlockType;
    }
    else return null

}
export const cromwellBlockPluginNameToClassname = (name: string) => `CromwellBlock_PluginName_${name}`;

export const getBlockDataById = (blockId: string): TCromwellBlockData | undefined => {
    const instances = getStoreItem('blockInstances');
    if (instances) {
        const block = instances[blockId];
        if (block) {
            return block.getData();
        }
    }
}

export const getBlockData = (block: HTMLElement | Element | Node | ParentNode): TCromwellBlockData | undefined => {
    const id = (block as HTMLElement)?.id ? cromwellIdFromHTML((block as HTMLElement).id) : undefined;
    if (id) return getBlockDataById(id);
}

export const isAdminPanel = (): boolean => getStoreItem('environment')?.isAdminPanel ?? false;


export const { Consumer: BlockGetContentConsumer, Provider: BlockGetContentProvider } = React.createContext<TBlockContentGetter | null>(null);

// In Next.js environment there will be available dynamic function, in any other env Next.js module
// will be excluded and hence @loadable/component used
export const dynamicLoader = dynamic ?? loadable;