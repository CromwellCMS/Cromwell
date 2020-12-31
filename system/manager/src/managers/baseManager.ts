import { getRestAPIClient } from '@cromwell/core-frontend';
import { ChildProcess, fork } from 'child_process';
import fs from 'fs-extra';
import isRunning from 'is-running';
import treeKill from 'tree-kill';

import { ManagerState } from '../managerState';
import { getProcessPid, saveProcessPid } from '../utils/cacheManager';
import { rendererBuildAndStart, rendererChangeTheme } from './rendererManager';

export const closeService = async (name: string, onLog?: (message: string) => void): Promise<boolean> => {
    return new Promise(done => {
        getProcessPid(name, (pid: number) => {
            treeKill(pid, 'SIGKILL', async (err) => {
                if (err && onLog) onLog(err.message);
                if (err) {
                    const isActive = await isServiceRunning(name);
                    if (isActive) {
                        onLog?.(`BaseManager::closeService: failed to close service ${name} by pid. Service is still active!`);
                        done(false);
                    } else {
                        onLog?.(`BaseManager::closeService: failed to close service ${name} by pid. Service already closed. Return success=true`);
                        done(true);
                    }
                } else {
                    done(true);
                }
            });
        })
    })

}

export const startService = (path: string, name: string, args: string[], onLog?: (message: string) => void, dir?: string): ChildProcess => {
    const proc = fork(path, args, { stdio: 'pipe', cwd: dir ?? process.cwd() });
    saveProcessPid(name, proc.pid);
    if (onLog) {
        const onLogBuffer = buff => onLog(buff?.toString?.() ?? buff);
        proc?.stdout?.on('data', onLogBuffer);
        proc?.stderr?.on('data', onLogBuffer);
    }
    return proc;
}

export const isServiceRunning = (name: string): Promise<boolean> => {
    return new Promise(done => {
        getProcessPid(name, (pid: number) => {
            done(isRunning(pid));
        })
    })
}


export const changeTheme = async (themeName: string, onLog?: (message: string) => void): Promise<boolean> => {

    onLog?.(`BaseManager:: changeTheme: ${themeName}`);

    if (ManagerState.rendererStatus === 'busy' ||
        ManagerState.rendererStatus === 'building') {
        onLog?.(`BaseManager::changeTheme: Renderer is ${ManagerState.rendererStatus} now, failed to changeTheme`);
        return false;
    }

    const cmsSettings = await getRestAPIClient()?.getCmsSettings();
    if (!cmsSettings) {
        onLog?.(`BaseManager::changeTheme: failed to get cmsSettings`);
        return false;
    }
    const prevThemeName = cmsSettings.themeName;
    const nextThemeName = themeName;

    // Save into CMS config
    onLog?.(`BaseManager:: saving CMS config with themeName: ${nextThemeName}`)
    await getRestAPIClient()?.saveThemeName(themeName);

    const rendererSuccess = await rendererChangeTheme(nextThemeName, onLog);
    if (!rendererSuccess) {
        onLog?.(`BaseManager:: At least one build failed. Cancelling theme changing. Rollback...`);
        if (prevThemeName)
            await rendererChangeTheme(prevThemeName, onLog);

        await getRestAPIClient()?.saveThemeName(prevThemeName);
        onLog?.(`BaseManager:: Rollback completed. Restored ${prevThemeName} theme`);
        return false;

    } else {
        onLog?.(`BaseManager:: Build succeeded. Applying changes...`);
        // ...
        onLog?.(`BaseManager:: Successfully applied new theme: ${themeName}`);
        return true;
    }

}

export const rebuildTheme = async (onLog?: (message: string) => void): Promise<boolean> => {

    onLog?.(`BaseManager:: rebuildTheme start`);

    if (ManagerState.adminPanelStatus === 'busy' ||
        ManagerState.adminPanelStatus === 'building') {
        onLog?.(`BaseManager::rebuildTheme: AdminPanel is ${ManagerState.adminPanelStatus} now, failed to rebuildTheme`)
        return false;
    }
    if (ManagerState.rendererStatus === 'busy' ||
        ManagerState.rendererStatus === 'building') {
        onLog?.(`BaseManager::rebuildTheme: Renderer is ${ManagerState.rendererStatus} now, failed to rebuildTheme`)
        return false;
    }

    const rendererSuccess = await rendererBuildAndStart(onLog);

    if (!rendererSuccess) {
        onLog?.(`BaseManager::rebuildTheme: build failed.`);
        return false;
    } else {
        onLog?.(`BaseManager::rebuildTheme: build succeeded`)
        return true;
    }

}

export const swithArchivedBuilds = async (prevArchiveBuildDir: string, nextArchiveBuildDir: string,
    currentBuildDir: string, onLog?: (message: string) => void): Promise<boolean> => {

    let hasArchivedBuild = false;

    try {
        // Check for older build of current theme and delete
        if (await fs.pathExists(prevArchiveBuildDir)) {
            onLog?.('BaseManager:: removing old archive: ' + prevArchiveBuildDir);
            await fs.remove(prevArchiveBuildDir);
        }
        // Archive build of current theme
        if (await fs.pathExists(currentBuildDir)) {
            onLog?.(`BaseManager:: archiving current build ${currentBuildDir} to: ${prevArchiveBuildDir}`);
            await fs.copy(currentBuildDir, prevArchiveBuildDir);
        }

        // Unarchive old build of the next theme if exists
        if (await fs.pathExists(nextArchiveBuildDir)) {
            // Delete current build of the theme
            if (await fs.pathExists(currentBuildDir)) {
                onLog?.(`BaseManager:: removing current build ${currentBuildDir}`);
                await fs.remove(currentBuildDir);
            }

            onLog?.(`BaseManager:: unarchiving old build of a next theme ${nextArchiveBuildDir}`);
            await fs.copy(nextArchiveBuildDir, currentBuildDir);
            hasArchivedBuild = true;
        }
    } catch (e) {
        onLog?.(e);
        hasArchivedBuild = false;
    }

    return hasArchivedBuild;

}