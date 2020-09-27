import { readCMSConfigSync, saveCMSConfigSync } from '@cromwell/core-backend';
import { ChildProcess, fork } from 'child_process';
import fs from 'fs-extra';
import isRunning from 'is-running';
import treeKill from 'tree-kill';

import managerConfig from '../config';
import { ManagerState } from '../managerState';
import { getProcessPid, saveProcessPid } from '../utils/cacheManager';
import { adminPanelChangeTheme, rebuildAdminPanelWeb } from './adminPanelManager';
import { rendererBuildAndStart, rendererChangeTheme } from './rendererManager';

const { projectRootDir } = managerConfig;

export const closeService = (name: string, cb?: (success: boolean) => void, onLog?: (message: string) => void) => {
    getProcessPid(name, (pid: number) => {
        treeKill(pid, 'SIGKILL', (err) => {
            if (err && onLog) onLog(err.message);
            if (err) {
                isServiceRunning(name, (isActive) => {
                    if (isActive) {
                        onLog?.(`BaseManager::closeService: failed to close service ${name} by pid. Service is still active!`);
                        cb?.(false);
                    } else {
                        onLog?.(`BaseManager::closeService: failed to close service ${name} by pid. Service already closed. Return success=true`);
                        cb?.(true);
                    }
                })
            } else {
                cb?.(true);
            }
        });
    })
}

export const startService = (path: string, name: string, args: string[], onLog?: (message: string) => void): ChildProcess => {
    const proc = fork(path, args, { stdio: 'pipe' });
    saveProcessPid(name, proc.pid);
    if (onLog) {
        proc?.stdout?.on('data', onLog);
        proc?.stderr?.on('data', onLog);
    }
    return proc;
}

export const isServiceRunning = (name: string, cb: (isActive: boolean) => void) => {
    getProcessPid(name, (pid: number) => {
        cb(isRunning(pid));
    })
}



export const changeTheme = (themeName: string, cb?: (success: boolean) => void,
    onLog?: (message: string) => void) => {

    onLog?.(`BaseManager:: changeTheme: ${themeName}`);

    if (ManagerState.adminPanelStatus === 'busy' ||
        ManagerState.adminPanelStatus === 'building') {
        onLog?.(`BaseManager::changeTheme: AdminPanel is ${ManagerState.adminPanelStatus} now, failed to changeTheme`)
        cb?.(false);
        return;
    }
    if (ManagerState.rendererStatus === 'busy' ||
        ManagerState.rendererStatus === 'building') {
        onLog?.(`BaseManager::changeTheme: Renderer is ${ManagerState.rendererStatus} now, failed to changeTheme`)
        cb?.(false);
        return;
    }

    let adminPanelSuccess: null | boolean = null;
    let rendererSuccess: null | boolean = null;

    let adminPanelRollbackSuccess: null | boolean = null;
    let rendererRollbackSuccess: null | boolean = null;


    const cmsconfig = readCMSConfigSync(projectRootDir);
    const prevThemeName = cmsconfig.themeName;
    const nextThemeName = themeName;

    // Save into CMS config
    cmsconfig.themeName = nextThemeName;
    onLog?.(`BaseManager:: saving CMS config with themeName: ${nextThemeName}`)
    saveCMSConfigSync(projectRootDir, cmsconfig);

    const tryToFinishRollback = () => {
        if (adminPanelRollbackSuccess !== null && rendererRollbackSuccess !== null) {
            cmsconfig.themeName = prevThemeName;
            saveCMSConfigSync(projectRootDir, cmsconfig);
            onLog?.(`BaseManager:: Rollback completed. Restored ${prevThemeName} theme`);
            cb?.(false);
        }
    }

    const tryToFinish = () => {
        if (adminPanelSuccess !== null && rendererSuccess !== null) {
            if (!adminPanelSuccess || !rendererSuccess) {
                onLog?.(`BaseManager:: At least one build failed. Cancelling theme changing. Rollback...`);
                rendererChangeTheme(nextThemeName, prevThemeName, (success) => {
                    rendererRollbackSuccess = success;
                    tryToFinishRollback();
                }, onLog);
                adminPanelChangeTheme(nextThemeName, prevThemeName, (success) => {
                    adminPanelRollbackSuccess = success;
                    tryToFinishRollback();
                }, onLog);

            } else {
                onLog?.(`BaseManager:: All builds succeeded. Applying changes...`);
                // ...
                onLog?.(`BaseManager:: Successfully applied new theme: ${themeName}`);
                cb?.(true);
            }
        }
    }

    rendererChangeTheme(prevThemeName, nextThemeName, (success) => {
        rendererSuccess = success;
        tryToFinish();
    }, onLog);

    adminPanelChangeTheme(prevThemeName, nextThemeName, (success) => {
        adminPanelSuccess = success;
        tryToFinish();
    }, onLog);
}

export const rebuildTheme = (cb?: (success: boolean) => void,
    onLog?: (message: string) => void) => {

    onLog?.(`BaseManager:: rebuildTheme start`);

    if (ManagerState.adminPanelStatus === 'busy' ||
        ManagerState.adminPanelStatus === 'building') {
        onLog?.(`BaseManager::rebuildTheme: AdminPanel is ${ManagerState.adminPanelStatus} now, failed to rebuildTheme`)
        cb?.(false);
        return;
    }
    if (ManagerState.rendererStatus === 'busy' ||
        ManagerState.rendererStatus === 'building') {
        onLog?.(`BaseManager::rebuildTheme: Renderer is ${ManagerState.rendererStatus} now, failed to rebuildTheme`)
        cb?.(false);
        return;
    }

    let adminPanelSuccess: null | boolean = null;
    let rendererSuccess: null | boolean = null;

    const tryToFinish = () => {
        if (adminPanelSuccess !== null && rendererSuccess !== null) {
            if (!adminPanelSuccess || !rendererSuccess) {
                onLog?.(`BaseManager:: at least one build failed.`);
                cb?.(false);
            } else {
                onLog?.(`BaseManager:: All builds succeeded`)
                cb?.(true);
            }
        }
    }

    rendererBuildAndStart((success) => {
        rendererSuccess = success;
        tryToFinish();
    }, onLog);

    rebuildAdminPanelWeb((success) => {
        adminPanelSuccess = success;
        tryToFinish();
    }, onLog);
}

export const swithArchivedBuildsSync = (prevArchiveBuildDir: string, nextArchiveBuildDir: string,
    currentBuildDir: string, onLog?: (message: string) => void): boolean => {

    let hasArchivedBuild = false;

    try {
        // Check for older build of current theme and delete
        if (fs.existsSync(prevArchiveBuildDir)) {
            onLog?.('BaseManager:: removing old archive: ' + prevArchiveBuildDir);
            fs.removeSync(prevArchiveBuildDir);
        }
        // Archive build of current theme
        if (fs.existsSync(currentBuildDir)) {
            onLog?.(`BaseManager:: archiving current build ${currentBuildDir} to: ${prevArchiveBuildDir}`);
            fs.copySync(currentBuildDir, prevArchiveBuildDir);
        }

        // Unarchive old build of the next theme if exists
        if (fs.existsSync(nextArchiveBuildDir)) {
            // Delete current build of the theme
            if (fs.existsSync(currentBuildDir)) {
                onLog?.(`BaseManager:: removing current build ${currentBuildDir}`);
                fs.removeSync(currentBuildDir);
            }

            onLog?.(`BaseManager:: unarchiving old build of a next theme ${nextArchiveBuildDir}`);
            fs.copySync(nextArchiveBuildDir, currentBuildDir);
            hasArchivedBuild = true;
        }
    } catch (e) {
        onLog?.(e);
        hasArchivedBuild = false;
    }

    return hasArchivedBuild;

}