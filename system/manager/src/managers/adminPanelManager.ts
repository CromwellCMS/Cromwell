import { adminPanelMessages, getAdminPanelDir, getAdminPanelStartupPath } from '@cromwell/core-backend';
import { resolve } from 'path';

import config from '../config';
import { ManagerState } from '../managerState';
import { closeService, startService } from './baseManager';

const { cacheKeys, servicesEnv } = config;

type TAdminPanelCommands = 'buildService' | 'build' | 'dev' | 'prod';

const adminPanelDir = getAdminPanelDir();
const adminPanelStartupPath = getAdminPanelStartupPath();

export const startAdminPanel = async (onLog?: (message: string) => void): Promise<boolean> => {
    if (ManagerState.adminPanelStatus === 'busy' ||
        ManagerState.adminPanelStatus === 'building' ||
        ManagerState.adminPanelStatus === 'running') {
        onLog?.(`AdminPanelManager:: AdminPanel is ${ManagerState.adminPanelStatus} now, failed to startAdminPanel`)
        return false;
    }

    if (servicesEnv.adminPanel && adminPanelStartupPath) {
        const onOut = (data) => {
            // console.log(`stdout: ${data}`);
            onLog?.(data?.toString() ?? data);
        }
        ManagerState.adminPanelStatus = 'busy';
        const proc = startService(adminPanelStartupPath, cacheKeys.adminPanel, [servicesEnv.adminPanel], onOut)

        return new Promise(done => {
            proc?.on('message', async (message: string) => {
                if (message === adminPanelMessages.onStartMessage) {
                    ManagerState.adminPanelStatus = 'running';
                    onLog?.(`AdminPanelManager:: AdminPanel has successfully started`);
                    done?.(true);
                }
                if (message === adminPanelMessages.onStartErrorMessage) {
                    ManagerState.adminPanelStatus = 'inactive';
                    onLog?.(`AdminPanelManager:: failed to start AdminPanel`);
                    done?.(false);
                }
            });
        })
    }

    return false;
}

export const closeAdminPanel = async (onLog?: (message: string) => void): Promise<boolean> => {
    const success = await closeService(cacheKeys.adminPanel, onLog);
    if (success) {
        ManagerState.adminPanelStatus = 'inactive';
        onLog?.('AdminPanelManager::closeAdminPanel: AdminPanel has been closed');
    }
    return success;
}