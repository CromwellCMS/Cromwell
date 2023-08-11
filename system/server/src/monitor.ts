import { getAllProcessPids, reportProcessPid } from '@cromwell/core-backend/dist/helpers/shell';
import si from 'systeminformation';
import { parentPort } from 'worker_threads';
import pidusage from 'pidusage';

type PidStat = {
  cpu: number;
  memory: number;
  ppid: number;
  pid: number;
  ctime: number;
  elapsed: number;
  timestamp: number;
};

let sysInfo: {
  cpu: any;
  mem: any;
  osInfo: any;
  fsSize: any;
};

const getSysInfo = async () => {
  if (sysInfo) return sysInfo;

  let cpu;
  try {
    cpu = await si.cpu();
  } catch (error) {
    console.error(error);
  }

  let mem;
  try {
    mem = await si.mem();
  } catch (error) {
    console.error(error);
  }

  let osInfo;
  try {
    osInfo = await si.osInfo();
  } catch (error) {
    console.error(error);
  }

  let fsSize;
  try {
    fsSize = await si.fsSize();
  } catch (error) {
    console.error(error);
  }

  sysInfo = {
    cpu,
    mem,
    osInfo,
    fsSize,
  };
  return sysInfo;
};

let measuringPromise: Promise<void> | undefined;
let isAwaitingPromise = false;
let latestUsageInfo: {
  mem: any;
  currentLoad: any;
  fsSize: any;
  processes: { stats: PidStat; name: string; pid: number }[];
};

const getMemUsageByProcesses = async (): Promise<{ stats: PidStat; name: string; pid: number }[]> => {
  const data = await getAllProcessPids();

  const uniquePids: Record<number, { name: string; pid: number }> = {};
  for (const proc of data) {
    if (!proc) continue;
    if (!uniquePids[proc.pid]) {
      uniquePids[proc.pid] = proc;
    } else {
      uniquePids[proc.pid].name += `, ${proc.name}`;
    }
  }

  const stats = (
    await Promise.all(
      Object.values(uniquePids).map(async (proc) => {
        return new Promise<{ stats: PidStat; name: string; pid: number }>((done) => {
          pidusage(proc.pid, function (err, stats) {
            done({
              ...proc,
              stats,
            });
          });
        });
      }),
    )
  ).filter(Boolean);

  return stats;
};

const getUsageInfo = async (): Promise<typeof latestUsageInfo> => {
  if (measuringPromise) {
    if (isAwaitingPromise) return latestUsageInfo;
    isAwaitingPromise = true;

    measuringPromise.then(() => {
      isAwaitingPromise = false;
    });

    return latestUsageInfo;
  }

  let measuringResolver;
  measuringPromise = new Promise((done) => {
    measuringResolver = done;
  });

  let mem;

  const getMem = async () => {
    try {
      mem = await si.mem();
    } catch (error) {
      console.error(error);
    }
  };

  let currentLoad;

  const getLoad = async () => {
    try {
      currentLoad = await si.currentLoad();
    } catch (error) {
      console.error(error);
    }
  };

  let fsSize;

  const getFsSize = async () => {
    try {
      fsSize = await si.fsSize();
    } catch (error) {
      console.error(error);
    }
  };

  let processesStats;

  const getProcessesStats = async () => {
    try {
      processesStats = await getMemUsageByProcesses();
    } catch (error) {
      console.error(error);
    }
  };

  await Promise.all([getMem(), getLoad(), getFsSize(), getProcessesStats()]);

  latestUsageInfo = {
    mem,
    currentLoad,
    fsSize,
    processes: processesStats,
  };

  setTimeout(() => {
    measuringPromise = undefined;
    measuringResolver();
  }, 5000);

  return latestUsageInfo;
};

parentPort?.on('message', async (message) => {
  if (message?.command === 'getSysInfo') {
    const info = await getSysInfo();
    parentPort?.postMessage({
      type: 'sysInfo',
      info,
    });
  }

  if (message?.command === 'getUsageInfo') {
    const info = await getUsageInfo();

    parentPort?.postMessage({
      type: 'usageInfo',
      info,
    });
  }
});

reportProcessPid('server_monitor');
