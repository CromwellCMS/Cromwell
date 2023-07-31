import { getLogger } from '@cromwell/core-backend/dist/helpers/logger';
import { getTempDir } from '@cromwell/core-backend/dist/helpers/paths';
import { spawn } from 'child_process';
import normalizePath from 'normalize-path';
import { resolve } from 'path';
import tcpPortUsed from 'tcp-port-used';

const logger = getLogger();

export const startNginx = async (isDevelopment?: boolean): Promise<boolean> => {
  const nginxDir = normalizePath(resolve(getTempDir(), 'nginx/docker-compose.yml'));
  const workingDir = normalizePath(process.cwd());
  spawn(`docker-compose -f ${nginxDir} --project-directory ${workingDir} up`, {
    shell: true,
    cwd: workingDir,
    stdio: isDevelopment ? 'inherit' : 'ignore',
  });
  try {
    await tcpPortUsed.waitUntilUsed(80, 500, 6000);
    logger.log(`Nginx has successfully started`);
    return true;
  } catch (e) {
    logger.error(`Failed to start Nginx`);
    logger.error(e);
  }

  return false;
};

export const closeNginx = async (): Promise<boolean> => {
  try {
    const nginxDir = normalizePath(resolve(getTempDir(), 'nginx/docker-compose.yml'));
    const workingDir = normalizePath(process.cwd());
    spawn(`docker-compose -f ${nginxDir} --project-directory ${workingDir} down`, {
      shell: true,
      cwd: process.cwd(),
      stdio: 'inherit',
    });
  } catch (e) {
    console.error(e);
  }
  return true;
};
