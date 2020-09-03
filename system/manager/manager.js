const { projectRootDir, closeAllOnExit } = require('./config');
const { winStart, winKillAll } = require('./windowsDev');
const { fork } = require("child_process");
const nodeCleanup = require('node-cleanup');
const isRunning = require('is-running');
const { globalCache, saveProcessPid, loadCache } = require('./cacheManager');


loadCache(() => {
    /**
     * @scriptName
     * render - run Renderer process with 'next build' command
     * start - run prod Server, prod AdminPanel, prod Renderer with 'next start'
     * winDev - start dev environment in Windows OS
     */
    const scriptName = process.argv[2];

    if (closeAllOnExit) {
        nodeCleanup(function (exitCode, signal) {
            console.log('globalCache', exitCode, globalCache);
            if (scriptName === 'winDev') {
                winKillAll(globalCache);
            }
            if (scriptName === 'start') {
                if (globalCache) {
                    Object.keys(globalCache).forEach(key => {
                        const pid = globalCache[key];
                        if (isRunning(pid)) {
                            try {
                                console.log('pid', pid)
                                // process.kill(pid)
                            } catch (e) { console.log(e) }
                        }
                    })
                }
            }
        });
    }

    if (scriptName === 'winDev') {
        winStart();
    }

    if (scriptName === 'start') {
        const proc = fork(`${projectRootDir}\\system\\server\\startup.js`, ['prod']);
        saveProcessPid('server', proc.pid);

        const proc2 = fork(`${projectRootDir}\\system\\renderer\\startup.js`, ['start']);
        saveProcessPid('renderer', proc2.pid);

    }

    if (scriptName === 'render') {
        const proc2 = fork(`${projectRootDir}\\system\\renderer\\startup.js`, ['build']);
    }

})




