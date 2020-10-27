import { resolve } from 'path';
import fs from 'fs-extra';

export const getThemeDirSync = (projectRootDir: string, themeName: string): string | undefined => {
    const dir = resolve(projectRootDir, 'themes', themeName);
    if (fs.existsSync(dir)) {
        return dir;
    }
}

export const buildDirName = '.cromwell';

export const getMetaInfoPath = (filename: string) => `${filename}_meta.json`;

export const getPluginFrontendBundlePath = (distDir: string) => resolve(distDir, 'frontend/index.js');
export const getPluginFrontendCjsPath = (distDir: string) => resolve(distDir, 'frontend/cjs.js');
export const getPluginBackendPath = (distDir: string) => resolve(distDir, 'backend/index.js');

export const getThemePagesMetaPath = (distDir: string) => resolve(distDir, 'pages_meta.json');


export const getCMSConfigPath = (projectRootDir: string) =>
    resolve(projectRootDir, 'system/cmsconfig.json');

export const getPluginsDir = (projectRootDir: string) =>
    resolve(projectRootDir, 'plugins');


const renderDirChunk = 'system/renderer';

export const getRendererDir = (projectRootDir: string) =>
    resolve(projectRootDir, renderDirChunk);

export const getRendererTempDir = (projectRootDir: string) =>
    resolve(projectRootDir, renderDirChunk, '.cromwell');

export const getRendererBuildDir = (projectRootDir: string) =>
    resolve(projectRootDir, renderDirChunk, 'build');

export const getRendererTempNextDir = (projectRootDir: string) =>
    resolve(projectRootDir, renderDirChunk, '.cromwell/.next');

export const getRendererSavedBuildDirByTheme = (projectRootDir: string, themeName: string) =>
    resolve(projectRootDir, renderDirChunk, '.cromwell/old', themeName);



const adminPanelDirChunk = 'system/admin-panel';

export const getAdminPanelDir = (projectRootDir: string) =>
    resolve(projectRootDir, adminPanelDirChunk);

export const getAdminPanelServiceBuildDir = (projectRootDir: string) =>
    resolve(projectRootDir, adminPanelDirChunk, 'build');

export const getAdminPanelGeneratorOutDir = (projectRootDir: string) =>
    resolve(projectRootDir, adminPanelDirChunk, '.cromwell/imports');

export const getAdminPanelWebStaticDir = (projectRootDir: string) =>
    resolve(projectRootDir, adminPanelDirChunk, '.cromwell/static');

export const getAdminPanelWebPublicDir = (projectRootDir: string) =>
    resolve(getAdminPanelWebStaticDir(projectRootDir), 'public');

export const getAdminPanelWebBuildProd = (projectRootDir: string) =>
    resolve(getAdminPanelWebStaticDir(projectRootDir), 'build/prod');

export const getAdminPanelWebBuildDev = (projectRootDir: string) =>
    resolve(getAdminPanelWebStaticDir(projectRootDir), 'build/dev');

export const getAdminPanelSavedBuildDirByTheme = (projectRootDir: string, themeName: string) =>
    resolve(projectRootDir, adminPanelDirChunk, '.cromwell/old', themeName);

const serverDirChunk = 'system/server';

export const getServerDir = (projectRootDir: string) =>
    resolve(projectRootDir, serverDirChunk);