const { resolve } = require('path');
const fs = require('fs-extra');
const localProjectDir = resolve(__dirname);
const projectRootDir = resolve(localProjectDir, '../../../');
const systemDir = resolve(projectRootDir, 'system');

// DO NOT EDIT THIS CONFIG!
// This is default settings.
// Create your own copy at "/usr/share/cromwell/devconfig.json"
const userConfigPath = resolve('/usr/share/cromwell/devconfig.json');
// Configs will be merged via Object.assign

const config = {
    projectRootDir, systemDir, localProjectDir,
    /** Config for root "dev" script */
    "servicesDev": {
        "adminPanel": "dev", // 'dev' | 'prod' | 'build' | null
        "server": "dev", // 'dev' | 'prod' | 'build' | null
        "renderer": "dev", // 'dev' | 'prod' | 'build' | null
    },
    /** Config for root "start" script */
    "servicesProd": {
        "adminPanel": "prod", // 'dev' | 'prod' | 'build' | null
        "server": "prod", // 'dev' | 'prod' | 'build' | null
        "renderer": "prod", // 'dev' | 'prod' | 'build' | null
    },
    "cacheKeys": {
        "coreCommon": "core_common",
        "coreBackend": "core_backend",
        "coreFrontend": "core_frontend",
        "server": "server",
        "renderer": "renderer",
        "adminPanel": "admin_panel",
        "manager": "manager",
    },
    "cachePath": resolve(systemDir, '.cromwell/cache'),
    "cacheKey": 'CromwellProcessManager',
    "cleanCacheOnStart": false,

    /** Close all services when manager process is being closed */
    "closeAllOnExit": true,
    /** npm scripts to run in folders of services in "winDev" env */
    "windowsDevServices": {
        "coreCommon": "watch",
        "coreBackend": "watch",
        "coreFrontend": "watch",
        "manager": "watch",
        "server": "dev",
        "renderer": "dev",
        "adminPanel": "dev",
        "other": "watch",
    },
    "windowsDev": {
        "panelWidth": 0.30, // 30%
        "corePanelHeight": 0.3,
        "rendererHeigth": 0.3,
        "serverHeigth": 0.3,
        "padding": 25, // 25px
        "overlayShift": 35,
        /** Number of monitor to use. If null, will bind to active one at the start of the script */
        "monitorNum": 0,
        /** Will look into cache and spawn a new terminal instance only if there's no terminals with the same title & pid */
        "startIfNotFound": true,
        "watch": true,
        "watchPollTimeout": 1000, // ms
        "overallTimeout": 0,
        /**  Will run terminal with npm script from windowsDevServices.other in every dir. Paths are relative at projectRootDir */
        "otherDirs": [
            "themes/cromwell-demoshop",
            // "plugins/ProductFilter"
        ]
    }
}

let userConfig;
if (fs.existsSync(userConfigPath)) {
    try {
        userConfig = JSON.parse(fs.readFileSync(userConfigPath, { encoding: 'utf8', flag: 'r' }));
    } catch (e) {
        console.log('manager::read config ', e);
    }
}

const mergedConfig = Object.assign({}, config, userConfig);

/**
  * @scriptName
  * production
  * development
  * winDev - start dev environment in Windows OS
  */
const scriptName = process.argv[2];
const servicesEnv = scriptName === 'production' ? mergedConfig.servicesProd :
    scriptName === 'development' ? mergedConfig.servicesDev : {};

mergedConfig.servicesEnv = servicesEnv;
mergedConfig.scriptName = scriptName;


module.exports = mergedConfig;