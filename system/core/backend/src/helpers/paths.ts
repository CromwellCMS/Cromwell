import { resolve } from 'path';
import fs from 'fs-extra';

export const getThemeDirSync = (projectRootDir: string, themeName: string): string | undefined => {
    const dir = resolve(projectRootDir, 'themes', themeName);
    if (fs.existsSync(dir)) {
        return dir;
    }
}

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