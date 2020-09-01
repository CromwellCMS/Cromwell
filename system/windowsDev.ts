import { windowManager, Window } from "node-window-manager";
import { IRectangle } from "node-window-manager/dist/interfaces";
import { exec, execSync, spawn, execFile, execFileSync, fork, spawnSync } from 'child_process';
import { resolve } from 'path';
const nodeCleanup = require('node-cleanup');
const cacache = require('cacache')
const crypto = require("crypto");
const isRunning = require('is-running');

// < VARIABLES >
const projectRootDir = resolve(__dirname, '../');

const panelWidth = 0.30; // 30%
const corePanelHeight = 0.3;
const rendererHeigth = 0.3;
const serverHeigth = 0.3;

const padding = 25; // 25px
const overlayShift = 35;

/** Number of monitor to use. If undefined, will bind to active one at the start of the script */
const monitorNum: number | undefined = 0;

/** Will look into cache and spawn a new terminal instance only if there's no terminals with the same title & pid */
const startIfNotFound = true;

const watch = true;
const watchPollTimeout = 1000; // ms

/** Close all watchers when this process is being closed */
const closeAllOnExit = true;

const cleanCacheOnStart = false;

const overallTimeout = 0;

// Will run terminal with "npm run watch" for every dir:
const otherDirs = ['themes\\cromwell-demoshop', 'plugins\\ProductFilter'];

const cachePath = projectRootDir + '\\system\\renderer\\.cromwell\\cache';
const cacheKey = 'cromwellWindows';

// < / VARIABLES >


let globalCache: Record<string, number> = {};

windowManager.requestAccessibility();

const monitor = monitorNum !== undefined ? windowManager.getMonitors()[monitorNum] : windowManager.getActiveWindow().getMonitor()
const monitorBounds = monitor.getBounds();
console.log('monitorBounds', monitorBounds);


const saveWindowPid = (title: string, pid: number) => {
    globalCache[title] = pid;
    cacache.put(cachePath, cacheKey, JSON.stringify(globalCache))
}

const getWindowPid = (title: string): number | undefined => {
    return globalCache[title];
}

const startTerminal = (title: string, command: string, bounds: IRectangle, timeout?: number) => {

    const pid = getWindowPid(title)
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
    let newPid: any = execSync(sumComand).toString();
    // console.log('startTerminal childProcess newPid: ', newPid);
    newPid = parseInt(newPid);
    if (newPid && !isNaN(newPid)) {
        saveWindowPid(title, newPid);
        windowManager.getWindows().forEach(w => {
            if (w.processId === newPid) {
                // console.log('w.processId', w.getTitle(), w.id, w.processId);
                w.setBounds(bounds)
            }
        })
    }
}


const startX = monitorBounds.x + monitorBounds.width * (1 - panelWidth);
const maxWidth = monitorBounds.width * panelWidth;

const coreWindowWidth = monitorBounds.width * panelWidth / 3;
const coreHeigth = monitorBounds.height * corePanelHeight;
const coreStartY = monitorBounds.y + monitorBounds.height * (1 - corePanelHeight);

const run = () => {
    // console.log('globalCache', globalCache);

    // CORE
    startTerminal('core_common', `cd ${projectRootDir}\\system\\core\\common && npm run watch`, {
        x: startX + coreWindowWidth,
        y: coreStartY,
        height: coreHeigth,
        width: coreWindowWidth + padding
    });
    startTerminal('core_backend', `cd ${projectRootDir}\\system\\core\\backend && npm run watch`, {
        x: startX + coreWindowWidth * 2,
        y: coreStartY,
        height: coreHeigth,
        width: coreWindowWidth + padding
    });
    startTerminal('core_frontend', `cd ${projectRootDir}\\system\\core\\frontend && npm run watch`, {
        x: startX,
        y: coreStartY,
        height: coreHeigth,
        width: coreWindowWidth + padding
    });

    // SERVER
    startTerminal('server', `cd ${projectRootDir}\\system\\server && npm run dev`, {
        x: startX,
        y: monitorBounds.y,
        height: monitorBounds.height * serverHeigth + padding,
        width: maxWidth - overlayShift + padding
    }, 5);

    // RENDERER
    startTerminal('renderer', `cd ${projectRootDir}\\system\\renderer && npm run dev`, {
        x: startX,
        y: monitorBounds.y + monitorBounds.height * serverHeigth,
        height: monitorBounds.height * rendererHeigth + padding,
        width: maxWidth + padding
    }, 10);

    // ADMIN PANEL
    startTerminal('admin_panel', `cd ${projectRootDir}\\system\\admin-panel && npm run dev`, {
        x: startX + overlayShift,
        y: monitorBounds.y,
        height: monitorBounds.height * serverHeigth + padding,
        width: maxWidth - overlayShift + padding
    }, 10);

    // Templates & Plugins
    otherDirs.forEach((dir, i) => {
        startTerminal(dir, `cd ${projectRootDir}\\${dir} && npm run watch`, {
            x: startX + i * overlayShift,
            y: monitorBounds.y + monitorBounds.height * serverHeigth + monitorBounds.height * rendererHeigth,
            height: monitorBounds.height * rendererHeigth / 2,
            width: maxWidth - (otherDirs.length - 1) * overlayShift
        }, 10);
    })

    if (watch) {
        setTimeout(() => {
            run();
        }, watchPollTimeout)
    }
}

if (watch && closeAllOnExit) {
    nodeCleanup(function (exitCode, signal) {
        console.log('globalCache', exitCode, globalCache);
        if (globalCache) {
            Object.keys(globalCache).forEach(key => {
                const pid = globalCache[key];
                // console.log(`pid ${pid} key ${key}`);
                if (isRunning(pid)) {
                    console.log(`Taskkill /PID ${pid}`);
                    try {
                        execSync(`Taskkill /PID ${pid} /F /T`);
                    } catch (e) { }
                }
            })
        }
    });
}

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
        run();
    }, 100);
})

