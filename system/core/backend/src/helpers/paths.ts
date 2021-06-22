import { TModuleConfig, TPackageCromwellConfig, TPackageJson } from '@cromwell/core';
import fs from 'fs-extra';
import normalizePath from 'normalize-path';
import { dirname, isAbsolute, resolve, join } from 'path';

import { getLogger } from './logger';

export const cmsName = 'cromwell';
export const tempDirName = `.${cmsName}`;
export const buildDirName = `build`;
export const configFileName = `${cmsName}.config.js`;
export const cmsConfigFileName = 'cmsconfig.json';

export const getTempDir = () => resolve(process.cwd(), tempDirName);

export const resolvePackageJsonPath = (moduleName: string): string | undefined => {
    return require.resolve(`${moduleName}/package.json`, {
        paths: [process.cwd()]
    });
}

export const getNodeModuleDirSync = (moduleName: string) => {
    try {
        const modulePath = resolvePackageJsonPath(moduleName);
        if (modulePath) return dirname(fs.realpathSync(modulePath));
    } catch (e) {
        const logger = getLogger();
    }
}

export const getNodeModuleDir = async (moduleName: string) => {
    try {
        const modulePath = resolvePackageJsonPath(moduleName);
        if (modulePath) return dirname(await fs.realpath(modulePath));
    } catch (e) { }

    try {
        // if module is a root package
        const rootPackage = await getModulePackage();
        if (rootPackage?.name === moduleName) return await fs.realpath(process.cwd());
    } catch (e) { }
}

export const getCMSConfigPath = () => resolve(process.cwd(), cmsConfigFileName);

export const getCoreCommonDir = () => getNodeModuleDirSync('@cromwell/core');
export const getCoreFrontendDir = () => getNodeModuleDirSync('@cromwell/core-backend');
export const getCoreBackendDir = () => getNodeModuleDirSync('@cromwell/core-frontend');
export const getLogsDir = () => join(getTempDir(), 'logs');
export const getErrorLogPath = () => join(getLogsDir(), 'error.log');

// Manager
export const getManagerDir = () => getNodeModuleDirSync('@cromwell/cms');
export const getManagerTempDir = () => resolve(getTempDir(), 'manager');


// Renderer
export const getRendererDir = () => getNodeModuleDirSync('@cromwell/renderer');
export const getRendererStartupPath = () => {
    const rendererDir = getRendererDir();
    if (rendererDir) return resolve(rendererDir, 'startup.js');
}
export const getRendererTempDir = () => resolve(getTempDir(), 'renderer');
export const getRendererTempDevDir = () => resolve(getTempDir(), 'renderer-dev');
export const getRendererBuildDir = () => {
    const rendererDir = getRendererDir();
    if (rendererDir) return resolve(rendererDir, 'build');
}


// Admin panel

export const getAdminPanelDir = () => getNodeModuleDirSync('@cromwell/admin-panel');
export const getAdminPanelServiceBuildDir = () => {
    const adminPanelDir = getAdminPanelDir();
    if (adminPanelDir) return resolve(adminPanelDir, 'build');
}
export const getAdminPanelTempDir = () => resolve(getTempDir(), 'admin-panel');

export const getAdminPanelWebServiceBuildDir = () =>
    resolve(getAdminPanelTempDir(), 'build');

export const getAdminPanelWebPublicDir = () =>
    resolve(getAdminPanelTempDir(), 'public');

export const getAdminPanelStartupPath = () => {
    const adminPanelDir = getAdminPanelDir();
    if (adminPanelDir) return resolve(adminPanelDir, 'startup.js');
}
export const getAdminPanelStaticDir = () => {
    const adminPanelDir = getAdminPanelDir();
    if (adminPanelDir) return resolve(adminPanelDir, 'static');
}

// Server
export const getServerDir = () => getNodeModuleDirSync('@cromwell/server');
export const getServerStartupPath = () => {
    const serverDir = getServerDir();
    if (serverDir) return resolve(serverDir, 'startup.js');
}
export const getServerBuildDir = () => {
    const serverDir = getServerDir();
    if (serverDir) return resolve(serverDir, 'build');
}
export const getServerBuildPath = () => {
    const serverDir = getServerDir();
    if (serverDir) return resolve(serverDir, 'build/server.js');
}
export const getServerBuildProxyPath = () => {
    const serverDir = getServerDir();
    if (serverDir) return resolve(serverDir, 'build/proxy.js');
}
export const getServerTempDir = () => resolve(getTempDir(), 'server');
export const getServerTempEmailsDir = () => resolve(getServerTempDir(), 'emails');
export const getServerDefaultEmailsDir = () => {
    const serverDir = getServerDir();
    if (serverDir) resolve(serverDir, 'static/emails');
}


// Utils
export const getUtilsDir = () => getNodeModuleDirSync('@cromwell/utils');
export const getUtilsImporterPath = () => {
    const utilsDir = getUtilsDir();
    if (utilsDir) return resolve(utilsDir, 'build/browser/importer.js');
}
export const getUtilsBuildDir = () => {
    const utilsDir = getUtilsDir();
    if (utilsDir) return resolve(utilsDir, 'build');
}
export const getUtilsTempDir = () => resolve(getTempDir(), 'utils');

// Theme
export const getThemeBuildDir = async (themeModuleName: string) => {
    const themeDir = isAbsolute(themeModuleName) ? themeModuleName : await getNodeModuleDir(themeModuleName);
    if (themeDir) {
        return resolve(themeDir, buildDirName);
    }
}
export const getThemeTempRollupBuildDir = () => {
    return resolve(getRendererTempDevDir(), 'theme')
}
export const getThemeRollupBuildDir = async (themeModuleName: string) => {
    const themeBuildDir = await getThemeBuildDir(themeModuleName);
    if (themeBuildDir) {
        return resolve(themeBuildDir, 'theme')
    }
}
export const getThemeRollupBuildDirByPath = (themeDir: string) => {
    return resolve(themeDir, buildDirName, 'theme');
}

export const getThemeNextBuildDir = async (themeModuleName: string) => {
    const themeBuildDir = await getThemeBuildDir(themeModuleName);
    if (themeBuildDir) {
        return resolve(themeBuildDir, '.next')
    }
}
export const getThemeNextBuildDirByPath = (themeDir: string) => {
    return resolve(themeDir, buildDirName, '.next');
}
export const getThemeTempAdminPanelDir = () => {
    const themeBuildDir = getThemeTempRollupBuildDir();
    return resolve(themeBuildDir, 'admin')
}
export const getThemeAdminPanelDir = async (themeModuleName: string) => {
    const themeBuildDir = await getThemeRollupBuildDir(themeModuleName);
    if (themeBuildDir) {
        return resolve(themeBuildDir, 'admin')
    }
}
export const getThemeAdminPanelBundleDir = async (themeModuleName: string, pageRoute: string) => {
    const themeAdminPanelDir = await getThemeAdminPanelDir(themeModuleName);
    if (themeAdminPanelDir) {
        return resolve(themeAdminPanelDir, pageRoute)
    }
}

export const getCmsModuleConfig = async (moduleName?: string): Promise<TModuleConfig | undefined> => {
    const path = moduleName ? await getNodeModuleDir(moduleName) : process.cwd();
    if (path) {
        const configPath = resolve(path, configFileName);
        try {
            return require(configPath);
        } catch (e) { }
    }
}

export const getCmsModuleInfo = async (moduleName?: string): Promise<TPackageCromwellConfig | undefined> => {
    const pckg = await getModulePackage(moduleName);
    if (pckg?.cromwell) {
        if (!pckg.cromwell.name) pckg.cromwell.name = pckg.name;
        if (!pckg.cromwell.version) pckg.cromwell.version = pckg.version;
        return pckg.cromwell;
    }
}

export const getModuleStaticDir = async (moduleName: string) => {
    const themeDir = isAbsolute(moduleName) ? moduleName : await getNodeModuleDir(moduleName);
    if (themeDir) {
        return resolve(themeDir, 'static');
    }
}

export const getMetaInfoPath = (filename: string) => `${filename}_meta.json`;

export const pluginFrontendBundlePath = 'frontend/index.js';
export const pluginFrontendCjsPath = 'frontend/cjs.js';
export const pluginAdminBundlePath = 'admin/index.js';
export const pluginAdminCjsPath = 'admin/cjs.js';
export const getPluginFrontendBundlePath = (distDir: string) => resolve(distDir, pluginFrontendBundlePath);
export const getPluginFrontendCjsPath = (distDir: string) => resolve(distDir, pluginFrontendCjsPath);
export const getPluginFrontendMetaPath = (distDir: string) => getMetaInfoPath(getPluginFrontendBundlePath(distDir));
export const getPluginAdminBundlePath = (distDir: string) => resolve(distDir, pluginAdminBundlePath);
export const getPluginAdminCjsPath = (distDir: string) => resolve(distDir, pluginAdminCjsPath);
export const getPluginBackendPath = (distDir: string) => resolve(distDir, 'backend/index.js');
export const getThemePagesMetaPath = (distDir: string) => resolve(distDir, 'pages_meta.json');
export const getThemePagesVirtualPath = (distDir: string) => resolve(distDir, '__virtual.js');

export const getPublicDir = () => resolve(process.cwd(), 'public');
export const getPublicPluginsDir = () => resolve(getPublicDir(), 'plugins');
export const getPublicThemesDir = () => resolve(getPublicDir(), 'themes');

export const readPackage = async (path: string) => {
    if (await fs.pathExists(path))
        return await fs.readJSON(path);
}

export const getModulePackage = async (moduleName?: string): Promise<TPackageJson | undefined> => {
    const logger = getLogger();
    let pPath: string | undefined = moduleName ?? process.cwd();

    if (!isAbsolute(pPath)) {
        try {
            pPath = resolvePackageJsonPath(pPath);
        } catch (error) { }
    }

    if (moduleName && (!pPath || !isAbsolute(pPath))) {
        try {
            // if module is a root package
            const rootPackage = await getModulePackage();
            if (rootPackage?.name === moduleName) return rootPackage;
        } catch (e) { }
    }

    if (pPath && !pPath.endsWith('package.json')) pPath = pPath + '/package.json';
    if (pPath) pPath = normalizePath(pPath);
    try {
        if (pPath) return await readPackage(pPath);
    } catch (e) { logger.error('Failed to read package.json at: ' + pPath) }
}