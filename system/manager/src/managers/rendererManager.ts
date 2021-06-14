import { serviceLocator, sleep, TCmsSettings, TPageInfo } from '@cromwell/core';
import {
    buildDirName,
    getLogger,
    getNodeModuleDir,
    getRendererStartupPath,
    getRendererTempDir,
    getThemeAdminPanelDir,
    getThemeBuildDir,
    getThemeRollupBuildDir,
    getThemeTempAdminPanelDir,
    readCMSConfig,
    rendererMessages,
} from '@cromwell/core-backend';
import { getRestAPIClient } from '@cromwell/core-frontend';
import fs from 'fs-extra';
import fetch, { Response } from 'node-fetch';
import { resolve } from 'path';
import tcpPortUsed from 'tcp-port-used';

import managerConfig from '../config';
import { TRendererCommands } from '../constants';
import { closeService, isPortUsed, isServiceRunning, startService } from './baseManager';

const { cacheKeys, servicesEnv } = managerConfig;
const logger = getLogger();
const rendererStartupPath = getRendererStartupPath();

export const startRenderer = async (command?: TRendererCommands, options?: {
    serverPort?: string | number;
}): Promise<boolean> => {

    const cmsConfig = await readCMSConfig();
    let cmsSettings: TCmsSettings | undefined;
    try {
        cmsSettings = await getRestAPIClient()?.getCmsSettings({ disableLog: true });
    } catch (error) {
        logger.error(error);
    }

    if (!cmsConfig?.frontendPort) {
        const message = 'Manager: Failed to start Renderer: frontendPort in cmsconfig is not defined';
        logger.error(message);
        throw new Error(message);
    }

    const isBuild = command === 'build' || command === 'buildService';

    if (!isBuild && await isPortUsed(cmsConfig.frontendPort)) {
        const message = `Manager: Failed to start Renderer: frontendPort ${cmsConfig.frontendPort} is already in use. You may want to run close command: cromwell close --sv renderer`;
        logger.error(message);
        throw new Error(message);
    }

    if (!cmsSettings) {
        logger.error(`Failed to get cmsSettings from API server. Renderer will be launched with default theme`);
    }

    const themeName = cmsSettings?.themeName ?? cmsSettings?.defaultSettings?.themeName ??
        cmsConfig?.defaultSettings?.themeName;

    if (!themeName) {
        logger.error(`Failed to find active theme name`);
        return false;
    }

    const rendererUrl = serviceLocator.getFrontendUrl();
    const rendererEnv = command ?? servicesEnv.renderer;

    if (rendererEnv && rendererStartupPath) {
        const rendererProc = await startService({
            path: rendererStartupPath,
            name: cacheKeys.renderer,
            args: [rendererEnv,
                `--theme-name=${themeName}`,
                options?.serverPort ? `--server-port=${options.serverPort}` : ''
            ],
            sync: command === 'build' ? true : false,
            watchName: !isBuild ? 'renderer' : undefined,
            onVersionChange: async () => {
                if (cmsConfig.useWatch) {
                    await closeRenderer();
                    try {
                        await tcpPortUsed.waitUntilFree(cmsConfig.frontendPort, 500, 4000);
                    } catch (e) { logger.error(e) }
                    await startRenderer(command, options);
                }
            }
        });

        if (command === 'build') return true;

        const onStartError = await new Promise(done => {
            const onMessage = async (message: string) => {
                if (message === rendererMessages.onStartMessage) {
                    done(false);
                }
                if (message === rendererMessages.onStartErrorMessage) {
                    done(true);
                }
            };
            rendererProc?.on('message', onMessage);
        });

        if (!onStartError) {
            if (!rendererUrl) return false;
            let success = false;
            try {
                const responce: Response = await fetch(rendererUrl);
                success = responce.status < 400;
            } catch (e) {
                logger.error(e);
            }

            await pollPages();

            if (success) logger.info(`Renderer has successfully started`);
            else logger.error(`Failed to start renderer`);
            return success;

        } else {
            const mess = 'RendererManager:: failed to start Renderer';
            logger.error(mess);
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
            logger.log('RendererManager::closeRenderer: Renderer has been closed');
        }
        return success;
    }
    return true;

}

export const isRendererRunning = async (): Promise<boolean> => {
    return isServiceRunning(cacheKeys.renderer);
}

export const rendererBuild = async (themeName: string): Promise<boolean> => {
    if (!rendererStartupPath) return false;

    const commad: TRendererCommands = 'build';

    const proc = await startService({
        path: rendererStartupPath,
        name: cacheKeys.rendererBuilder,
        args: [commad, `--theme-name=${themeName}`],
    });

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

export const rendererBuildAndSaveTheme = async (themeModuleName: string): Promise<boolean> => {
    const tempDir = getRendererTempDir();
    const tempNextDir = resolve(tempDir, '.next');

    const themeDir = await getNodeModuleDir(themeModuleName);
    if (!themeDir) return false;

    const buildSuccess = await rendererBuild(themeModuleName);
    if (!buildSuccess) return false;

    // Clean old build
    const themeBuildDir = await getThemeBuildDir(themeModuleName);
    if (themeBuildDir && await fs.pathExists(themeBuildDir)) {
        try {
            await fs.remove(themeBuildDir);
        } catch (e) {
            logger.error(e);
        }
        await sleep(0.1);
    }

    const themeBuildNextDir = resolve(themeDir, buildDirName, '.next');
    await sleep(0.1);
    try {
        if (await fs.pathExists(themeBuildNextDir)) await fs.remove(themeBuildNextDir);
    } catch (e) {
        logger.error(e);
    }
    await sleep(0.2);

    const nextCacheDir = resolve(tempNextDir, 'cache');
    if (await fs.pathExists(nextCacheDir)) await fs.remove(nextCacheDir);
    await sleep(0.1);

    await fs.move(tempNextDir, themeBuildNextDir);
    await sleep(0.2);

    const themeRollupBuildDir = await getThemeRollupBuildDir(themeModuleName);
    const themeTempAdminBuildDir = getThemeTempAdminPanelDir();
    const adminBuildDir = await getThemeAdminPanelDir(themeModuleName);

    if (themeRollupBuildDir) {
        if (await fs.pathExists(themeRollupBuildDir)) await fs.remove(themeRollupBuildDir);
        await sleep(0.2);

        if (themeTempAdminBuildDir && adminBuildDir &&
            await fs.pathExists(themeTempAdminBuildDir)) {
            await fs.move(themeTempAdminBuildDir, adminBuildDir);
        }
    }

    await fs.remove(tempDir);
    await sleep(0.1);

    logger.log('RendererManager:: successfully saved theme');
    return true;
}


export const rendererStartWatchDev = async (themeName: string) => {
    if (!rendererStartupPath) return false;

    await closeRenderer();
    const rendererTempDir = getRendererTempDir();
    await fs.ensureDir(rendererTempDir);

    const commad: TRendererCommands = 'dev';

    await startService({
        path: rendererStartupPath,
        name: cacheKeys.renderer,
        args: [commad, `--theme-name=${themeName}`],
    });
}

const isThemeBuilt = async (dir: string): Promise<boolean> => {
    return (await fs.pathExists(resolve(dir, '.next/static'))
        && await fs.pathExists(resolve(dir, '.next/BUILD_ID'))
        && await fs.pathExists(resolve(dir, '.next/build-manifest.json'))
        && await fs.pathExists(resolve(dir, '.next/prerender-manifest.json'))
    )
}

/** Poll all routes to make Next.js server generate and cache pages */
const pollPages = async () => {
    let infos: TPageInfo[] | undefined;
    try {
        infos = await getRestAPIClient().getPagesInfo();
    } catch (error) {
        logger.error(error);
    }
    if (!infos) return;

    const promises = infos.map(async (info) => {
        for (let i = 0; i < 2; i++) {
            let pageRoute = info.route.replace('[slug]', 'test');
            if (pageRoute === 'index') pageRoute = '';

            const pageUrl = serviceLocator.getFrontendUrl() + '/' + pageRoute;
            try {
                await fetch(pageUrl);
            } catch (e) {
                logger.error(e);
            }
        }
    });

    await Promise.all(promises);
}