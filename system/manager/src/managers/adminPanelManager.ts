import { adminPanelMessages, getAdminPanelStartupPath, getLogger, readCMSConfig } from '@cromwell/core-backend';
import tcpPortUsed from 'tcp-port-used';

import config from '../config';
import { TAdminPanelCommands } from '../constants';
import { ManagerState } from '../managerState';
import { closeService, isPortUsed, startService } from './baseManager';

const logger = getLogger('detailed');
const errorLogger = getLogger('errors-only');
const adminPanelStartupPath = getAdminPanelStartupPath();

export const startAdminPanel = async (command?: TAdminPanelCommands): Promise<boolean> => {
    const { cacheKeys, servicesEnv } = config;
    const env = command ?? servicesEnv.adminPanel;

    const cmsConfig = await readCMSConfig();

    if (!cmsConfig?.adminPanelPort) {
        const message = 'Manager: Failed to start Admin Panel: adminPanelPort in cmsconfig is not defined';
        errorLogger.error(message);
        throw new Error(message);
    }

    if (await isPortUsed(cmsConfig.adminPanelPort)) {
        const message = `Manager: Failed to start Admin Panel: adminPanelPort ${cmsConfig.adminPanelPort} is already in use. You may want to run close command: cromwell close --sv adminPanel`;
        errorLogger.error(message);
        throw new Error(message);
    }

    if (env && adminPanelStartupPath) {
        ManagerState.adminPanelStatus = 'busy';
        const proc = await startService({
            path: adminPanelStartupPath,
            name: cacheKeys.adminPanel,
            args: [env],
            sync: command === 'build' ? true : false,
            watchName: 'adminPanel',
            onVersionChange: async () => {
                if (cmsConfig.useWatch) {
                    await closeAdminPanel();
                    try {
                        await tcpPortUsed.waitUntilFree(cmsConfig.adminPanelPort, 500, 4000);
                    } catch (e) { console.error(e) };
                    await startAdminPanel();
                }
            }
        })

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