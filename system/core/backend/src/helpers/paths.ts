import { resolve, dirname } from 'path';
import fs from 'fs-extra';
import { serverLogFor } from './constants';
import { TPluginConfig, TThemeConfig } from '@cromwell/core';

export const cmsName = 'cromwell';
export const tempDirName = `.${cmsName}`;
export const buildDirName = `build`;
export const configFileName = 'module.config.js';
export const cmsConfigFileName = 'cmsconfig.json';

export const getTempDir = () => resolve(process.cwd(), tempDirName);

const resolveModulePath = (moduleName: string): string | undefined => {
    try {
        return require.resolve(`${moduleName}/package.json`);
    } catch (e) {
        serverLogFor('errors-only', 'Failed to resolve module path of: ' + moduleName + e, 'Error');
    }
}
export const getNodeModuleDirSync = (moduleName: string) => {
    const modulePath = resolveModulePath(moduleName);
    if (modulePath) return dirname(fs.realpathSync(modulePath));
}

export const getNodeModuleDir = async (moduleName: string) => {
    const modulePath = resolveModulePath(moduleName);
    if (modulePath) return dirname(await fs.realpath(modulePath));
}

export const getCMSConfigPath = () => resolve(process.cwd(), cmsConfigFileName);

export const getCoreCommonDir = () => getNodeModuleDirSync('@cromwell/core');
export const getCoreFrontendDir = () => getNodeModuleDirSync('@cromwell/core-backend');
export const getCoreBackendDir = () => getNodeModuleDirSync('@cromwell/core-frontend');


// Manager
export const getManagerDir = () => getNodeModuleDirSync('@cromwell/manager');
export const getManagerTempDir = () => resolve(getTempDir(), 'manager');


// Renderer
export const getRendererDir = () => getNodeModuleDirSync('@cromwell/renderer');
export const getRendererStartupPath = () => {
    const rendererDir = getRendererDir();
    if (rendererDir) return resolve(rendererDir, 'startup.js');
}
export const getRendererTempDir = () => resolve(getTempDir(), 'renderer');
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

// Server
export const getServerDir = () => getNodeModuleDirSync('@cromwell/server');
export const getServerStartupPath = () => {
    const serverDir = getServerDir();
    if (serverDir) return resolve(serverDir, 'startup.js');
}
export const getOrmConfigPath = () => resolve(process.cwd(), 'ormconfig.json');
export const getServerTempDir = () => resolve(getTempDir(), 'server');


// Cromwella
export const getCromwellaDir = () => getNodeModuleDirSync('@cromwell/cromwella');
export const getCromwellaImporterPath = () => {
    const cromwellaDir = getCromwellaDir();
    if (cromwellaDir) return resolve(cromwellaDir, 'build/browser/importer.js');
}
export const getCromwellaBuildDir = () => {
    const cromwellaDir = getCromwellaDir();
    if (cromwellaDir) return resolve(cromwellaDir, 'build');
}

// Theme
export const getThemeBuildDir = async (themeModuleName: string) => {
    const themeDir = await getNodeModuleDir(themeModuleName);
    if (themeDir) {
        return resolve(themeDir, buildDirName);
    }
}
export const getThemeRollupBuildDir = async (themeModuleName: string) => {
    const themeBuildDir = await getThemeBuildDir(themeModuleName);
    if (themeBuildDir) {
        return resolve(themeBuildDir, 'theme')
    }
}
export const getThemeNextBuildDir = async (themeModuleName: string) => {
    const themeBuildDir = await getThemeBuildDir(themeModuleName);
    if (themeBuildDir) {
        return resolve(themeBuildDir, '.next')
    }
}
export const getThemeAdminPanelBundleDir = async (themeModuleName: string, pageRoute: string) => {
    const themeBuildDir = await getThemeRollupBuildDir(themeModuleName);
    if (themeBuildDir) {
        return resolve(themeBuildDir, 'admin', pageRoute)
    }
}

export const getCmsModuleConfig = async <T = (TThemeConfig & TPluginConfig)>(moduleName: string): Promise<T | undefined> => {
    const path = await getNodeModuleDir(moduleName);
    if (path) {
        const configPath = resolve(path, configFileName);
        try {
            return require(configPath);
        } catch (e) {
            serverLogFor('errors-only', 'Failed to require module config at: ' + configPath, 'Error');
        }
    }
}

export const getMetaInfoPath = (filename: string) => `${filename}_meta.json`;

export const pluginFrontendBundlePath = 'frontend/index.js';
export const pluginFrontendCjsPath = 'frontend/cjs.js';
export const pluginAdminBundlePath = 'admin/index.js';
export const pluginAdminCjsPath = 'admin/cjs.js';
export const getPluginFrontendBundlePath = (distDir: string) => resolve(distDir, pluginFrontendBundlePath);
export const getPluginFrontendCjsPath = (distDir: string) => resolve(distDir, pluginFrontendCjsPath);
export const getPluginAdminBundlePath = (distDir: string) => resolve(distDir, pluginAdminBundlePath);
export const getPluginAdminCjsPath = (distDir: string) => resolve(distDir, pluginAdminCjsPath);
export const getPluginBackendPath = (distDir: string) => resolve(distDir, 'backend/index.js');
export const getThemePagesMetaPath = (distDir: string) => resolve(distDir, 'pages_meta.json');

export const getPublicDir = () => resolve(process.cwd(), 'public');
export const getPublicPluginsDir = () => resolve(getPublicDir(), 'plugins');
export const getPublicThemesDir = () => resolve(getPublicDir(), 'themes');


export const getModulePackage = (moduleName: string): any => {
    try {
        return require(`${moduleName}/package.json`);
    } catch (e) {
        serverLogFor('errors-only', 'Failed to resolve module path of: ' + moduleName + e, 'Error');
    }
}