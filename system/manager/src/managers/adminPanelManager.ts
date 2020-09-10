import { startService, closeService } from './baseManager';
import { resolve } from 'path';
import config from '../config';
const { projectRootDir, cacheKeys, servicesEnv } = config;

const adminPanelStartupPath = resolve(projectRootDir, 'system/admin-panel/startup.js');

export const startAdminPanel = () => {
    if (servicesEnv.adminPanel) {
        startService(adminPanelStartupPath, cacheKeys.adminPanel, [servicesEnv.adminPanel])
    }
}

export const closeAdminPanel = (cb?: () => void) => {
    closeService(cacheKeys.adminPanel, cb);
}