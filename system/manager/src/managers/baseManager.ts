import { getStoreItem, setStoreItem, TServiceVersions } from '@cromwell/core';
import {
    extractServiceVersion,
    getCoreBackendDir,
    getCoreCommonDir,
    getCoreFrontendDir,
    getLogger,
    getModulePackage,
} from '@cromwell/core-backend';
import { getRestAPIClient } from '@cromwell/core-frontend';
import { ChildProcess, fork, spawn } from 'child_process';
import isRunning from 'is-running';
import { resolve } from 'path';
import tcpPortUsed from 'tcp-port-used';
import treeKill from 'tree-kill';

import config from '../config';
import { serviceNames, TScriptName, TServiceNames } from '../constants';
import { checkConfigs, checkModules } from '../tasks/checkModules';
import { getProcessPid, loadCache, saveProcessPid } from '../utils/cacheManager';
import { closeAdminPanel, startAdminPanel } from './adminPanelManager';
import { closeNginx, startNginx } from './dockerManager';
import { closeRenderer, startRenderer } from './rendererManager';
import { closeServer, startServer } from './serverManager';

const logger = getLogger();
const { cacheKeys } = config;
const serviceProcesses: Record<string, ChildProcess> = {};

export const closeService = async (name: string): Promise<boolean> => {
    return new Promise(done => {
        const kill = (pid: number) => {
            treeKill(pid, 'SIGTERM', async (err) => {
                if (err) logger.log(err);
                if (err) {
                    const isActive = await isServiceRunning(name);
                    if (isActive) {
                        logger.log(`BaseManager::closeService: failed to close service ${name} by pid. Service is still active!`);
                        done(false);
                    } else {
                        logger.log(`BaseManager::closeService: failed to close service ${name} by pid. Service already closed. Return success=true`);
                        done(true);
                    }
                } else {
                    done(true);
                }
            });
        }

        const proc = serviceProcesses[name];
        if (proc) {
            proc.disconnect();
            kill(proc.pid);

        } else {
            getProcessPid(name, (pid: number) => {
                kill(pid);
            })
        }
    })
}

export const startService = async ({ path, name, args, dir, sync, watchName, onVersionChange }: {
    path: string;
    name: string;
    args: string[];
    dir?: string;
    sync?: boolean;
    watchName?: keyof TServiceVersions;
    onVersionChange?: () => Promise<void>;
}): Promise<ChildProcess> => {
    const proc = fork(path, args, { stdio: sync ? 'inherit' : 'pipe', cwd: dir ?? process.cwd() });
    await saveProcessPid(name, proc.pid);
    serviceProcesses[name] = proc;
    proc?.stdout?.on('data', buff => logger.log(buff?.toString?.() ?? buff));
    proc?.stderr?.on('data', buff => logger.error(buff?.toString?.() ?? buff));

    if (watchName && onVersionChange) {
        startWatchService(watchName, onVersionChange);
    }
    return proc;
}

export const isServiceRunning = (name: string): Promise<boolean> => {
    return new Promise(done => {
        getProcessPid(name, (pid: number) => {
            done(isRunning(pid));
        })
    })
}

export const isPortUsed = (port: number): Promise<boolean> => {
    return tcpPortUsed.check(port, '127.0.0.1');
}

export const startSystem = async (scriptName: TScriptName) => {

    const isDevelopment = scriptName === 'development';

    setStoreItem('environment', {
        mode: isDevelopment ? 'dev' : 'prod',
        logLevel: isDevelopment ? 'detailed' : 'errors-only'
    })

    await new Promise(resolve => loadCache(resolve));

    await checkConfigs();

    if (scriptName === 'build') {
        await startServer('build');
        await startAdminPanel('build');
        await startRenderer('buildService');

        return;
    }

    if (isDevelopment) {

        spawn(`npx rollup -cw`, [],
            { shell: true, stdio: 'inherit', cwd: getCoreCommonDir() });
        spawn(`npx rollup -cw`, [],
            { shell: true, stdio: 'inherit', cwd: getCoreBackendDir() });
        spawn(`npx rollup -cw`, [],
            { shell: true, stdio: 'inherit', cwd: getCoreFrontendDir() });

        const { windowsDev } = config;

        windowsDev.otherDirs.forEach((dir) => {
            spawn(`npx rollup -cw`, [],
                { shell: true, stdio: 'inherit', cwd: resolve(process.cwd(), dir) });
        });
    }

    await saveProcessPid(cacheKeys.manager, process.pid)

    await startServer(isDevelopment ? 'devMain' : 'prodMain');
    await startServer(isDevelopment ? 'devPlugin' : 'prodPlugin');
    await startAdminPanel();
    await startRenderer();

    if (!isDevelopment) {
        await startNginx(isDevelopment);
    }
}


export const startServiceByName = async (serviceName: TServiceNames, isDevelopment?: boolean) => {

    if (!serviceNames.includes(serviceName)) {
        logger.warn('Invalid service name. Available names are: ' + serviceNames);
    }

    setStoreItem('environment', {
        mode: isDevelopment ? 'dev' : 'prod',
        logLevel: isDevelopment ? 'detailed' : 'errors-only'
    });

    await checkConfigs();

    if (serviceName === 'adminPanel' || serviceName === 'a') {
        const pckg = await getModulePackage('@cromwell/admin-panel')
        await checkModules(isDevelopment, pckg ? [pckg] : undefined);
        await startAdminPanel(isDevelopment ? 'dev' : 'prod');
    }

    if (serviceName === 'renderer' || serviceName === 'r') {
        await checkModules(isDevelopment);
        await startRenderer(isDevelopment ? 'dev' : 'prod');
    }

    if (serviceName === 'server' || serviceName === 's') {
        await startServer(isDevelopment ? 'devMain' : 'prodMain');
        await startServer(isDevelopment ? 'devPlugin' : 'prodPlugin');
    }

    if (serviceName === 'nginx' || serviceName === 'n') {
        await startNginx(isDevelopment);
    }

}

export const closeServiceByName = async (serviceName: TServiceNames) => {
    if (!serviceNames.includes(serviceName)) {
        logger.warn('Invalid service name. Available names are: ' + serviceNames);
    }

    if (serviceName === 'adminPanel' || serviceName === 'a') {
        await closeAdminPanel();
    }

    if (serviceName === 'renderer' || serviceName === 'r') {
        await closeRenderer();
    }

    if (serviceName === 'server' || serviceName === 's') {
        await closeServer('main');
        await closeServer('plugin');
    }

    if (serviceName === 'nginx' || serviceName === 'n') {
        await closeNginx();
    }
}


export const closeSystem = async () => {
    await closeAdminPanel();
    await closeRenderer();
    await closeServer('main');
    await closeServer('plugin');
    await closeService(cacheKeys.manager);
}

/**
 * Tries to fetch service's instance version from Server/DB to check it with current one in memory.
 * If the request succeeds (server can not be running at all) and versions are different
 * it'll trigger once callback that can handle, for instance, service restart.
 * 
 * For example, this way we can change active Theme name in Admin panel, increment Renderer's version in DB
 * and Renderer will restart automatically with new Theme. Moreover it works with scaling,
 * if we host multiple instances of a service and do load-balancing. All instances of Renderer
 * wherever they are, can restart independently at once when theme has been changed.
 * This behavior can be disabled by setting `useWatch: false` in cmsconfig.json
 * @param serviceName 
 */
export const startWatchService = async (serviceName: keyof TServiceVersions, onVersionChange: () => Promise<void>) => {
    const currentSettings = getStoreItem('cmsSettings');
    // currentVersion will be null, until request succeeds. If it does and version is not
    // set at server, it'll have undefined value. That allows to differ cases when 
    // Server has not been launched or became unavalibele for some reason after launch
    let currentVersion: number | null | undefined = null;

    try {
        const remoteSettings = await getRestAPIClient()?.getCmsSettings();
        if (remoteSettings) {
            const remoteVersion = extractServiceVersion(remoteSettings, serviceName);
            currentVersion = remoteVersion;
        } else {
            currentVersion = null
        }
    } catch (e) {
        // console.error(e)
    }

    const watchService = async (serviceName: keyof TServiceVersions) => {
        const currentSettings = getStoreItem('cmsSettings');
        try {
            const remoteSettings = await getRestAPIClient()?.getCmsSettings();
            const remoteVersion = extractServiceVersion(remoteSettings, serviceName);

            if (currentVersion !== null && remoteVersion && remoteVersion !== currentVersion) {
                // new version is set in DB, save it and restart service
                currentVersion = remoteVersion;
                onVersionChange();
                return;
            }

            if (currentVersion === null && remoteSettings) {
                currentVersion = remoteVersion;
            }
        } catch (e) { }

        setTimeout(() => {
            watchService(serviceName);
        }, currentSettings?.watchPoll ?? 2000);
    }

    setTimeout(() => {
        watchService(serviceName);
    }, currentSettings?.watchPoll ?? 2000);
}

export const killByPid = async (pid: number) => {
    const success = await new Promise<boolean>(done => {
        treeKill(pid, 'SIGTERM', async (err) => {
            const running = isRunning(pid);
            done(!!err && !running)
        });
    })
    return success;
}