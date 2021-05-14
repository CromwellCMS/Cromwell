import { sleep } from '@cromwell/core';
import { getLogger, getServerBuildPath, serverMessages } from '@cromwell/core-backend';
import { ChildProcess, fork } from 'child_process';
import fs from 'fs-extra';
import tcpPortUsed from 'tcp-port-used';

import { loadEnv } from './loadEnv';
import { restartMessage } from './constants';

const logger = getLogger();

type ServerInfo = {
    port?: number;
    childInst?: ChildProcess;
}
const serverInfo: ServerInfo = {};
let isRestarting = false;
let isPendingRestart = false;

export const getServerPort = () => serverInfo.port;

/** Used only at app startup. Should not be called from some other place */
export const launch = async () => {
    if (serverInfo.port) {
        logger.warn('Proxy serverManager: called launch, but Server was already launched!')
    }
    try {
        const info = await makeServer();
        if (info.port) updateServerInfo(info);
    } catch (error) {
        logger.error('Proxy could not launch server', error);
    }

}

const makeServer = async (): Promise<ServerInfo> => {
    const info: ServerInfo = {};
    const env = loadEnv();

    const buildPath = getServerBuildPath();
    if (!buildPath || !fs.existsSync(buildPath)) {
        logger.error('Proxy could not find proxy build at: ' + buildPath);
        throw new Error('')
    }

    const serverProc = fork(buildPath, [env.scriptName],
        { stdio: 'inherit', cwd: process.cwd() });

    info.childInst = serverProc;
    let hasReported = false;

    await new Promise(done => {
        setTimeout(() => {
            if (!hasReported) done(false);
        }, 10000);

        serverProc.on('message', (message) => {
            let msg;
            try {
                msg = JSON.parse(String(message));
            } catch (error) {
                logger.error(error);
            }

            if (msg.message === restartMessage) {
                restartServer();
            }

            if (msg.message === serverMessages.onStartMessage) {
                if (process.send) process.send(serverMessages.onStartMessage);
                info.port = msg.port
                hasReported = true;
                done(true);
            }

            if (msg.message === serverMessages.onStartErrorMessage) {
                if (process.send) process.send(serverMessages.onStartErrorMessage);
                hasReported = true;
                done(false);
            }
        });
    });

    if (info.port) return info;

    throw new Error('Proxy::makeServer: Failed to start server');
}

const closeServer = async (info: ServerInfo) => {
    info.childInst?.kill();
}

/** Safely restarts server instance */
const restartServer = async () => {
    if (isRestarting) {
        isPendingRestart = true;
        return;
    }

    isRestarting = true;

    // Make new server first
    let newServer: ServerInfo;
    const oldServer = { ...serverInfo };
    try {
        newServer = await makeServer();
        await tcpPortUsed.waitUntilUsed(newServer.port, 500, 4000);
    } catch (error) {
        logger.error('Failed to make new server', error);
        isRestarting = false;

        if (isPendingRestart) {
            isPendingRestart = false;
            await restartServer();
        }

        return;
    }

    await sleep(0.5);
    // Update info to redirect proxy on the new server
    updateServerInfo(newServer);

    // Wait for the case if the old server is still processing long heavy requests
    await sleep(4);

    // Kill the old server
    try {
        await closeServer(oldServer);
        await tcpPortUsed.waitUntilFree(oldServer.port, 500, 5000);
    } catch (error) {
        logger.error('Failed to kill old server', error);
    }

    isRestarting = false;

    if (isPendingRestart) {
        isPendingRestart = false;
        await restartServer();
    }
}

const updateServerInfo = (info: ServerInfo) => {
    Object.keys(info).forEach(key => {
        serverInfo[key] = info[key];
    })
}

export const serverAliveWatcher = async () => {
    await sleep(60);

    let isAlive = true;

    if (!serverInfo.port) {
        isAlive = false;
    }
    try {
        if (serverInfo.port) {
            isAlive = await tcpPortUsed.check(serverInfo.port, '127.0.0.1');
        }
    } catch (error) { }

    if (!isAlive) {
        logger.error('serverAliveWatcher: Server is not alive. Restarting...');
        await restartServer();
    }

    serverAliveWatcher();
}