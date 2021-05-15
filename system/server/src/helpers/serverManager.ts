import { getRandStr, sleep } from '@cromwell/core';
import { getLogger, getServerBuildPath, serverMessages } from '@cromwell/core-backend';
import { ChildProcess, fork } from 'child_process';
import fs from 'fs-extra';
import tcpPortUsed from 'tcp-port-used';

import { loadEnv } from './loadEnv';
import { restartMessage } from './constants';

const logger = getLogger();

type ServerInfo = {
    id?: string;
    port?: number;
    childInst?: ChildProcess;
}
const serverInfo: ServerInfo = {};
let isRestarting = false;
let isPendingRestart = false;
const madeServers: Record<string, ServerInfo> = {}

export const getServerPort = () => serverInfo.port;

/** Used only at app startup. Should not be called from some other place */
export const launch = async () => {
    if (serverInfo.port) {
        logger.warn('Proxy serverManager: called launch, but Server was already launched!')
    }
    try {
        const info = await makeServer();
        updateServerInfo(info);
    } catch (error) {
        logger.error('Proxy could not launch server', error);
    }
}

const makeServer = async (): Promise<ServerInfo> => {
    const info: ServerInfo = {};
    const env = loadEnv();
    const serverId = getRandStr(8);
    info.id = serverId;

    const buildPath = getServerBuildPath();
    if (!buildPath || !fs.existsSync(buildPath)) {
        logger.error('Proxy could not find proxy build at: ' + buildPath);
        throw new Error('')
    }

    const serverProc = fork(buildPath, [env.scriptName],
        { stdio: 'inherit', cwd: process.cwd() });

    parentRegisterChild(serverProc);
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

    if (!info.port) throw new Error('Proxy::makeServer: Failed to start server');
    await tcpPortUsed.waitUntilUsed(info.port, 500, 8000);

    madeServers[serverId] = info;
    return info;
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

const onMessageCallbacks: (((msg: any) => any) | undefined)[] = [];


export const childRegister = (port: number) => {
    updateServerInfo({ port });

    if (process.send) process.send(JSON.stringify({
        message: serverMessages.onStartMessage,
        port,
    }));

    process.on('message', (m) => {
        onMessageCallbacks.forEach(cb => cb?.(m));
    });
}


type IPCMessageType = 'make-new' | 'apply-new' | 'restart-me' | 'kill-me' | 'success' | 'failed';

type IPCMessage = {
    id: string;
    message: IPCMessageType;
    payload?: any;
    port?: number;
}

export const childSendMessage = async (message: IPCMessageType, payload?: any): Promise<IPCMessage> => {
    const messageId = getRandStr(8);

    let responseResolver;
    const responsePromise = new Promise<IPCMessage>(res => responseResolver = res);
    const cb = (message) => {
        message = JSON.parse(message);
        if (message.id === messageId) {
            responseResolver(message)
        }
    }
    onMessageCallbacks.push(cb);

    if (process.send) process.send(JSON.stringify({
        id: messageId,
        port: serverInfo.port,
        message,
        payload,
    } as IPCMessage));

    const resp = await responsePromise;
    delete onMessageCallbacks[onMessageCallbacks.indexOf(cb)];
    return resp;
}

const parentRegisterChild = (child: ChildProcess) => {
    child.on('message', async (msg: any) => {
        const message: IPCMessage = JSON.parse(msg);

        if (message.message === 'make-new') {
            try {
                const info = await makeServer();
                if (!info.port) throw new Error('!info.port')

                child.send(JSON.stringify({
                    id: message.id,
                    message: 'success',
                    payload: info.id,
                } as IPCMessage));
                return;

            } catch (error) {
                child.send(JSON.stringify({
                    id: message.id,
                    message: 'failed',
                } as IPCMessage));

                logger.error(error);
                return;
            }
        }

        if (message.message === 'apply-new' && message.payload) {
            const port = madeServers[message.payload]?.port;
            if (port) {
                const isAlive = await tcpPortUsed.check(port, '127.0.0.1');

                if (!isAlive) {
                    child.send(JSON.stringify({
                        id: message.id,
                        message: 'failed',
                    } as IPCMessage));
                    return;
                } else {
                    updateServerInfo(madeServers[message.payload]);
                    await sleep(1);
                    child.send(JSON.stringify({
                        id: message.id,
                        message: 'success',
                    } as IPCMessage));
                    return;
                }
            }
        }

        if (message.message === 'kill-me') {
            child.kill();
            child.send(JSON.stringify({
                id: message.id,
                message: 'success',
            } as IPCMessage));
            return;
        }

        if (message.message === 'restart-me') {
            await restartServer();
            child.send(JSON.stringify({
                id: message.id,
                message: 'success',
            } as IPCMessage));
            return;
        }


        if (message.id) {
            child.send(JSON.stringify({
                id: message.id,
                message: 'failed',
            } as IPCMessage));
        }
    });
}