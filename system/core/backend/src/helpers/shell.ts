import { spawn } from 'child_process';
import cacache from 'cacache';
import isRunning from 'is-running';

import { getLogger } from './logger';
import { getServerCachePath } from './paths';

const logger = getLogger();

export const runShellCommand = (command: string, cwd?: string): Promise<void> => {
  logger.info('Running shell command: ' + command);

  return new Promise<void>((done) => {
    const proc = spawn(command, [], { shell: true, stdio: 'pipe', cwd: cwd ?? process.cwd() });

    if (proc.stderr && proc.stderr.on) {
      proc.stderr.on('data', (data) => {
        logger.warn(data.toString ? data.toString() : data);
      });
    }
    if (proc.stdout && proc.stdout.on) {
      proc.stdout.on('data', (data) => {
        logger.log(data.toString ? data.toString() : data);
      });
    }

    proc.on('close', () => {
      done();
    });
  });
};

function dataToKey(name: string, pid: number) {
  return `process_info_${name}_pid:${pid}`;
}
function keyToData(key: string) {
  return {
    name: key.replace('process_info_', '').replace(/_pid:.*$/, ''),
    pid: parseInt(key.replace(/process_info_.*_pid:/, '')),
  };
}

export const reportProcessPid = async (name: string) => {
  setTimeout(() => {
    const pid = process.pid;
    if (isNaN(Number(pid))) return;
    cacache.put(
      getServerCachePath(),
      dataToKey(name, pid),
      JSON.stringify({
        pid: process.pid,
      }),
    );
  }, 100);
};

// get all keys that starts with `process_info`
export const getAllProcessPids = async (): Promise<{ name: string; pid: number }[]> => {
  const cachedData: any = await cacache.ls(getServerCachePath());
  const keys = Object.keys(cachedData);
  const processInfoKeys = keys.filter((key) => key.startsWith('process_info_'));

  const pids = (
    await Promise.all(
      processInfoKeys.map(async (key) => {
        const data = keyToData(key);

        try {
          if (!isRunning(data.pid)) {
            await cacache.rm.entry(getServerCachePath(), dataToKey(data.name, data.pid));
            return null;
          }
        } catch (error) {
          logger.error(error);
          return null;
        }

        return {
          name: data.name,
          pid: data.pid,
        };
      }),
    )
  ).filter((entry) => entry && !isNaN(Number(entry.pid))) as { name: string; pid: number }[];

  return pids;
};
