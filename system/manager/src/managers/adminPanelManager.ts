import {
    adminPanelMessages,
    getAdminPanelDir,
    getAdminPanelSavedBuildDirByTheme,
    getAdminPanelWebBuildProd,
} from '@cromwell/core-backend';
import { resolve } from 'path';

import config from '../config';
import { ManagerState } from '../managerState';
import { closeService, startService, swithArchivedBuildsSync } from './baseManager';

const { projectRootDir, cacheKeys, servicesEnv } = config;

type TAdminPanelCommands = 'buildService' | 'build' | 'dev' | 'prod';

const adminPanelDir = getAdminPanelDir(projectRootDir);
const adminPanelStartupPath = resolve(adminPanelDir, 'startup.js');

export const startAdminPanel = (cb?: (success: boolean) => void,
    onLog?: (message: string) => void) => {
    if (ManagerState.adminPanelStatus === 'busy' ||
        ManagerState.adminPanelStatus === 'building' ||
        ManagerState.adminPanelStatus === 'running') {
        onLog?.(`AdminPanelManager:: AdminPanel is ${ManagerState.adminPanelStatus} now, failed to startAdminPanel`)
        cb?.(false);
        return;
    }

    if (servicesEnv.adminPanel) {
        const onOut = (data) => {
            // console.log(`stdout: ${data}`);
            onLog?.(data?.toString() ?? data);
        }
        ManagerState.adminPanelStatus = 'busy';
        const proc = startService(adminPanelStartupPath, cacheKeys.adminPanel, [servicesEnv.adminPanel], onOut)

        const onMessage = async (message: string) => {
            if (message === adminPanelMessages.onStartMessage) {
                ManagerState.adminPanelStatus = 'running';
                onLog?.(`AdminPanelManager:: AdminPanel has successfully started`);
                cb?.(true);
            }
            if (message === adminPanelMessages.onStartErrorMessage) {
                ManagerState.adminPanelStatus = 'inactive';
                onLog?.(`AdminPanelManager:: failed to start AdminPanel`);
                cb?.(false);
            }
        }

        proc?.on('message', onMessage);
    }
}

export const closeAdminPanel = (cb?: (success) => void, onLog?: (message: string) => void) => {
    closeService(cacheKeys.adminPanel, (success) => {
        if (success) {
            ManagerState.adminPanelStatus = 'inactive';
            onLog?.('AdminPanelManager::closeAdminPanel: AdminPanel has been closed');
        }
        cb?.(success)
    }, onLog);
}

export const rebuildAdminPanelWeb = (cb?: (success: boolean) => void,
    onLog?: (message: string) => void) => {

    if (ManagerState.adminPanelStatus === 'busy' ||
        ManagerState.adminPanelStatus === 'building') {
        onLog?.(`AdminPanelManager:: AdminPanel is ${ManagerState.adminPanelStatus} now, failed to rebuildWeb`)
        cb?.(false);
        return;
    }
    const adminPanelInitialStatus = ManagerState.adminPanelStatus;

    ManagerState.adminPanelStatus = 'building';
    const commad: TAdminPanelCommands = 'build';
    const onOut = (data) => {
        // console.log(`stdout: ${data}`);
        onLog?.(data?.toString() ?? data);
    }
    const proc = startService(adminPanelStartupPath, cacheKeys.adminPanelBuilder, [commad], onOut);

    let hasErrors = false;
    const onMessage = async (message: string) => {
        if (message === adminPanelMessages.onBuildStartMessage) {
            onLog?.('AdminPanelManager:: AdminPanel build started');
        }
        if (message === adminPanelMessages.onBuildErrorMessage) {
            ManagerState.adminPanelStatus = adminPanelInitialStatus;
            hasErrors = true;
        }

        if (message === adminPanelMessages.onBuildEndMessage) {
            ManagerState.adminPanelStatus = adminPanelInitialStatus;
            if (hasErrors) {
                onLog?.('AdminPanelManager:: AdminPanel build failed');
                cb?.(false);
                return;
            } else {
                onLog?.('AdminPanelManager:: AdminPanel has been successfully rebuilt');
                cb?.(true);
            }
        }
    }

    proc?.on('message', onMessage);

}


export const adminPanelChangeTheme = (prevThemeName: string, nextThemeName: string,
    cb?: (success: boolean) => void,
    onLog?: (message: string) => void) => {

    onLog?.(`AdminPanelManager:: adminPanelChangeTheme: ${nextThemeName}`);


    const currentArchiveBuildDir = getAdminPanelSavedBuildDirByTheme(projectRootDir, prevThemeName);
    const nextArchiveBuildDir = getAdminPanelSavedBuildDirByTheme(projectRootDir, nextThemeName);
    const currentBuildDir = getAdminPanelWebBuildProd(projectRootDir);

    const adminPanelInitialStatus = ManagerState.adminPanelStatus;
    ManagerState.adminPanelStatus = 'busy';

    const hasArchivedBuild = swithArchivedBuildsSync(currentArchiveBuildDir,
        nextArchiveBuildDir, currentBuildDir, onLog);

    ManagerState.adminPanelStatus = adminPanelInitialStatus;

    if (hasArchivedBuild) {
        onLog?.(`AdminPanelManager:: adminPanelChangeTheme: theme has been changed`);
        cb?.(true);
    } else {
        rebuildAdminPanelWeb((success) => {
            cb?.(success);
        }, onLog)
    }
}