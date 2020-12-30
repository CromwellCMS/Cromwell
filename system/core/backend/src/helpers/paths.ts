import { resolve } from 'path';
import fs from 'fs-extra';
import { serverLogFor } from './constants';
import { TThemeConfig } from '@cromwell/core';

export const buildDirName = '.cromwell';
export const configFileName = 'cromwell.config.js';

export const getThemeDir = async (projectRootDir: string, themeName: string): Promise<string | undefined> => {
    const dir = resolve(getThemesDir(projectRootDir), themeName);
    if (await fs.pathExists(dir)) {
        return dir;
    }
}

export const getThemeConfig = async (projectRootDir: string, themeName: string): Promise<TThemeConfig | undefined> => {
    const path = await getThemeDir(projectRootDir, themeName);
    if (path) {
        const configPath = resolve(path, configFileName);
        try {
            return require(configPath);
        } catch (e) {
            serverLogFor('errors-only', 'Failed to require theme config at: ' + configPath, 'Error');
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

export const cmsConfigFileName = 'cmsconfig.json';
export const getCMSConfigPath = (projectRootDir: string) =>
    resolve(projectRootDir, 'system', cmsConfigFileName);

export const getPluginsDir = (projectRootDir: string) =>
    resolve(projectRootDir, 'plugins');

export const getThemesDir = (projectRootDir: string) =>
    resolve(projectRootDir, 'themes');


const renderDirChunk = 'system/renderer';

export const getRendererDir = (projectRootDir: string) =>
    resolve(projectRootDir, renderDirChunk);

export const getRendererTempDir = (projectRootDir: string) =>
    resolve(projectRootDir, renderDirChunk, buildDirName);

export const getRendererBuildDir = (projectRootDir: string) =>
    resolve(projectRootDir, renderDirChunk, 'build');

export const getRendererTempNextDir = (projectRootDir: string) =>
    resolve(projectRootDir, renderDirChunk, buildDirName, '.next');

export const getRendererSavedBuildDirByTheme = (projectRootDir: string, themeName: string) =>
    resolve(projectRootDir, renderDirChunk, buildDirName, 'old', themeName);



const adminPanelDirChunk = 'system/admin-panel';

export const getAdminPanelDir = (projectRootDir: string) =>
    resolve(projectRootDir, adminPanelDirChunk);

export const getAdminPanelServiceBuildDir = (projectRootDir: string) =>
    resolve(projectRootDir, adminPanelDirChunk, 'build');

export const getAdminPanelWebBuildDir = (projectRootDir: string) =>
    resolve(getAdminPanelDir(projectRootDir), buildDirName);

export const getAdminPanelWebServiceBuildDir = (projectRootDir: string) =>
    resolve(getAdminPanelDir(projectRootDir), buildDirName, 'build');

export const getAdminPanelWebPublicDir = (projectRootDir: string) =>
    resolve(getAdminPanelWebBuildDir(projectRootDir), 'public');



const serverDirChunk = 'system/server';

export const getServerDir = (projectRootDir: string) =>
    resolve(projectRootDir, serverDirChunk);