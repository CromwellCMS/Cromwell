import { readCMSConfig } from '@cromwell/core-backend/dist/helpers/cms-settings';
import { serverMessages } from '@cromwell/core-backend/dist/helpers/constants';
import { getLogger } from '@cromwell/core-backend/dist/helpers/logger';
import { getServerStartupPath } from '@cromwell/core-backend/dist/helpers/paths';
import tcpPortUsed from 'tcp-port-used';

import config from '../config';
import { TServerCommands } from '../constants';
import { closeService, closeServiceAndManager, isPortUsed, startService } from './baseManager';

const { cacheKeys, servicesEnv } = config;
const logger = getLogger();
const serverStartupPath = getServerStartupPath();

export const startServer = async (
  command?: TServerCommands,
  argsPort?: string | number,
  init?: boolean,
): Promise<boolean> => {
  let serverProc;

  const cmsConfig = await readCMSConfig();
  argsPort = parseInt(argsPort + '');
  if (isNaN(argsPort)) argsPort = undefined;
  const port = argsPort ?? 4016;

  if (command !== 'build') {
    let message;
    if (await isPortUsed(port)) {
      message = `Manager: Failed to start Server: api port ${port} is already in use. You may want to run stop command: npx cromwell stop --sv server`;
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
      args: [env, `--port=${port}`, init ? '--init' : ''],
      command: env,
      sync: command === 'build' ? true : false,
      watchName: command !== 'build' ? 'server' : undefined,
      onVersionChange: async () => {
        if (cmsConfig.useWatch) {
          try {
            await closeServer();
          } catch (error) {
            logger.error(error);
          }

          try {
            await tcpPortUsed.waitUntilFree(parseInt(port as any), 500, 4000);
          } catch (e) {
            logger.error(e);
          }

          try {
            await startServer(command, argsPort);
          } catch (error) {
            logger.error(error);
          }
        }
      },
    });
  }

  if (command === 'build') return true;

  if (serverProc) {
    return new Promise((done) => {
      const onMessage = async (message: string) => {
        if (message === serverMessages.onStartMessage) {
          logger.log(`Server has successfully started`);
          done(true);
        }
        if (message === serverMessages.onStartErrorMessage) {
          logger.error(`Failed to start Server`);
          done(false);
        }
      };
      serverProc.on('message', onMessage);
    });
  }
  return false;
};

export const closeServer = async (): Promise<boolean> => {
  try {
    return closeService(cacheKeys.serverMain);
  } catch (e) {
    console.error(e);
  }
  return false;
};

export const closeServerManager = async (): Promise<boolean> => {
  try {
    return closeServiceAndManager(cacheKeys.serverMain);
  } catch (e) {
    console.error(e);
  }
  return false;
};
