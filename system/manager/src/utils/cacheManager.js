const cacache = require('cacache');
const config = require('../config');
const cachePath = config.default ? config.default.cachePath : config.cachePath;
const serviceNamesKey = 'serviceNames';
const asyncEach = require('async').each;

let globalCache = {};

const getRunTimeCache = () => globalCache;

const getCacheKey = (serviceName) => {
  return `${cachePath}_${serviceName}`;
};

const saveProcessPid = async (title, managerPid, procPid) => {
  // console.log('saveProcessPid', title, pid);
  await saveServiceName(title);
  await new Promise((done) => {
    cacache.put(cachePath, getCacheKey(title), String(procPid)).finally(done);
  });
  await new Promise((done) => {
    cacache.put(cachePath, getCacheKey(`${title}_manager`), String(managerPid)).finally(done);
  });
};

let serviceNames = [];

const saveServiceName = async (name, cb) => {
  if (!serviceNames.includes(name)) {
    serviceNames.push(name);
    await new Promise((done) => {
      cacache.put(cachePath, getCacheKey(serviceNamesKey), JSON.stringify(serviceNames)).then(done);
    });
  }
};

const getProcessPid = (title, cb) => {
  let cache = null;
  cacache
    .get(cachePath, getCacheKey(title))
    .then((data) => {
      if (data && data.data && data.data.toString) {
        try {
          let c = data.data.toString();
          if (c && typeof c === 'string') {
            c = parseInt(c);
            if (c != null && !isNaN(c)) {
              cache = c;
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
    })
    .catch((e) => {})
    .finally(() => {
      if (cache) {
        globalCache[title] = cache;
      }
      cb(cache);
    });
};

const getAllServices = (cb) => {
  const out = {};
  asyncEach(
    serviceNames,
    (name, cb) => {
      getProcessPid(name, (pid) => {
        out[name] = pid;
        cb();
      });
    },
    () => {
      cb(out);
    },
  );
};

const loadServiceNames = (cb) => {
  let cache;
  cacache
    .get(cachePath, getCacheKey(serviceNamesKey))
    .then((data) => {
      if (data && data.data && data.data.toString) {
        try {
          const c = JSON.parse(data.data.toString());
          if (c && Array.isArray(c)) cache = c;
        } catch (e) {}
      }
    })
    .catch((e) => {})
    .finally(() => {
      if (cache) {
        serviceNames = cache;
      }
      cb(cache);
    });
};
const loadCache = (cb) => {
  loadServiceNames(() => {
    getAllServices((out) => {
      globalCache = out;
      setTimeout(() => {
        // console.log('globalCache', globalCache);
        cb();
      }, 100);
    });
  });
};

const cleanCache = (cb) => {
  globalCache = {};
  loadServiceNames(() => {
    cacache.rm.all(cachePath).then(() => {
      cb();
    });
  });
};

module.exports = {
  saveProcessPid,
  getProcessPid,
  loadCache,
  getAllServices,
  getRunTimeCache,
  cleanCache,
};
