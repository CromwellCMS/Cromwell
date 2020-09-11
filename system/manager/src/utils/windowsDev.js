const { windowManager } = require("node-window-manager");
const { execSync } = require('child_process');
const isRunning = require('is-running');
const config = require('../config');
const { saveProcessPid, getProcessPid, getAllServices, loadCache, getRunTimeCache } = require('./cacheManager');
const nodeCleanup = require('node-cleanup');
const { winKillPid } = require('./winUtils');
const { resolve } = require("path");

const winStart = () => {

    const { projectRootDir, closeAllOnExit, cacheKeys, windowsDevServices } = config;
    const { panelWidth, corePanelHeight, rendererHeigth, serverHeigth, padding, overlayShift,
        monitorNum, startIfNotFound, watch, watchPollTimeout,
        overallTimeout, otherDirs } = config.windowsDev;

    const services = windowsDevServices;

    if (closeAllOnExit) {
        nodeCleanup(function (exitCode, signal) {
            winKillAll();
        });
    }

    windowManager.requestAccessibility();

    const monitor = monitorNum !== null ? windowManager.getMonitors()[monitorNum] : windowManager.getActiveWindow().getMonitor()
    const monitorBounds = monitor.getBounds();
    console.log('monitorBounds', monitorBounds);

    // console.log('globalCache', globalCache);

    const startX = monitorBounds.x + monitorBounds.width * (1 - panelWidth);
    const maxWidth = monitorBounds.width * panelWidth;

    const coreWindowWidth = monitorBounds.width * panelWidth / 3;
    const coreHeigth = monitorBounds.height * corePanelHeight;
    const coreStartY = monitorBounds.y + monitorBounds.height * (1 - corePanelHeight);

    const startTerminal = async (title, command, bounds, timeout) => {

        const pid = await new Promise(res => {
            getProcessPid(title, (pid) => {
                res(pid)
            })
        });

        // console.log('startTerminal window title: ', title, 'pid: ', pid)

        if (startIfNotFound && pid && isRunning(pid)) {
            // console.log('process ' + pid + ' is running, skip');
            return;
        }

        // console.log('process ' + pid + ' is NOT running, starting a new instance');
        const defaultTimeout = 3;
        const finalTimeout = (timeout ? timeout + defaultTimeout : defaultTimeout) + overallTimeout;
        console.log('starting terminal for: ', title, '\ncommand:', command)
        const sumComand = `powershell "$app = Start-Process cmd.exe -ArgumentList '/k title ${title} timeout /t ${finalTimeout} && ${command}' -passthru; $app.Id"`;
        let newPid = execSync(sumComand).toString();
        // console.log('startTerminal childProcess newPid: ', newPid);
        newPid = parseInt(newPid);
        if (newPid && !isNaN(newPid)) {
            saveProcessPid(title, newPid);
            windowManager.getWindows().forEach(w => {
                if (w.processId === newPid) {
                    // console.log('w.processId', w.getTitle(), w.id, w.processId);
                    w.setBounds(bounds)
                }
            })
        }

    }


    const winUpdateCycle = async () => {
        // CORE
        if (services.coreCommon) {
            await startTerminal(cacheKeys.coreCommon, `cd ${projectRootDir}\\system\\core\\common && npm run ${services.coreCommon}`, {
                x: startX + coreWindowWidth,
                y: coreStartY,
                height: coreHeigth,
                width: coreWindowWidth + padding
            });
        }

        if (services.coreBackend) {
            await startTerminal(cacheKeys.coreBackend, `cd ${projectRootDir}\\system\\core\\backend && npm run ${services.coreBackend}`, {
                x: startX + coreWindowWidth * 2,
                y: coreStartY,
                height: coreHeigth,
                width: coreWindowWidth + padding
            });
        }

        if (services.coreFrontend) {
            await startTerminal(cacheKeys.coreFrontend, `cd ${projectRootDir}\\system\\core\\frontend && npm run ${services.coreFrontend}`, {
                x: startX,
                y: coreStartY,
                height: coreHeigth,
                width: coreWindowWidth + padding
            });
        }

        if (services.server) {
            // SERVER
            await startTerminal(cacheKeys.server, `cd ${projectRootDir}\\system\\server && npm run ${services.server}`, {
                x: startX,
                y: monitorBounds.y,
                height: monitorBounds.height * serverHeigth + padding,
                width: maxWidth - overlayShift + padding
            }, 5);
        }

        if (services.renderer) {
            // RENDERER
            await startTerminal(cacheKeys.renderer, `cd ${projectRootDir}\\system\\renderer && npm run ${services.renderer}`, {
                x: startX,
                y: monitorBounds.y + monitorBounds.height * serverHeigth,
                height: monitorBounds.height * rendererHeigth + padding,
                width: maxWidth + padding
            }, 10);
        }

        if (services.adminPanel) {
            // ADMIN PANEL
            await startTerminal(cacheKeys.adminPanel, `cd ${projectRootDir}\\system\\admin-panel && npm run ${services.adminPanel}`, {
                x: startX + overlayShift,
                y: monitorBounds.y,
                height: monitorBounds.height * serverHeigth + padding,
                width: maxWidth - overlayShift + padding
            }, 10);
        }

        if (services.manager) {
            // MANAGER
            await startTerminal(cacheKeys.manager, `cd ${projectRootDir}\\system\\manager && npm run ${services.manager}`, {
                x: startX + overlayShift,
                y: monitorBounds.y,
                height: monitorBounds.height * serverHeigth + padding,
                width: maxWidth - overlayShift + padding
            }, 10);
        }

        if (services.other) {
            // Templates & Plugins
            let index = 0;
            for (const dir of otherDirs) {
                const fullDir = resolve(projectRootDir, dir);
                await startTerminal(dir, `cd ${fullDir} && npm run ${services.other}`, {
                    x: startX + index * overlayShift,
                    y: monitorBounds.y + monitorBounds.height * serverHeigth + monitorBounds.height * rendererHeigth,
                    height: monitorBounds.height * rendererHeigth / 2,
                    width: maxWidth - (otherDirs.length - 1) * overlayShift
                }, 10);
                index++;
            }
        }

        if (watch) {
            setTimeout(() => {
                winUpdateCycle();
            }, watchPollTimeout)
        }
    }

    winUpdateCycle();

}

const winKillAll = () => {
    const globalCache = getRunTimeCache();
    // console.log('globalCache', globalCache);
    if (globalCache) {
        Object.keys(globalCache).forEach(key => {
            const pid = globalCache[key];
            // console.log(`pid ${pid} key ${key}`);
            winKillPid(pid);
        })
    }
}




loadCache(() => {
    winStart();
});