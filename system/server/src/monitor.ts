import si from 'systeminformation';
import { parentPort } from 'worker_threads';

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
  try {
    mem = await si.mem();
  } catch (error) {
    console.error(error);
  }

  let currentLoad;
  try {
    currentLoad = await si.currentLoad();
  } catch (error) {
    console.error(error);
  }

  let fsSize;
  try {
    fsSize = await si.fsSize();
  } catch (error) {
    console.error(error);
  }

  latestUsageInfo = {
    mem,
    currentLoad,
    fsSize,
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
