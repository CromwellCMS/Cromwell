import { isServer, setStoreItem } from '@cromwell/core';

let normalizePath;
let nodeRequire;
let fs: typeof import('fs-extra');
let requireFromString;
let coreBackend: typeof import('@cromwell/core-backend');
let pathResolve: (typeof import('path'))['resolve'];
let hasRequired = false;

const checkBackendModules = () => {
    setStoreItem('fsRequire', fsRequire);
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

    let cmsConfigPath = coreBackend.getCMSConfigPath();
    if (!fs.pathExistsSync(cmsConfigPath)) {
        cmsConfigPath = coreBackend.getCMSConfigPath(pathResolve(process.cwd(), '../../'));
    }

    const config = coreBackend.readCMSConfigSync(cmsConfigPath);
    setStoreItem('cmsSettings', config);
}

export const getPluginCjsPath = async (pluginName: string): Promise<{
    cjsPath: string | undefined;
    metaPath: string | undefined;
} | undefined> => {
    if (!isServer()) return undefined;
    checkBackendModules();
    const pluginDir = await coreBackend.getNodeModuleDir(pluginName);
    if (!pluginDir) return;
    const buildDir = pathResolve(pluginDir, coreBackend.buildDirName);

    let cjsPath = coreBackend.getPluginFrontendCjsPath(buildDir);
    if (cjsPath) cjsPath = normalizePath(cjsPath);
    if (cjsPath && !(await fs.pathExists(cjsPath))) return undefined;

    let metaPath: string | undefined = coreBackend.getPluginFrontendMetaPath(buildDir);
    if (!(await fs.pathExists(metaPath))) metaPath = undefined;

    return {
        cjsPath,
        metaPath,
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

setStoreItem('fsRequire', fsRequire);
