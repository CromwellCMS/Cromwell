import { TCromwellBlock, TCromwellBlockData, TCromwellBlockType } from '@cromwell/core';
import React from 'react';

export type TPluginBlockOptions = {
    component?: React.ComponentType<{
        block?: TCromwellBlock;
        instanceSettings?: any;
        changeInstanceSettings?: (data: any) => void;
        modifyData?: (data: TCromwellBlockData) => void;
        deleteBlock?: () => void;
        addNewBlockAfter?: (bType: TCromwellBlockType) => void;
        updateFramesPosition?: () => any;
        forceUpdate?: () => void;
    }>;
    pluginName: string;
    blockName: string;
}

const pluginBlocks: Record<string, TPluginBlockOptions> = {};
const pluginBlockRegisterCallbacks: ((options: TPluginBlockOptions) => any)[] = [];

export const getPluginBlockId = (pluginName: string, blockName: string) =>
    (!pluginName || !blockName) ? null : `${pluginName}_${blockName}`;

export const registerThemeEditorPluginBlock = (options: TPluginBlockOptions) => {
    const { pluginName, blockName } = options ?? {};

    if (!pluginName || !blockName) {
        console.error('registerThemeEditorPluginBlock: Invalid options: ' + options);
        return;
    }

    pluginBlocks[getPluginBlockId(pluginName, blockName)] = options;
    pluginBlockRegisterCallbacks.forEach(cb => cb?.(options));
}

export const onPluginBlockRegister = (callback: (options: TPluginBlockOptions) => any) => {
    pluginBlockRegisterCallbacks.push(callback);
}

export const getPluginBlocks = (): TPluginBlockOptions[] => {
    return Object.values(pluginBlocks);
}