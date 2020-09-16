import { getServerDir, serverMessages } from '@cromwell/core-backend';
import { resolve } from 'path';

import config from '../config';
import { closeService, startService } from './baseManager';

const { projectRootDir, cacheKeys, servicesEnv } = config;

const serverDir = getServerDir(projectRootDir);
const serverStartupPath = resolve(serverDir, 'startup.js');

export const startServer = (cb: (success: boolean) => void, onLog?: (message: string) => void) => {
    console.log('servicesEnv', servicesEnv)
    let serverProc;
    if (servicesEnv.server) {
        serverProc = startService(serverStartupPath, cacheKeys.server, [servicesEnv.server],
            (data) => onLog?.(data?.toString() ?? data))
    }
    
    if (serverProc) {
        const onMessage = async (message: string) => {
            if (message === serverMessages.onStartMessage) {
                onLog?.(`ServerManager:: Server has successfully started`);
                serverProc.removeListener('message', onMessage);
                cb(true);
            }
            if (message === serverMessages.onStartErrorMessage) {
                serverProc.removeListener('message', onMessage);
                cb(false);
            }
        }
        serverProc.on('message', onMessage);
    } else {
        cb(false);
    }
}

export const closeServer = (cb?: () => void) => {
    closeService(cacheKeys.server, cb);
}

