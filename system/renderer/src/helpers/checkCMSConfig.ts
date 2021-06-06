import { isServer, setStoreItem } from '@cromwell/core';

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

export const checkCMSConfig = (): void => {
    if (!isServer()) return undefined;
    checkBackendModules();

    const config = coreBackend.readCMSConfigSync();
    setStoreItem('cmsSettings', config);
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

