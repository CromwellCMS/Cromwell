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

let normalizePath;
let nodeRequire;
let fs;
let requireFromString;
let coreBackend;
let pathResolve;
let hasRequired = false;

const checkBackendModules = () => {
    if (hasRequired) return;
    hasRequired = true;
    normalizePath = eval(`require('normalize-path');`);
    nodeRequire = (name: string) => eval(`require('${normalizePath(name)}');`);
    fs = nodeRequire('fs-extra');
    requireFromString = nodeRequire('require-from-string');
    coreBackend = nodeRequire('@cromwell/core-backend');
    pathResolve = nodeRequire('path').resolve;
}

export const getPluginCjsPath = async (pluginName: string) => {
    if (!isServer()) return undefined;
    checkBackendModules();
    const pluginDir = await coreBackend.getNodeModuleDir(pluginName);
    if (!pluginDir) return;
    let cjsPath = coreBackend.getPluginFrontendCjsPath(pathResolve(pluginDir, coreBackend.buildDirName));
    if (cjsPath) cjsPath = normalizePath(cjsPath);
    if (cjsPath && !(await fs.pathExists(cjsPath))) cjsPath = undefined;
    return cjsPath;
}

export const fsRequireSync = (path: string, json?: boolean) => {
    if (!isServer()) return undefined;
    checkBackendModules();

    if (fs.existsSync(path)) {
        const str = fs.readFileSync(path).toString();
        if (json) return JSON.parse(str);
        return requireFromString(str);
    }
}

export const fsRequire = async (path: string, json?: boolean) => {
    if (!isServer()) return undefined;
    checkBackendModules();

    if (await fs.pathExists(path)) {
        const str = (await fs.readFile(path)).toString();
        if (json) return JSON.parse(str);
        return requireFromString(str);
    }
}

