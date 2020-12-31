import { getServerStartupPath, serverMessages } from '@cromwell/core-backend';

import config from '../config';
import { closeService, startService } from './baseManager';

const { cacheKeys, servicesEnv } = config;

const serverStartupPath = getServerStartupPath();

export const startServer = async (onLog?: (message: string) => void): Promise<boolean> => {
    console.log('servicesEnv', servicesEnv)
    let serverProc;
    if (servicesEnv.server && serverStartupPath) {
        serverProc = startService(serverStartupPath, cacheKeys.server, [servicesEnv.server],
            (data) => onLog?.(data?.toString() ?? data))
    }

    if (serverProc) {
        return new Promise(done => {
            const onMessage = async (message: string) => {
                if (message === serverMessages.onStartMessage) {
                    onLog?.(`ServerManager:: Server has successfully started`);
                    serverProc.removeListener('message', onMessage);
                    done(true);
                }
                if (message === serverMessages.onStartErrorMessage) {
                    onLog?.(`ServerManager:: Failed to start Server`);
                    serverProc.removeListener('message', onMessage);
                    done(false);
                }
            }
            serverProc.on('message', onMessage);
        })
    }
    return false;
}

export const closeServer = async (): Promise<boolean> => {
    return closeService(cacheKeys.server);
}

