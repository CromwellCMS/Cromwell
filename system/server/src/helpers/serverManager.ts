import { getRandStr, sleep } from '@cromwell/core';
import { getLogger, getServerBuildPath, serverMessages } from '@cromwell/core-backend';
import { ChildProcess, fork } from 'child_process';
import fs from 'fs-extra';
import tcpPortUsed from 'tcp-port-used';

import { loadEnv } from './loadEnv';
import { restartMessage } from './constants';

const logger = getLogger();

/**
 * Proxy manager
 */

type ServerInfo = {
    id?: string;
    port?: number;
    childInst?: ChildProcess;
}
const activeServer: ServerInfo & {
    proxyPort?: number
} = {};
let isRestarting = false;
let isPendingRestart = false;
const madeServers: Record<string, ServerInfo> = {};

export const getServerPort = () => activeServer.port;


/** Used only at Proxy startup. Should not be called from any other place */
export const launchServerManager = async (proxyPort?: number) => {
    activeServer.proxyPort = proxyPort;
    if (activeServer.port) {
        logger.warn('Proxy serverManager: called launch, but Server was already launched!')
    }
    try {
        const info = await makeServer();
        updateActiveServer(info);
    } catch (error) {
        logger.error('Proxy could not launch server', error);
    }
}

const makeServer = async (): Promise<ServerInfo> => {
    logger.info('Proxy manger: making new server...');
    const info: ServerInfo = {};
    const env = loadEnv();
    const serverId = getRandStr(8);
    info.id = serverId;

    const buildPath = getServerBuildPath();
    if (!buildPath || !fs.existsSync(buildPath)) {
        logger.error('Proxy could not find proxy build at: ' + buildPath);
        throw new Error('')
    }

    const serverProc = fork(
        buildPath,
        [
            env.scriptName,
            activeServer.proxyPort ? `proxy-port=${activeServer.proxyPort}` : ''
        ],
        { stdio: 'inherit', cwd: process.cwd() }
    );

    parentRegisterChild(serverProc, info);
    info.childInst = serverProc;
    let hasReported = false;

    await new Promise(done => {
        setTimeout(() => {
            if (!hasReported) done(false);
        }, 15000);

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
    logger.info('Proxy manger: killing server...');
    info.childInst?.kill();
}

/** Safely restarts server instance */
const restartServer = async () => {
    if (isRestarting) {
        isPendingRestart = true;
        return;
    }
    logger.info('Proxy manger: restarting server...');

    isRestarting = true;

    // Make new server first
    let newServer: ServerInfo;
    const oldServer = { ...activeServer };
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
    updateActiveServer(newServer);

    // Wait in case if the old server is still processing any long-lasting requests
    await sleep(4);

    // Kill the old server
    try {
        await closeServer(oldServer);
        await tcpPortUsed.waitUntilFree(oldServer.port, 500, 5000);
    } catch (error) {
        logger.error('Failed to kill old server at ' + oldServer.port, error);
    }

    isRestarting = false;

    if (isPendingRestart) {
        isPendingRestart = false;
        await restartServer();
    }
}

const updateActiveServer = (info: ServerInfo) => {
    Object.keys(info).forEach(key => {
        activeServer[key] = info[key];
    })
}

export const serverAliveWatcher = async () => {
    await sleep(60);

    // Watch for the active server and if it's not alive for some reason, restart / make new
    let isAlive = true;
    if (!activeServer.port) {
        isAlive = false;
    }
    try {
        if (activeServer.port) {
            isAlive = await tcpPortUsed.check(activeServer.port, '127.0.0.1');
        }
    } catch (error) { }

    if (!isAlive) {
        logger.error('serverAliveWatcher: Server is not alive. Restarting...');
        await restartServer();
    }

    // Watch for other created servers that aren't active and kill them.
    // Basically they shouldn't be created in the first place, but we have 
    // IPC API for child servers and they can create new instances, so who knows...
    for (const info of Object.values(madeServers)) {
        if (info?.port && info.port !== activeServer.port && info.childInst) {
            if (await checkServerAlive(info)) {
                // Found other server that is alive
                setTimeout(async () => {
                    try {
                        if (info?.port && info.port !== activeServer.port && await tcpPortUsed.check(info.port, '127.0.0.1')) {
                            // If after 50 seconds it's still alive and is not active, kill it
                            await closeServer(info)
                            info.childInst = undefined;
                            info.port = undefined;
                        }
                    } catch (error) {
                        logger.error(error);
                    }
                }, 50000);
            }
        }
    }

    serverAliveWatcher();
}

const checkServerAlive = async (info: ServerInfo) => {
    if (info?.port) {
        try {
            if (await tcpPortUsed.check(info.port, '127.0.0.1')) {
                return true;
            }
        } catch (error) {
            logger.error(error);
        }
    }
    return false;
}

const onMessageCallbacks: (((msg: any) => any) | undefined)[] = [];

export const childRegister = (port: number) => {
    updateActiveServer({ port });

    if (process.send) process.send(JSON.stringify({
        message: serverMessages.onStartMessage,
        port: port,
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
        port: activeServer.port,
        message,
        payload,
    } as IPCMessage));

    const resp = await responsePromise;
    delete onMessageCallbacks[onMessageCallbacks.indexOf(cb)];
    return resp;
}

const parentRegisterChild = (child: ChildProcess, childInfo: ServerInfo) => {
    child.on('message', async (msg: any) => {
        try {
            const message: IPCMessage = JSON.parse(msg);

            if (message.message === 'make-new') {
                try {
                    const info = await makeServer();
                    if (!info.port) throw new Error('!info.port')
                    if (!(await checkServerAlive(info))) throw new Error('new server is not alive')

                    if (await checkServerAlive(childInfo)) {
                        child.send(JSON.stringify({
                            id: message.id,
                            message: 'success',
                            payload: info.id,
                        } as IPCMessage));
                    }
                    return;

                } catch (error) {
                    if (await checkServerAlive(childInfo)) {
                        child.send(JSON.stringify({
                            id: message.id,
                            message: 'failed',
                        } as IPCMessage));
                    }

                    logger.error(error);
                    return;
                }
            }

            if (message.message === 'apply-new' && message.payload) {
                const port = madeServers[message.payload]?.port;
                if (port) {
                    const isAlive = await tcpPortUsed.check(port, '127.0.0.1');

                    if (!isAlive) {
                        if (await checkServerAlive(childInfo)) {
                            child.send(JSON.stringify({
                                id: message.id,
                                message: 'failed',
                            } as IPCMessage));
                        }
                        return;
                    } else {
                        updateActiveServer(madeServers[message.payload]);
                        await sleep(1);
                        if (await checkServerAlive(childInfo)) {
                            child.send(JSON.stringify({
                                id: message.id,
                                message: 'success',
                            } as IPCMessage));
                        }
                        return;
                    }
                }
            }

            if (message.message === 'kill-me') {
                await closeServer({
                    childInst: child
                });
                return;
            }

            if (message.message === 'restart-me') {
                await restartServer();
                return;
            }


            if (message.id) {
                if (await checkServerAlive(childInfo)) {
                    child.send(JSON.stringify({
                        id: message.id,
                        message: 'failed',
                    } as IPCMessage));
                }
            }

        } catch (error) {
            logger.error(error);
        }

    });
}

export const closeAllServers = () => {
    Object.values(madeServers).forEach(closeServer);
}