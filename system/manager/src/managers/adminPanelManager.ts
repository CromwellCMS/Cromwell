import { adminPanelMessages, getAdminPanelStartupPath, getLogger } from '@cromwell/core-backend';

import config from '../config';
import { TAdminPanelCommands } from '../constants';
import { ManagerState } from '../managerState';
import { closeService, startService } from './baseManager';

const logger = getLogger('detailed');
const errorLogger = getLogger('errors-only');
const adminPanelStartupPath = getAdminPanelStartupPath();

export const startAdminPanel = async (command?: TAdminPanelCommands): Promise<boolean> => {
    const { cacheKeys, servicesEnv } = config;
    const env = command ?? servicesEnv.adminPanel;

    if (env && adminPanelStartupPath) {
        ManagerState.adminPanelStatus = 'busy';
        const proc = await startService(adminPanelStartupPath, cacheKeys.adminPanel, [env],
            undefined, command === 'build' ? true : false);

        if (command === 'build') return true;

        return new Promise(done => {
            proc?.on('message', async (message: string) => {
                if (message === adminPanelMessages.onStartMessage) {
                    ManagerState.adminPanelStatus = 'running';
                    errorLogger.log(`AdminPanel has successfully started`)
                    done?.(true);
                }
                if (message === adminPanelMessages.onStartErrorMessage) {
                    ManagerState.adminPanelStatus = 'inactive';
                    errorLogger.log(`Failed to start AdminPanel`, 'Error')
                    done?.(false);
                }
            });
        })
    }

    return false;
}

export const closeAdminPanel = async (): Promise<boolean> => {
    const { cacheKeys, servicesEnv } = config;
    const success = await closeService(cacheKeys.adminPanel);
    if (success) {
        ManagerState.adminPanelStatus = 'inactive';
        logger.log(`AdminPanelManager::closeAdminPanel: AdminPanel has been closed`)
    }
    return success;
}