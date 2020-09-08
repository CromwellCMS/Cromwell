const cacache = require('cacache');
const { cachePath, cacheKey, cleanCacheOnStart } = require('../config');

let globalCache = {};

const saveProcessPid = (title, pid) => {
    globalCache[title] = pid;
    cacache.put(cachePath, cacheKey, JSON.stringify(globalCache))
}

const getProcessPid = (title) => {
    return globalCache[title];
}

const loadCache = (cb) => {
    cacache.get(cachePath, cacheKey).then(data => {
        if (cleanCacheOnStart) {
            globalCache = {};
            cacache.put(cachePath, cacheKey, JSON.stringify(globalCache));
            return;
        }
        if (data && data.data && data.data.toString) {
            try {
                const c = JSON.parse(data.data.toString());
                if (c && typeof c === 'object')
                    globalCache = c;
            } catch (e) {
            }
        }
    }).catch((e) => { }
    ).finally(() => {
        setTimeout(() => {
            cb();
        }, 100);
    });
}

const getGlobalCache = () => globalCache;

module.exports = {
    getGlobalCache, saveProcessPid, getProcessPid, loadCache
}