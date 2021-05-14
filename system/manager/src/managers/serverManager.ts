import { getLogger, getServerStartupPath, readCMSConfig, serverMessages } from '@cromwell/core-backend';
import tcpPortUsed from 'tcp-port-used';

import config from '../config';
import { TServerCommands } from '../constants';
import { closeService, isPortUsed, startService } from './baseManager';

const { cacheKeys, servicesEnv } = config;
const logger = getLogger();
const serverStartupPath = getServerStartupPath();

export const startServer = async (command?: TServerCommands): Promise<boolean> => {
    let serverProc;

    const cmsConfig = await readCMSConfig();

    if (!cmsConfig?.apiPort) {
        const message = 'Manager: Failed to start Server: apiPort is not defined in cmsconfig';
        logger.error(message);
        throw new Error(message);
    }

    if (command !== 'build') {
        let message;
        if (await isPortUsed(cmsConfig.apiPort)) {
            message = `Manager: Failed to start Server: apiPort ${cmsConfig.apiPort} is already in use. You may want to run close command: cromwell close --sv server`;
        }
        if (message) {
            logger.error(message);
            throw new Error(message);
        }
    }


    const env = command ?? servicesEnv.server;
    if (env && serverStartupPath) {
        serverProc = await startService({
            path: serverStartupPath,
            name: cacheKeys.serverMain,
            args: [env],
            sync: command === 'build' ? true : false,
            watchName: command !== 'build' ? 'server' : undefined,
            onVersionChange: async () => {
                if (cmsConfig.useWatch) {
                    await closeServer();
                    try {
                        await tcpPortUsed.waitUntilFree(cmsConfig.apiPort, 500, 4000);
                    } catch (e) { console.error(e) }
                    await startServer(command);
                }
            }
        });
    }

    if (command === 'build') return true;

    if (serverProc) {
        return new Promise(done => {
            const onMessage = async (message: string) => {
                if (message === serverMessages.onStartMessage) {
                    logger.log(`Server has successfully started`);
                    done(true);
                }
                if (message === serverMessages.onStartErrorMessage) {
                    logger.error(`Failed to start Server`);
                    done(false);
                }
            }
            serverProc.on('message', onMessage);
        })
    }
    return false;
}

export const closeServer = async (): Promise<boolean> => {
    try {
        return closeService(cacheKeys.serverMain);
    } catch (e) {
        console.error(e);
    }
    return false;
}

