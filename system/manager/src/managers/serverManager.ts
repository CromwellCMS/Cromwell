import { startService, closeService } from './baseManager';
import { resolve } from 'path';
import config from '../config';
const { projectRootDir, cacheKeys, servicesEnv } = config;

const serverStartupPath = resolve(projectRootDir, 'system/server/startup.js');

export const startServer = (onStart: () => void, onLog?: (message: string) => void) => {
    console.log('servicesEnv', servicesEnv)
    let serverProc;
    if (servicesEnv.server) {
        serverProc = startService(serverStartupPath, cacheKeys.server, [servicesEnv.server],
            (data) => onLog?.(data?.toString() ?? data))
    }
    if (serverProc) {
        serverProc.on('message', (message) => {
            if (message === 'ready') {
                onStart();
            }
        });
    } else {
        onStart();
    }
}

export const closeServer = (cb?: () => void) => {
    closeService(cacheKeys.server, cb);
}

