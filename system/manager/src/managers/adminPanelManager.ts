import { adminPanelMessages } from '@cromwell/core-backend';
import { readCMSConfig } from '@cromwell/core-backend/dist/helpers/cms-settings';
import { getLogger } from '@cromwell/core-backend/dist/helpers/logger';
import { getAdminPanelStartupPath } from '@cromwell/core-backend/dist/helpers/paths';
import tcpPortUsed from 'tcp-port-used';

import config from '../config';
import { TAdminPanelCommands } from '../constants';
import { closeService, closeServiceManager, isPortUsed, startService } from './baseManager';

const logger = getLogger();
const adminPanelStartupPath = getAdminPanelStartupPath();

export const startAdminPanel = async (
  command?: TAdminPanelCommands,
  options?: {
    port?: string | number;
  },
): Promise<boolean> => {
  const { cacheKeys, servicesEnv } = config;
  const env = command ?? servicesEnv.adminPanel;
  const cmsConfig = await readCMSConfig();
  const port = options?.port ?? 4064;

  if (command !== 'build' && (await isPortUsed(Number(port)))) {
    const message = `Manager: Failed to start Admin: port ${port} is already in use. You may want to run stop command: npx cromwell stop --sv adminPanel`;
    logger.error(message);
    throw new Error(message);
  }

  if (env && adminPanelStartupPath) {
    const proc = await startService({
      path: adminPanelStartupPath,
      name: cacheKeys.adminPanel,
      args: [env, `--port=${port}`],
      command: env,
      sync: command === 'build' ? true : false,
      watchName: command !== 'build' ? 'admin' : undefined,
      onVersionChange: async () => {
        if (cmsConfig.useWatch) {
          try {
            await closeAdminPanel();
          } catch (error) {
            logger.error(error);
          }

          try {
            await tcpPortUsed.waitUntilFree(parseInt(port as any), 500, 4000);
          } catch (e) {
            logger.error(e);
          }

          try {
            await startAdminPanel(command, options);
          } catch (error) {
            logger.error(error);
          }
        }
      },
    });

    if (command === 'build') return true;

    const success = await new Promise((done) => {
      proc?.on('message', async (message: string) => {
        if (message === adminPanelMessages.onStartMessage) {
          done?.(true);
        }
        if (message === adminPanelMessages.onStartErrorMessage) {
          done?.(false);
        }
      });
    });

    if (!success) {
      logger.error(`Failed to start Admin`);
      return false;
    }

    try {
      await tcpPortUsed.waitUntilUsed(port, 500, 15 * 1000);
    } catch (e) {
      logger.error(`Failed to start Admin`);
      return false;
    }

    const response = await fetch(`http://localhost:${port}/admin`).catch((error) => error);

    if (response.status < 400) {
      logger.log(`Admin has successfully started`);
      return true;
    } else {
      logger.error(
        `Failed to start Admin`,
        response?.status,
        response?.statusText,
        await response?.text?.()?.catch?.(() => null),
      );
      return false;
    }
  }

  return false;
};

export const closeAdminPanel = async (): Promise<boolean> => {
  const { cacheKeys } = config;
  const success = await closeService(cacheKeys.adminPanel);
  if (success) {
    logger.log(`AdminManager::closeAdmin: Admin has been closed`);
  }
  return success;
};

export const closeAdminPanelManager = async (): Promise<boolean> => {
  const { cacheKeys } = config;
  const success = await closeServiceManager(cacheKeys.adminPanel);
  if (success) {
    logger.log(`AdminManager::closeAdmin: Admin has been closed`);
  }
  return success;
};
