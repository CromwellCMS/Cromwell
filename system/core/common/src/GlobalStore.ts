import { TCromwellStore, TAppConfig, TCmsConfig } from './types/data';
import { TCommonComponentProps, TCromwellBlock } from './types/blocks';
import { isServer, ECommonComponentNames } from './constants';

const initialStore: TCromwellStore = {
    pluginsData: {}
}

if (isServer()) {
    if (!global.CromwellStore)
        global.CromwellStore = initialStore;
}
else {
    if (!window.CromwellStore)
        window.CromwellStore = initialStore;
}

const getStore = (): TCromwellStore => {
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
}

export const getPageCustomConfig = (): Record<string, any> | undefined => {
    return getStore().pageConfig?.pageCustomConfig;
}


export const getAppConfig = (): TAppConfig | undefined => {
    return getStore()?.appConfig;
}
export const getCmsConfig = (): TCmsConfig | undefined => {
    return getStore()?.cmsconfig;
}


export const getAppCustomConfig = (): Record<string, any> | undefined => {
    return getStore()?.appCustomConfig;
}

export const getAppCustomConfigProp = (propPath: string): any => {
    const getProp = (obj: any, paths: string[]): any => {
        if (obj[paths[0]]) {
            if (paths.length === 1) return obj[paths[0]];
            else {
                const p = [...paths];
                p.shift();
                return getProp(obj[paths[0]], p);
            }
        }
        return undefined;
    }
    const paths = propPath.split('/');
    const config = getAppCustomConfig();
    const prop = config ? getProp(config, paths) : undefined;
    return prop;
}

export const getAppCustomConfigTextProp = (propPath: string): string => {
    const prop = getAppCustomConfigProp(propPath);
    return prop ? prop : `{appCustomConfig/${propPath}}`;
}


export const loadCommonComponent = (componentName: ECommonComponentNames | string): React.ComponentType<TCommonComponentProps> | undefined => {
    const components = getStore().components;
    return components ? components[componentName] : undefined;
}

export const saveCommonComponent = (componentName: ECommonComponentNames | string, component: React.ComponentType<TCommonComponentProps>): void => {
    let components = getStore().components;
    if (!components) {
        components = {};
        getStore().components = components;
    }
    components[componentName] = component;
}

export const getBlockInstance = (blockId: string): TCromwellBlock | undefined => {
    const blockInstances = getStore().blockInstances;
    if (blockInstances) {
        return blockInstances[blockId];
    }
}