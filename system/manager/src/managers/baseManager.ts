import { getCoreBackendDir, getCoreCommonDir, getCoreFrontendDir, getLogger, getModulePackage } from '@cromwell/core-backend';
import { setStoreItem } from '@cromwell/core';
import { ChildProcess, fork, spawn } from 'child_process';
import isRunning from 'is-running';
import { resolve } from 'path';
import treeKill from 'tree-kill';

import config from '../config';
import { serviceNames, TServiceNames, TScriptName } from '../constants';
import { checkModules } from '../tasks/checkModules';
import { getProcessPid, loadCache, saveProcessPid } from '../utils/cacheManager';
import { startAdminPanel, closeAdminPanel } from './adminPanelManager';
import { startRenderer, closeRenderer } from './rendererManager';
import { startServer, closeServer } from './serverManager';

const logger = getLogger('detailed');
const errorLogger = getLogger('errors-only');
const { cacheKeys, servicesEnv } = config;

export const closeService = async (name: string): Promise<boolean> => {
    return new Promise(done => {
        getProcessPid(name, (pid: number) => {
            treeKill(pid, 'SIGKILL', async (err) => {
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
        })
    })

}

export const startService = async (path: string, name: string, args: string[], dir?: string, sync?: boolean): Promise<ChildProcess> => {
    const proc = fork(path, args, { stdio: sync ? 'inherit' : 'pipe', cwd: dir ?? process.cwd() });
    await saveProcessPid(name, proc.pid);
    proc?.stdout?.on('data', buff => errorLogger.log(buff?.toString?.() ?? buff));
    proc?.stderr?.on('data', buff => errorLogger.log(buff?.toString?.() ?? buff));
    return proc;
}

export const isServiceRunning = (name: string): Promise<boolean> => {
    return new Promise(done => {
        getProcessPid(name, (pid: number) => {
            done(isRunning(pid));
        })
    })
}


export const startSystem = async (scriptName: TScriptName) => {

    const isDevelopment = scriptName === 'development';

    setStoreItem('environment', {
        mode: isDevelopment ? 'dev' : 'prod',
        logLevel: isDevelopment ? 'detailed' : 'errors-only'
    })

    await new Promise(resolve => loadCache(resolve));

    if (scriptName === 'build') {
        await startServer('build');
        await startAdminPanel('build');
        await startRenderer('buildService');

        return;
    }

    await closeSystem();

    if (isDevelopment) {

        spawn(`npx rollup -cw`, [],
            { shell: true, stdio: 'inherit', cwd: getCoreCommonDir() });
        spawn(`npx rollup -cw`, [],
            { shell: true, stdio: 'inherit', cwd: getCoreBackendDir() });
        spawn(`npx rollup -cw`, [],
            { shell: true, stdio: 'inherit', cwd: getCoreFrontendDir() });

        const { windowsDev } = config;

        windowsDev.otherDirs.forEach((dir, i) => {
            spawn(`npx rollup -cw`, [],
                { shell: true, stdio: 'inherit', cwd: resolve(process.cwd(), dir) });
        });
    }

    await saveProcessPid(cacheKeys.manager, process.pid)

    await startServer();
    await startAdminPanel();
    await startRenderer();
}


export const startServiceByName = async (serviceName: TServiceNames, isDevelopment?: boolean) => {

    if (!serviceNames.includes(serviceName)) {
        errorLogger.error('Invalid service name. Available names are: ' + serviceNames);
    }

    setStoreItem('environment', {
        mode: isDevelopment ? 'dev' : 'prod',
        logLevel: isDevelopment ? 'detailed' : 'errors-only'
    })

    if (serviceName === 'adminPanel' || serviceName === 'a') {
        const pckg = getModulePackage('@cromwell/admin-panel')
        await checkModules(isDevelopment, pckg ? [pckg] : undefined);
        await startAdminPanel(isDevelopment ? 'dev' : 'prod');
    }

    if (serviceName === 'renderer' || serviceName === 'r') {
        await checkModules(isDevelopment);
        await startRenderer(isDevelopment ? 'dev' : 'prod');
    }

    if (serviceName === 'server' || serviceName === 's') {
        await startServer(isDevelopment ? 'dev' : 'prod');
    }

}


export const closeSystem = async () => {
    await closeAdminPanel();
    await closeRenderer();
    await closeServer();
    await closeService(cacheKeys.manager);
}