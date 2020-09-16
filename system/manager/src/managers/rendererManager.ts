import { serviceLocator } from '@cromwell/core';
import {
    getRendererDir,
    getRendererSavedBuildDirByTheme,
    getRendererTempDir,
    getRendererTempNextDir,
    getThemeDirSync,
    rendererMessages,
} from '@cromwell/core-backend';
import axios from 'axios';
import { resolve } from 'path';

import managerConfig from '../config';
import { ManagerState } from '../managerState';
import { closeService, isServiceRunning, startService, swithArchivedBuildsSync } from './baseManager';

const { projectRootDir, cacheKeys, servicesEnv } = managerConfig;

type TRendererCommands = 'buildService' | 'dev' | 'build' | 'buildStart' | 'prod';
const rendererDir = getRendererDir(projectRootDir);
const rendererTempDir = getRendererTempDir(projectRootDir);
const rendererStartupPath = resolve(rendererDir, 'startup.js');

export const startRenderer = (cb?: (success: boolean) => void,
    onLog?: (message: string) => void) => {
    if (ManagerState.rendererStatus === 'busy' ||
        ManagerState.rendererStatus === 'building' ||
        ManagerState.rendererStatus === 'running') {
        onLog?.(`RendererManager:: Renderer is ${ManagerState.rendererStatus} now, failed to startRenderer`)
        cb?.(false);
        return;
    }
    const rendererUrl = serviceLocator.getFrontendUrl();

    if (servicesEnv.renderer) {
        const onOut = (data) => {
            // console.log(`stdout: ${data}`);
            onLog?.(data?.toString() ?? data);
        }
        ManagerState.rendererStatus = 'busy';
        const proc = startService(rendererStartupPath, cacheKeys.renderer, [servicesEnv.renderer], onOut)

        const onMessage = async (message: string) => {
            // console.log('rendererManager onMessage', message)
            if (message === rendererMessages.onStartMessage) {
                ManagerState.rendererStatus = 'busy';
                let success = false;
                try {
                    success = (await axios.get(rendererUrl)).status < 400;
                } catch (e) {
                    onLog?.(e);
                }
                proc.removeListener('message', onMessage);
                proc.stdout?.removeListener('data', onOut);
                proc.stderr?.removeListener('data', onOut);

                if (success) {
                    ManagerState.rendererStatus = 'running';
                } else {
                    ManagerState.rendererStatus = 'inactive';
                }
                if (success) onLog?.(`RendererManager:: Renderer has successfully started`);
                else onLog?.(`RendererManager:: Failed to start renderer`);

                // console.log('success', success);
                cb?.(success);
            }
            if (message === rendererMessages.onStartErrorMessage) {
                ManagerState.rendererStatus = 'inactive';
                const mess = 'RendererManager:: failed to start Renderer';
                onLog?.(mess);
                // console.log(mess);
                cb?.(false);
            }
        };

        proc?.on('message', onMessage);
    }
}

export const closeRenderer = (cb?: (success) => void, onLog?: (message: string) => void) => {
    closeService(cacheKeys.renderer, (success) => {
        if (!success) {
            onLog?.('RendererManager::closeRenderer: failed to close Renderer by pid. Renderer is still active');
        } else {
            ManagerState.rendererStatus = 'inactive';
            onLog?.('RendererManager::closeRenderer: Renderer has been closed');
        }
        cb?.(success);
    }, onLog);
}

export const isRendererRunning = (cb: (isActive: boolean) => void) => {
    isServiceRunning(cacheKeys.renderer, cb);
}

export const restartRenderer = (cb?: (success) => void, onLog?: (message: string) => void) => {
    closeRenderer((success) => {
        startRenderer(cb, onLog);
    }, onLog)
}

export const rendererBuildAndStart = (cb?: (success: boolean) => void,
    onLog?: (message: string) => void) => {
    if (ManagerState.rendererStatus === 'busy' ||
        ManagerState.rendererStatus === 'building') {
        onLog?.(`RendererManager:: Renderer is ${ManagerState.rendererStatus} now, failed to buildAndStart`)
        cb?.(false);
        return;
    }
    const rendererInitialStatus = ManagerState.rendererStatus;

    // ManagerState.rendererStatus = 'busy';
    // // Delete current build of the theme
    // const nextBuildDir = getRendererTempNextDir(projectRootDir);
    // if (fs.existsSync(nextBuildDir)) {
    //     onLog?.(`RendererManager:: removing current build ${nextBuildDir}`);
    //     fs.removeSync(nextBuildDir);
    // }
    ManagerState.rendererStatus = 'building';
    const commad: TRendererCommands = 'build';
    const onOut = (data) => {
        // console.log(`stdout: ${data}`);
        onLog?.(data?.toString() ?? data);
    }
    const proc = startService(rendererStartupPath, cacheKeys.rendererBuilder, [commad], onOut);
    let hasErrors = false;
    proc.on('message', (message: string) => {
        if (message === rendererMessages.onBuildErrorMessage) {
            ManagerState.rendererStatus = rendererInitialStatus;
            hasErrors = true;
        }
        if (message === rendererMessages.onBuildEndMessage) {
            ManagerState.rendererStatus = rendererInitialStatus;
            if (hasErrors) {
                const mess = 'RendererManager:: Renderer build failed';
                onLog?.(mess);
                cb?.(false);
                return;
            } else {
                restartRenderer(cb, onLog);
            }
        }
    });
}

export const rendererChangeTheme = (prevThemeName: string, nextThemeName: string, cb?: (success: boolean) => void,
    onLog?: (message: string) => void) => {
    if (ManagerState.rendererStatus === 'busy' ||
        ManagerState.rendererStatus === 'building') {
        onLog?.(`RendererManager:: Renderer is ${ManagerState.rendererStatus} now, aborting changeTheme process..`)
        cb?.(false);
        return;
    }
    const themeDir = getThemeDirSync(projectRootDir, nextThemeName);
    onLog?.(`RendererManager:: changeTheme: ${nextThemeName}, ${themeDir}`);
    if (themeDir) {
        const rendererInitialStatus = ManagerState.rendererStatus;

        ManagerState.rendererStatus = 'busy';

        const currentArchiveBuildDir = getRendererSavedBuildDirByTheme(projectRootDir, prevThemeName);
        const newArchiveBuildDir = getRendererSavedBuildDirByTheme(projectRootDir, nextThemeName);
        const currentBuildDir = getRendererTempNextDir(projectRootDir);

        const hasArchivedBuild = swithArchivedBuildsSync(currentArchiveBuildDir,
            newArchiveBuildDir, currentBuildDir, onLog);

        ManagerState.rendererStatus = rendererInitialStatus;

        if (hasArchivedBuild) {
            restartRenderer((success) => {
                cb?.(success);
            }, onLog);
        } else {
            rendererBuildAndStart((success) => {
                cb?.(success);
            }, onLog)
        }


    } else {
        cb?.(false)
    }
}