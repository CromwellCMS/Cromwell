import { getLogger, getServerStartupPath, readCMSConfig, serverMessages } from '@cromwell/core-backend';
import tcpPortUsed from 'tcp-port-used';

import config from '../config';
import { TServerCommands } from '../constants';
import { closeService, isPortUsed, startService } from './baseManager';

const { cacheKeys, servicesEnv } = config;
const logger = getLogger('errors-only');
const serverStartupPath = getServerStartupPath();

export const startServer = async (command?: TServerCommands): Promise<boolean> => {
    let serverProc;

    const cmsConfig = await readCMSConfig();
    const sType = (command === 'devMain' || command === 'prodMain') ? 'main' : 'plugin';

    if (!cmsConfig?.mainApiPort || !cmsConfig?.pluginApiPort) {
        const message = 'Manager: Failed to start Server: mainApiPort | pluginApiPort is not defined in cmsconfig';
        logger.error(message);
        throw new Error(message);
    }

    if (command !== 'build') {
        let message;
        if (sType === 'main' && await isPortUsed(cmsConfig.mainApiPort)) {
            message = `Manager: Failed to start Server: mainApiPort ${cmsConfig.mainApiPort} is already in use. You may want to run close command: cromwell close --sv server`;
        }
        if (sType === 'plugin' && await isPortUsed(cmsConfig.pluginApiPort)) {
            message = `Manager: Failed to start Server: pluginApiPort ${cmsConfig.pluginApiPort} is already in use. You may want to run close command: cromwell close --sv server`;
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
            name: sType === 'main' ? cacheKeys.serverMain : cacheKeys.serverPlugin,
            args: [env],
            sync: command === 'build' ? true : false,
            watchName: command !== 'build' ? sType === 'main' ? 'serverMain' : 'serverPlugin' : undefined,
            onVersionChange: async () => {
                if (cmsConfig.useWatch) {
                    await closeServer(sType);
                    try {
                        if (sType === 'main')
                            await tcpPortUsed.waitUntilFree(cmsConfig.mainApiPort, 500, 4000);

                        if (sType === 'plugin')
                            await tcpPortUsed.waitUntilFree(cmsConfig.pluginApiPort, 500, 4000);
                    } catch (e) { console.error(e) };
                    await startServer(command);
                }
            }
        });
    }

    if (command === 'build') return true;

    if (serverProc) {
        return new Promise(done => {
            const onMessage = async (message: string) => {
                console.log('onMessage')
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

export const closeServer = async (sType: 'main' | 'plugin'): Promise<boolean> => {
    try {
        return closeService(sType === 'main' ? cacheKeys.serverMain : cacheKeys.serverPlugin);
    } catch (e) {
        console.error(e);
    }
    return false;
}

