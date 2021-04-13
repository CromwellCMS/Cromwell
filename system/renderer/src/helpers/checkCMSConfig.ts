import { getStoreItem, setStoreItem, TCmsSettings, isServer } from "@cromwell/core";

export const checkCMSConfig = (newSettings: TCmsSettings,
    getStoreItemRepl?: typeof getStoreItem,
    setStoreItemRepl?: typeof setStoreItem,
): void => {
    const getStoreItemScoped = getStoreItemRepl ?? getStoreItem;
    const setStoreItemScoped = setStoreItemRepl ?? setStoreItem;
    const cmsSettings = getStoreItemScoped('cmsSettings');
    if (!cmsSettings) {
        setStoreItemScoped('cmsSettings', newSettings);
    }
    setStoreItemScoped('fsRequire', fsRequire);
}

export const fsRequire = (path: string, json?: boolean) => {
    if (!isServer()) return undefined;
    const normalizePath = eval(`require('normalize-path');`);
    const nodeRequire = (name: string) => eval(`require('${normalizePath(name)}');`);
    const fs = nodeRequire('fs');
    const requireFromString = nodeRequire('require-from-string');
    if (fs.existsSync(path)) {
        const str = fs.readFileSync(path).toString();
        if (json) return JSON.parse(str);
        return requireFromString(str);
    }
}

