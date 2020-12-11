import { serviceLocator, TThemeConfig } from '@cromwell/core';
import {
    getRendererDir,
    getRendererSavedBuildDirByTheme,
    getRendererTempDir,
    getRendererTempNextDir,
    getThemeDir,
    getCurrentThemeDir,
    rendererMessages,
    buildDirName,
} from '@cromwell/core-backend';
import axios from 'axios';
import { resolve } from 'path';
import fs from 'fs-extra';
import makeEmptyDir from 'make-empty-dir';
import { rollupConfigWrapper } from '@cromwell/cromwella';
import { rollup } from 'rollup';

import managerConfig from '../config';
import { ManagerState } from '../managerState';
import { closeService, isServiceRunning, startService, swithArchivedBuilds } from './baseManager';

const { projectRootDir, cacheKeys, servicesEnv } = managerConfig;

type TRendererCommands = 'buildService' | 'dev' | 'build' | 'buildStart' | 'prod';
const rendererDir = getRendererDir(projectRootDir);
const rendererTempDir = getRendererTempDir(projectRootDir);
const rendererStartupPath = resolve(rendererDir, 'startup.js');

export const startRenderer = async (onLog?: (message: string) => void): Promise<boolean> => {
    if (ManagerState.rendererStatus === 'busy' ||
        ManagerState.rendererStatus === 'building' ||
        ManagerState.rendererStatus === 'running') {
        onLog?.(`RendererManager:: Renderer is ${ManagerState.rendererStatus} now, failed to startRenderer`)
        return false;
    }
    const rendererUrl = serviceLocator.getFrontendUrl();

    if (servicesEnv.renderer) {
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

export const rendererBuild = async (dir?: string, onLog?: (message: string) => void): Promise<boolean> => {

    const tempDirName = dir ?? buildDirName;

    const commad: TRendererCommands = 'build';
    const onOut = (data) => {
        // console.log(`stdout: ${data}`);
        onLog?.(data?.toString() ?? data);
    }
    const proc = startService(rendererStartupPath, cacheKeys.rendererBuilder, [commad, `--dir=${tempDirName}`], onOut, rendererDir);

    await new Promise(done => {
        proc.on('message', async (message: string) => {
            if (message === rendererMessages.onBuildEndMessage) {
                done(true);
            }
        });
    })

    const success = await isThemeBuilt(resolve(rendererDir, tempDirName));
    console.log('resolve(rendererDir, tempDirName)', resolve(rendererDir, tempDirName), success);
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

    const buildSuccess = await rendererBuild('.temp', onLog);
    if (buildSuccess) {
        const success = await restartRenderer(onLog);
        ManagerState.rendererStatus = rendererInitialStatus;
        return success;
    }

    return false;
}

export const rendererBuildAndSaveTheme = async (onLog?: (message: string) => void): Promise<boolean> => {
    const tempDirName = '.temp';
    const tempDir = resolve(rendererDir, tempDirName);
    const tempNextDir = resolve(tempDir, '.next');
    const themeDir = await getCurrentThemeDir(projectRootDir);

    let rollupBuildSuccess = false;
    if (themeDir) {
        const configPath = resolve(themeDir, 'cromwell.config.js');
        try {
            const config: TThemeConfig = require(configPath);
            if (config?.rollupConfig?.main) {
                onLog?.('RendererManager:: Starting to pre-build theme');

                const rollupConfig = rollupConfigWrapper(config.rollupConfig.main, config, config.rollupConfig);
                for (const optionsObj of rollupConfig) {
                    const bundle = await rollup(optionsObj);

                    if (optionsObj?.output && Array.isArray(optionsObj?.output)) {
                        await Promise.all(optionsObj.output.map(bundle.write));

                    } else if (optionsObj?.output && typeof optionsObj?.output === 'object') {
                        //@ts-ignore
                        await bundle.write(optionsObj.output)
                    }
                }
                rollupBuildSuccess = true;
            }
        } catch (e) {
            console.log(e);
        }
    }

    if (!rollupBuildSuccess) {
        onLog?.('RendererManager:: Failed to pre-build theme');
        return false;
    }
    onLog?.('RendererManager:: Successfully pre-build theme');


    const buildSuccess = await rendererBuild(tempDirName, onLog);
    if (buildSuccess) {
        if (themeDir) {
            const themeBuildNextDir = resolve(themeDir, buildDirName, '.next');
            if (await fs.pathExists(themeBuildNextDir)) await fs.remove(themeBuildNextDir);
            await fs.move(tempNextDir, themeBuildNextDir);
            await fs.remove(tempDir);
            onLog?.('RendererManager:: successfully saved theme');
            return true;
        }
    } else {

    }

    return false;
}

export const rendererChangeTheme = async (prevThemeName: string, nextThemeName: string,
    onLog?: (message: string) => void): Promise<boolean> => {
    if (ManagerState.rendererStatus === 'busy' ||
        ManagerState.rendererStatus === 'building') {
        onLog?.(`RendererManager:: Renderer is ${ManagerState.rendererStatus} now, aborting changeTheme process..`)
        return false;
    }
    const themeDir = await getThemeDir(projectRootDir, nextThemeName);

    onLog?.(`RendererManager:: changeTheme: ${nextThemeName}, ${themeDir}`);
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

const isThemeBuilt = async (dir: string): Promise<boolean> => {
    return (await fs.pathExists(resolve(dir, '.next/static'))
        && await fs.pathExists(resolve(dir, '.next/BUILD_ID'))
        && await fs.pathExists(resolve(dir, '.next/build-manifest.json'))
        && await fs.pathExists(resolve(dir, '.next/prerender-manifest.json'))
    )
}