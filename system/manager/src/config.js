const { resolve } = require('path');
const projectRootDir = resolve(__dirname, '../../../');
const localProjectDir = resolve(__dirname, '../');
const systemDir = resolve(projectRootDir, 'system');

/** Config for root "dev" script */
const servicesDev = {
    adminPanel: 'dev', // 'dev' | 'prod' | 'build' | null
    server: 'dev', // 'dev' | 'prod' | 'build' | null
    renderer: 'dev' // 'dev' | 'prod' | 'build' | null
};
/** Config for root "start" script */
const servicesProd = {
    adminPanel: 'prod', // 'dev' | 'prod' | 'build' | null
    server: 'prod', // 'dev' | 'prod' | 'build' | null
    renderer: 'prod' // 'dev' | 'prod' | 'build' | null
};

/**
  * @scriptName
  * production
  * development
  * winDev - start dev environment in Windows OS
  */
const scriptName = process.argv[2];
const servicesEnv = scriptName === 'production' ? servicesProd :
    scriptName === 'development' ? servicesDev : {};

module.exports = {
    projectRootDir, systemDir, localProjectDir, servicesDev, servicesProd,
    servicesEnv, scriptName,
    cacheKeys: {
        coreCommon: 'core_common',
        coreBackend: 'core_backend',
        coreFrontend: 'core_frontend',
        server: 'server',
        renderer: 'renderer',
        adminPanel: 'admin_panel'
    },
    cachePath: resolve(systemDir, '.cromwell/cache'),
    cacheKey: 'CromwellProcessManager',
    cleanCacheOnStart: false,

    /** Close all services when manager process is being closed */
    closeAllOnExit: true,
    windowsDev: {
        services: {

        },
        panelWidth: 0.30, // 30%
        corePanelHeight: 0.3,
        rendererHeigth: 0.3,
        serverHeigth: 0.3,
        padding: 25, // 25px
        overlayShift: 35,
        /** Number of monitor to use. If null, will bind to active one at the start of the script */
        monitorNum: 0,
        /** Will look into cache and spawn a new terminal instance only if there's no terminals with the same title & pid */
        startIfNotFound: true,
        watch: true,
        watchPollTimeout: 1000, // ms
        overallTimeout: 0,
        /**  Will run terminal with "npm run watch" for every dir: */
        otherDirs: [
            "themes\\cromwell-demoshop",
            // "plugins\\ProductFilter"
        ]
    }
}