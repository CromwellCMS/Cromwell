import { serviceLocator, TThemeConfig } from '@cromwell/core';
import {
    getRendererDir,
    getRendererTempDir,
    getNodeModuleDir,
    rendererMessages,
    buildDirName,
    getRendererStartupPath
} from '@cromwell/core-backend';
import axios from 'axios';
import { resolve } from 'path';
import fs from 'fs-extra';
import makeEmptyDir from 'make-empty-dir';

import managerConfig from '../config';
import { ManagerState } from '../managerState';
import { closeService, isServiceRunning, startService, swithArchivedBuilds } from './baseManager';

const { cacheKeys, servicesEnv } = managerConfig;

type TRendererCommands = 'buildService' | 'dev' | 'build' | 'buildStart' | 'prod';
const rendererDir = getRendererDir();
const rendererTempDir = getRendererTempDir();
const rendererStartupPath = getRendererStartupPath();

export const startRenderer = async (onLog?: (message: string) => void): Promise<boolean> => {
    if (ManagerState.rendererStatus === 'busy' ||
        ManagerState.rendererStatus === 'building' ||
        ManagerState.rendererStatus === 'running') {
        onLog?.(`RendererManager:: Renderer is ${ManagerState.rendererStatus} now, failed to startRenderer`)
        return false;
    }
    const rendererUrl = serviceLocator.getFrontendUrl();

    if (servicesEnv.renderer && rendererStartupPath) {
        const onOut = (data) => {
            // console.log(`stdout: ${data}`);
            onLog?.(data?.toString() ?? data);
        }
        ManagerState.rendererStatus = 'busy';
        const proc = startService(rendererStartupPath, cacheKeys.renderer, [servicesEnv.renderer], onOut, rendererDir)

        const onStartError = await new Promise(done => {
            const onMessage = async (message: string) => {
                // console.log('rendererManager onMessage', message)
                if (message === rendererMessages.onStartMessage) {
                    proc.removeListener('message', onMessage);
                    proc.stdout?.removeListener('data', onOut);
                    proc.stderr?.removeListener('data', onOut);
                    done(true);
                }
                if (message === rendererMessages.onStartErrorMessage) {
                    proc.removeListener('message', onMessage);
                    proc.stdout?.removeListener('data', onOut);
                    proc.stderr?.removeListener('data', onOut);
                    done(false);
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
                onLog?.(e);
            }

            if (success) {
                ManagerState.rendererStatus = 'running';
            } else {
                ManagerState.rendererStatus = 'inactive';
            }
            if (success) onLog?.(`RendererManager:: Renderer has successfully started`);
            else onLog?.(`RendererManager:: Failed to start renderer`);

            return success;

        } else {
            ManagerState.rendererStatus = 'inactive';
            const mess = 'RendererManager:: failed to start Renderer';
            onLog?.(mess);
            return false;
        }
    }

    return false;
}

export const closeRenderer = async (onLog?: (message: string) => void): Promise<boolean> => {
    const success = await closeService(cacheKeys.renderer, onLog);
    if (!success) {
        onLog?.('RendererManager::closeRenderer: failed to close Renderer by pid. Renderer is still active');
    } else {
        ManagerState.rendererStatus = 'inactive';
        onLog?.('RendererManager::closeRenderer: Renderer has been closed');
    }
    return success;
}

export const isRendererRunning = async (): Promise<boolean> => {
    return isServiceRunning(cacheKeys.renderer);
}

export const restartRenderer = async (onLog?: (message: string) => void): Promise<boolean> => {
    const success = await closeRenderer(onLog);
    return startRenderer(onLog);
}

export const rendererBuild = async (onLog?: (message: string) => void): Promise<boolean> => {
    if (!rendererStartupPath) return false;

    const commad: TRendererCommands = 'build';
    const onOut = (data) => {
        // console.log(`stdout: ${data}`);
        onLog?.(data?.toString() ?? data);
    }
    const proc = startService(rendererStartupPath, cacheKeys.rendererBuilder, [commad], onOut, rendererDir);

    await new Promise(done => {
        proc.on('message', async (message: string) => {
            if (message === rendererMessages.onBuildEndMessage) {
                done(true);
            }
        });
    })

    const success = await isThemeBuilt(getRendererTempDir());
    if (success) {
        onLog?.('RendererManager:: Renderer build succeeded');
    } else {
        onLog?.('RendererManager:: Renderer build failed');
    }

    return success;
}

export const rendererBuildAndStart = async (onLog?: (message: string) => void): Promise<boolean> => {

    if (ManagerState.rendererStatus === 'busy' ||
        ManagerState.rendererStatus === 'building') {
        onLog?.(`RendererManager:: Renderer is ${ManagerState.rendererStatus} now, failed to buildAndStart`)
        return false;
    }
    const rendererInitialStatus = ManagerState.rendererStatus;
    ManagerState.rendererStatus = 'building';

    const buildSuccess = await rendererBuild(onLog);
    if (buildSuccess) {
        const success = await restartRenderer(onLog);
        ManagerState.rendererStatus = rendererInitialStatus;
        return success;
    }

    return false;
}

export const rendererBuildAndSaveTheme = async (themeModuleName: string, onLog?: (message: string) => void): Promise<boolean> => {
    const tempDir = getRendererTempDir();
    const tempNextDir = resolve(tempDir, '.next');
    const themeDir = await getNodeModuleDir(themeModuleName);

    if (themeDir) {
        const buildSuccess = await rendererBuild(onLog);
        if (buildSuccess) {
            const themeBuildNextDir = resolve(themeDir, buildDirName, '.next');
            if (await fs.pathExists(themeBuildNextDir)) await fs.remove(themeBuildNextDir);
            await fs.move(tempNextDir, themeBuildNextDir);
            await fs.remove(tempDir);
            onLog?.('RendererManager:: successfully saved theme');
            return true;
        } else {

        }
    }



    return false;
}

export const rendererChangeTheme = async (nextThemeModuleName: string,
    onLog?: (message: string) => void): Promise<boolean> => {
    if (ManagerState.rendererStatus === 'busy' ||
        ManagerState.rendererStatus === 'building') {
        onLog?.(`RendererManager:: Renderer is ${ManagerState.rendererStatus} now, aborting changeTheme process..`)
        return false;
    }
    const themeDir = await getNodeModuleDir(nextThemeModuleName);

    onLog?.(`RendererManager:: changeTheme: ${nextThemeModuleName}, ${themeDir}`);
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


export const rendererStartWatchDev = async (onLog?: (message: string) => void) => {
    if (!rendererStartupPath) return false;

    if (ManagerState.rendererStatus === 'busy' ||
        ManagerState.rendererStatus === 'building') {
        onLog?.(`RendererManager:: Renderer is ${ManagerState.rendererStatus} now, failed to buildAndStart`)
        return false;
    }

    await closeRenderer(onLog);

    await makeEmptyDir(getRendererTempDir());

    const commad: TRendererCommands = 'dev';
    const proc = startService(rendererStartupPath, cacheKeys.renderer, [commad], onLog, rendererDir)
}

const isThemeBuilt = async (dir: string): Promise<boolean> => {
    return (await fs.pathExists(resolve(dir, '.next/static'))
        && await fs.pathExists(resolve(dir, '.next/BUILD_ID'))
        && await fs.pathExists(resolve(dir, '.next/build-manifest.json'))
        && await fs.pathExists(resolve(dir, '.next/prerender-manifest.json'))
    )
}