import { TModuleConfig, TPackageCromwellConfig, TPackageJson } from '@cromwell/core';
import fs from 'fs-extra';
import { dirname, isAbsolute, resolve } from 'path';

import { serverLogFor } from './constants';

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
export const getOrmConfigPath = () => resolve(process.cwd(), 'ormconfig.json');
export const getServerTempDir = () => resolve(getTempDir(), 'server');


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
export const getThemeAdminPanelBundleDir = async (themeModuleName: string, pageRoute: string) => {
    const themeBuildDir = await getThemeRollupBuildDir(themeModuleName);
    if (themeBuildDir) {
        return resolve(themeBuildDir, 'admin', pageRoute)
    }
}

export const getCmsModuleConfig = async (moduleName?: string): Promise<TModuleConfig | undefined> => {
    const path = moduleName ? await getNodeModuleDir(moduleName) : process.cwd();
    if (path) {
        const configPath = resolve(path, configFileName);
        try {
            return require(configPath);
        } catch (e) {
            serverLogFor('errors-only', 'Failed to require module config at: ' + configPath, 'Error');
        }
    }
}

export const getCmsModuleInfo = (moduleName?: string): TPackageCromwellConfig | undefined => {
    const pckg = getModulePackage(moduleName);
    if (pckg?.cromwell) {
        if (!pckg.cromwell.name) pckg.cromwell.name = pckg.name;
        return pckg.cromwell;
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


export const getModulePackage = (moduleName?: string): TPackageJson | undefined => {
    if (!moduleName) moduleName = process.cwd();
    try {
        return require(`${moduleName}/package.json`);
    } catch (e) {
        serverLogFor('errors-only', 'Failed to resolve module path of: ' + moduleName + e, 'Error');
    }
}