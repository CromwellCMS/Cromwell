import { serviceLocator } from '@cromwell/core';
import {
    buildDirName,
    getLogger,
    getNodeModuleDir,
    getRendererDir,
    getRendererStartupPath,
    getRendererTempDir,
    readCMSConfig,
    rendererMessages,
    getModulePackage
} from '@cromwell/core-backend';
import { getRestAPIClient } from '@cromwell/core-frontend';
import axios from 'axios';
import fs from 'fs-extra';
import makeEmptyDir from 'make-empty-dir';
import { resolve } from 'path';

import managerConfig from '../config';
import { checkModules } from '../helpers/checkModules';
import { TRendererCommands } from '../constants';
import { ManagerState } from '../managerState';
import { closeService, isServiceRunning, startService } from './baseManager';

const { cacheKeys, servicesEnv } = managerConfig;
const logger = getLogger('detailed');
const rendererDir = getRendererDir();
const rendererTempDir = getRendererTempDir();
const rendererStartupPath = getRendererStartupPath();
const errorLogger = getLogger('errors-only').error;

export const startRenderer = async (env?: TRendererCommands): Promise<boolean> => {
    if (ManagerState.rendererStatus === 'busy' ||
        ManagerState.rendererStatus === 'building' ||
        ManagerState.rendererStatus === 'running') {
        logger.error(`RendererManager:: Renderer is ${ManagerState.rendererStatus} now, failed to startRenderer`)
        return false;
    }

    const cmsSettings = await getRestAPIClient()?.getCmsSettings();
    const cmsConfig = await readCMSConfig();

    if (!cmsSettings) {
        errorLogger(`Failed to get cmsSettings from API server`);
    }
    const themeName = cmsSettings?.themeName ?? cmsSettings?.defaultSettings?.themeName ??
        cmsConfig?.defaultSettings?.themeName;

    if (!themeName) {
        errorLogger(`Failed to find active theme name`);
        return false;
    }

    const pckg = getModulePackage(themeName)
    if (pckg) await checkModules(Boolean(env === 'dev'), [pckg]);


    const rendererUrl = serviceLocator.getFrontendUrl();

    const rendererEnv = env ?? servicesEnv.renderer;
    if (rendererEnv && rendererStartupPath) {
        ManagerState.rendererStatus = 'busy';
        const proc = startService(rendererStartupPath, cacheKeys.renderer,
            [rendererEnv, `--theme-name=${themeName}`])

        const onStartError = await new Promise(done => {
            const onMessage = async (message: string) => {
                if (message === rendererMessages.onStartMessage) {
                    done(false);
                }
                if (message === rendererMessages.onStartErrorMessage) {
                    done(true);
                }
            };
            proc?.on('message', onMessage);
        });

        if (!onStartError) {
            ManagerState.rendererStatus = 'busy';
            let success = false;
            try {
                success = (await axios.get(rendererUrl)).status < 400;
            } catch (e) {
                logger.error(e);
            }

            if (success) {
                ManagerState.rendererStatus = 'running';
            } else {
                ManagerState.rendererStatus = 'inactive';
            }
            if (success) getLogger('errors-only').log(`Renderer has successfully started`);
            else errorLogger(`Failed to start renderer`);

            return success;

        } else {
            ManagerState.rendererStatus = 'inactive';
            const mess = 'RendererManager:: failed to start Renderer';
            errorLogger(mess);
            return false;
        }
    }

    return false;
}

export const closeRenderer = async (): Promise<boolean> => {
    if (await isRendererRunning()) {
        const success = await closeService(cacheKeys.renderer);
        if (!success) {
            logger.error('RendererManager::closeRenderer: failed to close Renderer by pid. Renderer is still active');
        } else {
            ManagerState.rendererStatus = 'inactive';
            logger.log('RendererManager::closeRenderer: Renderer has been closed');
        }
        return success;
    }
    return true;

}

export const isRendererRunning = async (): Promise<boolean> => {
    return isServiceRunning(cacheKeys.renderer);
}

export const restartRenderer = async (themeName: string): Promise<boolean> => {
    const success = await closeRenderer();
    return startRenderer();
}

export const rendererBuild = async (themeName: string): Promise<boolean> => {
    if (!rendererStartupPath) return false;

    const commad: TRendererCommands = 'build';
    const proc = startService(rendererStartupPath, cacheKeys.rendererBuilder,
        [commad, `--theme-name=${themeName}`]);

    await new Promise(done => {
        proc.on('message', async (message: string) => {
            if (message === rendererMessages.onBuildEndMessage) {
                done(true);
            }
        });
    })

    const success = await isThemeBuilt(getRendererTempDir());
    if (success) {
        logger.log('RendererManager:: Renderer build succeeded');
    } else {
        logger.error('RendererManager:: Renderer build failed');
    }

    return success;
}

export const rendererBuildAndStart = async (themeName: string): Promise<boolean> => {

    if (ManagerState.rendererStatus === 'busy' ||
        ManagerState.rendererStatus === 'building') {
        logger.error(`RendererManager:: Renderer is ${ManagerState.rendererStatus} now, failed to buildAndStart`)
        return false;
    }
    const rendererInitialStatus = ManagerState.rendererStatus;
    ManagerState.rendererStatus = 'building';

    const buildSuccess = await rendererBuild(themeName);
    if (buildSuccess) {
        const success = await restartRenderer(themeName);
        ManagerState.rendererStatus = rendererInitialStatus;
        return success;
    }

    return false;
}

export const rendererBuildAndSaveTheme = async (themeModuleName: string): Promise<boolean> => {
    const tempDir = getRendererTempDir();
    const tempNextDir = resolve(tempDir, '.next');
    const themeDir = await getNodeModuleDir(themeModuleName);

    if (themeDir) {
        const buildSuccess = await rendererBuild(themeModuleName);
        if (buildSuccess) {
            const themeBuildNextDir = resolve(themeDir, buildDirName, '.next');
            if (await fs.pathExists(themeBuildNextDir)) await fs.remove(themeBuildNextDir);
            await fs.move(tempNextDir, themeBuildNextDir);
            await fs.remove(tempDir);
            logger.log('RendererManager:: successfully saved theme');
            return true;
        } else {

        }
    }

    return false;
}


export const rendererStartWatchDev = async (themeName: string) => {
    if (!rendererStartupPath) return false;

    if (ManagerState.rendererStatus === 'busy' ||
        ManagerState.rendererStatus === 'building') {
        logger.error(`RendererManager:: Renderer is ${ManagerState.rendererStatus} now, failed to buildAndStart`)
        return false;
    }

    await closeRenderer();

    await makeEmptyDir(getRendererTempDir());

    const commad: TRendererCommands = 'dev';
    const proc = startService(rendererStartupPath, cacheKeys.renderer,
        [commad, `--theme-name=${themeName}`])
}

const isThemeBuilt = async (dir: string): Promise<boolean> => {
    return (await fs.pathExists(resolve(dir, '.next/static'))
        && await fs.pathExists(resolve(dir, '.next/BUILD_ID'))
        && await fs.pathExists(resolve(dir, '.next/build-manifest.json'))
        && await fs.pathExists(resolve(dir, '.next/prerender-manifest.json'))
    )
}

const applyNewTheme = async (nextThemeModuleName: string): Promise<boolean> => {
    if (ManagerState.rendererStatus === 'busy' ||
        ManagerState.rendererStatus === 'building') {
        logger.error(`RendererManager:: Renderer is ${ManagerState.rendererStatus} now, aborting changeTheme process..`)
        return false;
    }
    const themeDir = await getNodeModuleDir(nextThemeModuleName);

    logger.log(`RendererManager:: changeTheme: ${nextThemeModuleName}, ${themeDir}`);
    if (themeDir) {
        const themeBuildNextDir = resolve(themeDir, buildDirName, '.next');
        if (await fs.pathExists(themeBuildNextDir)) {

            ManagerState.rendererStatus = 'busy';

            await closeRenderer();

            await makeEmptyDir(rendererTempDir);
            const tempNextDir = resolve(rendererTempDir, '.next');
            fs.copy(themeBuildNextDir, tempNextDir);

            const success = await startRenderer();

            ManagerState.rendererStatus = 'running';

            return success;
        }
    }

    return false;
}


export const changeTheme = async (themeName: string): Promise<boolean> => {

    logger.log(`RendererManager:: changeTheme: ${themeName}`);

    if (ManagerState.rendererStatus === 'busy' ||
        ManagerState.rendererStatus === 'building') {
        logger.error(`RendererManager::changeTheme: Renderer is ${ManagerState.rendererStatus} now, failed to changeTheme`);
        return false;
    }

    const cmsSettings = await getRestAPIClient()?.getCmsSettings();
    if (!cmsSettings) {
        logger.error(`RendererManager::changeTheme: failed to get cmsSettings`);
        return false;
    }
    const prevThemeName = cmsSettings.themeName;
    const nextThemeName = themeName;

    // Save into CMS config
    logger.log(`RendererManager:: saving CMS config with themeName: ${nextThemeName}`)
    await getRestAPIClient()?.saveThemeName(themeName);

    const rendererSuccess = await applyNewTheme(nextThemeName);
    if (!rendererSuccess) {
        logger.error(`RendererManager:: Renderer build failed. Cancelling theme changing. Rollback...`);
        if (prevThemeName)
            await applyNewTheme(prevThemeName);

        await getRestAPIClient()?.saveThemeName(prevThemeName);
        logger.log(`RendererManager:: Rollback completed. Restored ${prevThemeName} theme`);
        return false;

    } else {
        logger.log(`RendererManager:: Build succeeded. Applied new theme: ${themeName}`);
        return true;
    }

}
