const cacache = require('cacache');
const { cachePath, cacheKey, cleanCacheOnStart } = require('../config');
const { pid } = require('process');
const serviceNamesKey = 'serviceNames';
const asyncEach = require('async').each;

let globalCache = {};

const getRunTimeCache = () => globalCache;

const getCacheKey = (serviceName) => {
    return `${cachePath}_${serviceName}`
}

const saveProcessPid = (title, pid, cb) => {
    // console.log('saveProcessPid', title, pid);
    saveServiceName(title);
    cacache.put(cachePath, getCacheKey(title), String(pid)).finally(cb);
}

let serviceNames = [];

const saveServiceName = (name, cb) => {
    if (!serviceNames.includes(name)) {
        serviceNames.push(name);
        cacache.put(cachePath, getCacheKey(serviceNamesKey), JSON.stringify(serviceNames)).then(cb)
    }
}


const getProcessPid = (title, cb) => {
    let cache = null;
    cacache.get(cachePath, getCacheKey(title)).then(data => {
        if (data && data.data && data.data.toString) {
            try {
                let c = data.data.toString();
                if (c && typeof c === 'string' && c !== '') {
                    c = parseInt(c);
                    if (c != null && !isNaN(c)) {
                        cache = c;
                    }
                }
            } catch (e) {
                console.log(e)
            }
        }
    }).catch((e) => { }
    ).finally(() => {
        if (cache) {
            globalCache[title] = cache;
        }
        cb(cache);
    });
}

const getAllServices = (cb) => {
    const out = {};
    asyncEach(serviceNames, (name, cb) => {
        getProcessPid(name, (pid) => {
            out[name] = pid;
            cb();
        })
    }, () => {
        cb(out);
    })
}


const loadCache = (cb) => {
    let cache;
    cacache.get(cachePath, getCacheKey(serviceNamesKey)).then(data => {
        if (data && data.data && data.data.toString) {
            try {
                const c = JSON.parse(data.data.toString());
                if (c && Array.isArray(c))
                    cache = c;
            } catch (e) {
            }
        }
    }).catch((e) => { console.log(e) }
    ).finally(() => {
        if (cache) {
            serviceNames = cache;
        }
        getAllServices((out) => {
            globalCache = out;
            setTimeout(() => {
                // console.log('globalCache', globalCache);
                cb();
            }, 100);
        })
    });
}


module.exports = {
    saveProcessPid, getProcessPid, loadCache, getAllServices, getRunTimeCache
}