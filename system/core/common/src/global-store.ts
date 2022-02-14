import React from 'react';

import { isServer } from './helpers';
import { TCromwellBlock } from './types/blocks';
import { TCmsSettings, TCromwellStore, TSharedComponents } from './types/data';
import { TCmsRedirect } from './types/entities';

const initialStore: TCromwellStore = {}

if (isServer()) {
    if (!global.CromwellStore)
        global.CromwellStore = initialStore;
}
else {
    if (!window.CromwellStore)
        window.CromwellStore = initialStore;
}

export const getStore = (): TCromwellStore => {
    if (isServer()) {
        return global.CromwellStore;
    }
    else {
        return window.CromwellStore;
    }
}

export const getStoreItem = <K extends keyof TCromwellStore>(itemName: K): TCromwellStore[K] => {
    return getStore()[itemName];
}

export const setStoreItem = <K extends keyof TCromwellStore>(itemName: K, item: TCromwellStore[K]): void => {
    getStore()[itemName] = item;

    const storeChangeCallbacks = getStoreItem('storeChangeCallbacks');
    if (storeChangeCallbacks?.[itemName]) {
        for (const callback of Object.values(storeChangeCallbacks?.[itemName] ?? {})) {
            try {
                callback(item);
            } catch (e) { console.error(e) }
        }
    }
}

export const onStoreChange = <K extends keyof TCromwellStore>(itemName: K,
    callback: (itemValue: TCromwellStore[K]) => any, callbackId?: string): string => {

    let storeChangeCallbacks = getStoreItem('storeChangeCallbacks')

    if (!storeChangeCallbacks) {
        storeChangeCallbacks = {};
        setStoreItem('storeChangeCallbacks', storeChangeCallbacks);
    }
    if (!storeChangeCallbacks[itemName]) storeChangeCallbacks[itemName] = {};

    const cbId = callbackId ?? Object.keys(storeChangeCallbacks[itemName]).length + '';
    storeChangeCallbacks[itemName][cbId] = callback;
    return cbId;
}

export const removeOnStoreChange = <K extends keyof TCromwellStore>(itemName: K, callbackId: string) => {
    const storeChangeCallbacks = getStoreItem('storeChangeCallbacks');
    if (storeChangeCallbacks?.[itemName]) {
        delete storeChangeCallbacks[itemName][callbackId];
    }
}

export const getPageCustomConfig = (): Record<string, any> | undefined => {
    return getStore().pageConfig?.pageCustomConfig;
}


export const getCmsSettings = (): TCmsSettings | undefined => {
    return getStore()?.cmsSettings;
}


export const getThemeCustomConfig = (): Record<string, any> | undefined => {
    return getStore()?.themeCustomConfig;
}

export const getThemeCustomConfigProp = (propPath: string): any => {
    const getProp = (obj: any, paths: string[]): any => {
        if (!obj) return;
        if (obj[paths[0]]) {
            if (paths.length === 1) return obj[paths[0]];
            else {
                const p = [...paths];
                p.shift();
                return getProp(obj[paths[0]], p);
            }
        }
    }
    return getProp(getThemeCustomConfig(), propPath.split('/'));
}

export const getSharedComponent = <K extends keyof TSharedComponents>(componentName: K):
    TSharedComponents[K] => {
    const components = getStore().components;
    return components ? components[componentName] : undefined;
}

export const registerSharedComponent = <K extends keyof TSharedComponents>(componentName: K,
    component: TSharedComponents[K]): void => {
    let components = getStore().components;
    if (!components) {
        components = {};
        getStore().components = components;
    }
    components[componentName] = component;
}

export const getBlockInstance = <TContentBlock = React.Component>(blockId: string): TCromwellBlock<TContentBlock> | undefined => {
    const blockInstances = getStore().blockInstances;
    if (blockInstances) {
        return blockInstances[blockId] as any;
    }
}

export const registerRedirect = (ruleName: string, redirect: TCmsRedirect) => {
    let redirects = getStoreItem('redirects');
    if (!redirects) {
        redirects = {};
        setStoreItem('redirects', redirects);
    }
    redirects[ruleName] = redirect;
}

export const registerRewrite = (ruleName: string, rewrite: TCmsRedirect) => {
    let rewrites = getStoreItem('rewrites');
    if (!rewrites) {
        rewrites = {};
        setStoreItem('rewrites', rewrites);
    }
    rewrites[ruleName] = rewrite;
}