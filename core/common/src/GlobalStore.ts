import { TCromwellStore, TAppConfig } from './types';
import { isServer } from './constants';

const initialStore: TCromwellStore = {
    pluginsData: {
    }
}

if (isServer()) {
    if (!global.CromwellStore)
        global.CromwellStore = initialStore;
}
else {
    if (!window.CromwellStore)
        window.CromwellStore = initialStore;
}

export const getStoreItem = <K extends keyof TCromwellStore>(itemName: K): TCromwellStore[K] => {
    if (isServer()) {
        return global.CromwellStore[itemName];
    }
    else {
        return window.CromwellStore[itemName];
    }
}

export const setStoreItem = <K extends keyof TCromwellStore>(itemName: K, item: TCromwellStore[K]): void => {
    if (isServer()) {
        global.CromwellStore[itemName] = item;
    }
    else {
        window.CromwellStore[itemName] = item;
    }
}

export const getPageCustomConfig = (): Record<string, any> | undefined => {
    if (isServer()) {
        return global.CromwellStore.pageConfig?.pageCustomConfig;
    }
    else {
        return window.CromwellStore.pageConfig?.pageCustomConfig;
    }
}


export const getAppConfig = (): TAppConfig | undefined => {
    if (isServer()) {
        return global.CromwellStore.appConfig;
    }
    else {
        return window.CromwellStore.appConfig;
    }
}


export const getAppCustomConfig = (): Record<string, any> | undefined => {
    if (isServer()) {
        return global.CromwellStore.appCustomConfig;
    }
    else {
        return window.CromwellStore.appCustomConfig;
    }
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