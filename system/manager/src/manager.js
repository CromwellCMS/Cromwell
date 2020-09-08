const { projectRootDir, closeAllOnExit, services, windowsDev } = require('../config');
const { fork, spawn } = require("child_process");
// const nodeCleanup = require('node-cleanup');
// const isRunning = require('is-running');
const { getGlobalCache, saveProcessPid, loadCache } = require('./cacheManager');
const { resolve } = require('path');

loadCache(() => {
    /**
     * @scriptName
     * render - run Renderer process with 'next build' command
     * start - run prod Server, prod AdminPanel, prod Renderer with 'next start'
     * winDev - start dev environment in Windows OS
     */
    const scriptName = process.argv[2];

    // if (closeAllOnExit) {
    //     nodeCleanup(function (exitCode, signal) {
    //         const globalCache = getGlobalCache();
    //         console.log('globalCache', exitCode, globalCache);
    //         if (scriptName === 'start') {
    //             if (globalCache) {
    //                 Object.keys(globalCache).forEach(key => {
    //                     const pid = globalCache[key];
    //                     if (isRunning(pid)) {
    //                         try {
    //                             console.log('pid', pid)
    //                             // process.kill(pid)
    //                         } catch (e) { console.log(e) }
    //                     }
    //                 })
    //             }
    //         }
    //     });
    // }

    if (scriptName === 'winDev') {
        const windDevPath = resolve(projectRootDir, 'src/windowsDev.js')
        spawn(`node ${windDevPath}`, [],
            { shell: true, stdio: 'inherit', cwd: projectRootDir });
    }

    if (scriptName === 'start') {

        let serverProc;
        if (services.server) {
            serverProc = fork(`${projectRootDir}\\system\\server\\startup.js`, [services.server]);
            saveProcessPid('server', serverProc.pid);
        }

        const startRederer = () => {
            if (services.rederer) {
                const proc2 = fork(`${projectRootDir}\\system\\renderer\\startup.js`, [services.rederer]);
                saveProcessPid('renderer', proc2.pid);
            }
        }

        if (serverProc) {
            serverProc.on('message', (message) => {
                if (message === 'ready') {
                    startRederer();
                }
            });
        } else {
            startRederer();
        }


        if (services.adminPanel) {
            const proc3 = fork(`${projectRootDir}\\system\\admin-panel\\startup.js`, [services.adminPanel]);
            saveProcessPid('admin_panel', proc3.pid);
        }
    }

    if (scriptName === 'dev') {

        spawn(`npx rollup -cw`, [],
            { shell: true, stdio: 'inherit', cwd: resolve(projectRootDir, 'system/core/common') });
        spawn(`npx rollup -cw`, [],
            { shell: true, stdio: 'inherit', cwd: resolve(projectRootDir, 'system/core/backend') });
        spawn(`npx rollup -cw`, [],
            { shell: true, stdio: 'inherit', cwd: resolve(projectRootDir, 'system/core/frontend') });

        const proc = fork(`${projectRootDir}\\system\\server\\startup.js`, ['dev']);
        saveProcessPid('server', proc.pid);

        const proc2 = fork(`${projectRootDir}\\system\\renderer\\startup.js`, ['dev']);
        saveProcessPid('renderer', proc2.pid);

        const proc3 = fork(`${projectRootDir}\\system\\admin-panel\\startup.js`, ['dev']);
        saveProcessPid('admin_panel', proc3.pid);

        windowsDev.otherDirs.forEach((dir, i) => {
            spawn(`npx rollup -cw`, [],
                { shell: true, stdio: 'inherit', cwd: resolve(projectRootDir, dir) });
        })
    }
})




