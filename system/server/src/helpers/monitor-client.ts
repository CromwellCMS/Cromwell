import { getServerBuildMonitorPath } from '@cromwell/core-backend';
import { Worker } from 'worker_threads';

const monitorPath = getServerBuildMonitorPath();
if (!monitorPath) throw new Error('Could not define monitor build path');
let worker: Worker;

export const getSysInfo = async () => {
  if (!worker) worker = new Worker(monitorPath);

  return new Promise((done) => {
    worker.on('message', (message) => {
      if (message.type === 'sysInfo') {
        done(message.info);
      }
    });

    worker.postMessage({
      command: 'getSysInfo',
    });
  });
};

export const getSysUsageInfo = async () => {
  if (!worker) worker = new Worker(monitorPath);

  return new Promise((done) => {
    worker.on('message', (message) => {
      if (message.type === 'usageInfo') {
        done(message.info);
      }
    });

    worker.postMessage({
      command: 'getUsageInfo',
    });
  });
};
