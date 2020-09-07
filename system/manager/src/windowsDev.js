const { windowManager } = require("node-window-manager");
const { execSync } = require('child_process');
const isRunning = require('is-running');
const config = require('./config');
const { saveProcessPid, getProcessPid, getGlobalCache } = require('./cacheManager');

const winStart = () => {

    const { projectRootDir } = config;
    const { panelWidth, corePanelHeight, rendererHeigth, serverHeigth, padding, overlayShift,
        monitorNum, startIfNotFound, watch, watchPollTimeout,
        overallTimeout, otherDirs } = config.windowsDev;

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

    const startTerminal = (title, command, bounds, timeout) => {

        const pid = getProcessPid(title)
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


    const winUpdateCycle = () => {
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
                winUpdateCycle();
            }, watchPollTimeout)
        }
    }

    winUpdateCycle();

}

const winKillAll = () => {
    const globalCache = getGlobalCache();
    if (globalCache) {
        Object.keys(globalCache).forEach(key => {
            const pid = globalCache[key];
            // console.log(`pid ${pid} key ${key}`);
            if (isRunning(pid)) {
                console.log(`Taskkill /PID ${pid}`);
                try {
                    execSync(`Taskkill /PID ${pid} /F /T`);
                } catch (e) { console.log(e) }
            }
        })
    }
}

module.exports = {
    winKillAll, winStart
}