const { resolve } = require('path');
const projectRootDir = resolve(__dirname, '../../');

module.exports = {
    projectRootDir,
    cachePath: projectRootDir + '\\system\\.cromwell\\cache',
    cacheKey: 'CromwellProcessManager',
    cleanCacheOnStart: false,
    /** Close all services when manager process is being closed */
    closeAllOnExit: true,
    windowsDev: {
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
        // Will run terminal with "npm run watch" for every dir:
        otherDirs: [
            "themes\\cromwell-demoshop",
            "plugins\\ProductFilter"
        ]
    }
}