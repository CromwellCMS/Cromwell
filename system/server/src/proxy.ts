import { serviceLocator, setStoreItem } from '@cromwell/core';
import { readCMSConfigSync } from '@cromwell/core-backend/dist/helpers/cms-settings';
import { getLogger } from '@cromwell/core-backend/dist/helpers/logger';
import http from 'http';
import httpProxy from 'http-proxy';
import nodeCleanup from 'node-cleanup';
import yargs from 'yargs-parser';

import { closeAllServers, getServerPort, launchServerManager, serverAliveWatcher } from './helpers/server-manager';

const logger = getLogger();

async function main(): Promise<void> {
    const args = yargs(process.argv.slice(2));
    let argsPort: number | undefined = parseInt(args.port + '');
    if (isNaN(argsPort)) argsPort = undefined;

    const config = readCMSConfigSync();
    setStoreItem('cmsSettings', config);

    const port = process.env.API_PORT ?? argsPort ?? 4016;

    // Start a proxy at the server port. Actual server will be launched at random port.
    // This way we can dynamically spawn new server instances and switch between them via proxy
    // with zero downtime. Why do we need this? For example, when a plugin installed, server has to restart
    // to apply plugin's backend. Outage is not an option for production server, right?
    const proxy = await httpProxy.createProxyServer();
    proxy.on('error', function (err) {
        logger.error(err);
    });

    const server = http.createServer((req, res) => {

        const proxyApiServer = () => {
            const serverPort = getServerPort();
            if (serverPort) {
                proxy.web(req, res, {
                    target: `http://localhost:${serverPort}`
                });
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(JSON.stringify({
                    message: 'INTERNAL SERVER ERROR. Proxy: Server is down',
                    code: 500,
                }, null, 2));
            }
        }

        if (req?.url) {
            if (req.url.startsWith('/admin/') || req.url === '/admin' || req.url.startsWith('/admin?')) {
                proxy.web(req, res, {
                    target: serviceLocator.getAdminUrl()
                });
            } else if (req.url.startsWith('/api/') || req.url === '/api') {
                proxyApiServer();
            } else {
                proxy.web(req, res, {
                    target: serviceLocator.getFrontendUrl(),
                });
            }
        } else {
            proxyApiServer();
        }
    });

    await launchServerManager(argsPort, args.init);

    server.on("error", err => logger.log(err));
    await server.listen(port);
    logger.info(`Proxy Server is running on: http://localhost:${port}`);

    serverAliveWatcher();
}

nodeCleanup(() => {
    closeAllServers();
});

main();
