import { startService, closeService } from './baseManager';
import { resolve } from 'path';
import config from '../config';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import fs from 'fs-extra';
import {
    serviceLocator, apiV1BaseRoute
} from '@cromwell/core';
import {
    getThemeDirSync, saveCMSConfigSync, getCMSConfigSync,
    getRendererDir, getRendererTempDir, getRendererTempNextDir,
    getRendererSavedBuildDirByTheme, rendererMessages
} from '@cromwell/core-backend';
import { ManagerState } from '../managerState';
const { projectRootDir, cacheKeys, servicesEnv } = config;

type TRendererCommands = 'buildService' | 'dev' | 'build' | 'buildStart' | 'prod';
const rendererDir = getRendererDir(projectRootDir);
const rendererTempDir = getRendererTempDir(projectRootDir);
const rendererStartupPath = resolve(rendererDir, 'startup.js');

export const startRenderer = (cb?: (success: boolean) => void,
    onLog?: (message: string) => void) => {
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

export const closeRenderer = (cb?: (success) => void) => {
    closeService(cacheKeys.renderer, (success) => {
        ManagerState.rendererStatus = 'inactive';
        cb?.(success);
    });
}

export const buildAndStart = (cb?: (success: boolean) => void,
    onLog?: (message: string) => void) => {
    closeService(cacheKeys.renderer, () => {
        ManagerState.rendererStatus = 'building';
        const commad: TRendererCommands = 'build';
        const onOut = (data) => {
            // console.log(`stdout: ${data}`);
            onLog?.(data?.toString() ?? data);
        }
        const proc = startService(rendererStartupPath, cacheKeys.renderer, [commad], onOut);
        let hasErrors = false;
        proc.on('message', (message: string) => {
            if (message === rendererMessages.onBuildErrorMessage) {
                hasErrors = true;
            }
            if (message === rendererMessages.onBuildEndMessage) {
                if (hasErrors) {
                    ManagerState.rendererStatus = 'inactive';
                    const mess = 'RendererManager:: Renderer build failed';
                    onLog?.(mess);
                    cb?.(false);
                    return;
                } else {
                    startRenderer(cb, onLog);
                }
            }
        });
    });
}

export const changeTheme = (themeName: string, cb?: (success: boolean) => void,
    onLog?: (message: string) => void) => {
    if (ManagerState.rendererStatus === 'busy' ||
        ManagerState.rendererStatus === 'building') {
        onLog?.(`RendererManager:: Renderer is ${ManagerState.rendererStatus} now, aborting changeTheme process..`)
        return;
    }
    const themeDir = getThemeDirSync(projectRootDir, themeName);
    const config = getCMSConfigSync(projectRootDir);
    onLog?.(`RendererManager:: changeTheme: ${themeName}, ${themeDir}`);
    if (themeDir && config) {
        ManagerState.rendererStatus = 'busy';
        const currentThemeName = config.themeName;
        const newThemeName = themeName;

        const currentArchiveBuildDir = getRendererSavedBuildDirByTheme(projectRootDir, currentThemeName);
        const newArchiveBuildDir = getRendererSavedBuildDirByTheme(projectRootDir, newThemeName);
        let hasBuilt = false;
        try {
            // Check for older build of current theme and delete
            if (fs.existsSync(currentArchiveBuildDir)) {
                onLog?.('RendererManager:: removing current archive: ' + currentArchiveBuildDir);
                fs.removeSync(currentArchiveBuildDir);
            }
            // Archive build of current theme
            const nextBuildDir = getRendererTempNextDir(projectRootDir);
            if (fs.existsSync(nextBuildDir)) {
                onLog?.(`RendererManager:: archiving current build ${nextBuildDir} to: ${currentArchiveBuildDir}`);
                fs.copySync(nextBuildDir, currentArchiveBuildDir);
            }
            // Delete current build of the theme
            if (fs.existsSync(nextBuildDir)) {
                onLog?.(`RendererManager:: removing current build ${nextBuildDir}`);
                fs.removeSync(nextBuildDir);
            }


            // Unarchive old build of the new theme if exists
            if (fs.existsSync(newArchiveBuildDir)) {
                onLog?.(`RendererManager:: unarchiving old build of a new theme ${newArchiveBuildDir}`);
                fs.copySync(newArchiveBuildDir, nextBuildDir);
                fs.removeSync(newArchiveBuildDir);
                hasBuilt = true;
            }

            // Save into CMS config
            config.themeName = themeName;
            onLog?.(`RendererManager:: saving CMS config with themeName: ${newThemeName}`)
            saveCMSConfigSync(projectRootDir, config);
        } catch (e) {
            onLog?.(e);
            ManagerState.rendererStatus = 'inactive';
            hasBuilt = false;
        }

        closeRenderer((success) => {
            if (hasBuilt) {
                startRenderer((success) => {
                    if (success) onLog?.(`RendererManager:: Renderer successfully started`);
                    else onLog?.(`RendererManager:: Failed to start renderer`);
                    cb?.(success);
                }, onLog);
            } else {
                buildAndStart((success) => {
                    if (success) onLog?.(`RendererManager:: Renderer successfully started`);
                    else onLog?.(`RendererManager:: Failed to start renderer`);
                    cb?.(success);
                }, onLog)
            }
        });
    } else {
        cb?.(false)
    }
}