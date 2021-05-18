import { serviceLocator, setStoreItem } from '@cromwell/core';
import {
    adminPanelMessages,
    getAdminPanelDir,
    getAdminPanelServiceBuildDir,
    getAdminPanelTempDir,
    getAdminPanelWebPublicDir,
    getAdminPanelWebServiceBuildDir,
    getPublicDir,
    readCMSConfigSync,
    getAdminPanelStaticDir
} from '@cromwell/core-backend';
import { bundledModulesDirName, getBundledModulesDir, downloader } from '@cromwell/utils';
import { fork } from 'child_process';
import compress from 'compression';
import fastify from 'fastify';
import fs from 'fs-extra';
import { resolve } from 'path';
import symlinkDir from 'symlink-dir';
import middie from 'middie'
import normalizePath from 'normalize-path';
import fastifyStatic from 'fastify-static';


const start = async () => {
    const watch = true;
    const cmsConfig = readCMSConfigSync();
    setStoreItem('cmsSettings', cmsConfig);

    const env = process.argv[2];

    const isProduction = env === 'production';
    const isDevelopment = env === 'development';
    if (!isDevelopment && !isProduction)
        throw (`devServer::startDevServer: process.argv[2] is invalid - ${env} valid values - "development" and "production"`);

    await downloader();

    const projectPublicDir = normalizePath(getPublicDir());
    const publicDir = normalizePath(getAdminPanelWebPublicDir());
    const webTempDir = normalizePath(getAdminPanelTempDir());
    const adminPanelStaticDir = normalizePath(getAdminPanelStaticDir())
    if (!fs.existsSync(webTempDir)) await fs.ensureDir(webTempDir);

    // Link public dir in project root to admin panel temp public dir for Express.js server
    if (!fs.existsSync(publicDir) && fs.existsSync(projectPublicDir)) {
        await symlinkDir(projectPublicDir, publicDir)
    }

    // Link service build dir
    const serviceBuildDir = getAdminPanelServiceBuildDir();
    const webTempServiceLink = getAdminPanelWebServiceBuildDir();
    if (!fs.existsSync(webTempServiceLink) && fs.existsSync(serviceBuildDir)) {
        await symlinkDir(serviceBuildDir, webTempServiceLink);
    }

    // Link bundled modules dir
    const bundledModulesDir = getBundledModulesDir();
    const bundledLocalLink = resolve(webTempDir, bundledModulesDirName);
    if (!fs.existsSync(bundledLocalLink) && fs.existsSync(bundledModulesDir)) {
        await symlinkDir(bundledModulesDir, bundledLocalLink);
    }

    const port = process.env.PORT ?? cmsConfig.adminPanelPort;

    const app = fastify();
    await app.register(middie);

    let bs;
    if (isDevelopment) {

        bs = require('browser-sync').create();
        bs.init({ watch: false });
        app.use(require('connect-browser-sync')(bs));
    }

    app.use(compress());

    app.register(fastifyStatic, {
        root: publicDir,
    });
    app.register(fastifyStatic, {
        root: webTempDir + '/bundled-modules',
        prefix: '/bundled-modules/',
        decorateReply: false,
    });
    app.register(fastifyStatic, {
        root: adminPanelStaticDir,
        prefix: '/admin/static/',
        decorateReply: false,
    });
    app.register(fastifyStatic, {
        root: webTempDir + '/build',
        prefix: '/admin/build/',
        decorateReply: false,
    });

    console.log('adminPanelStaticDir', adminPanelStaticDir, 'publicDir', publicDir, 'webTempDir', webTempDir)

    const indexPageHandle = (req, res) => {
        // route requested, send index.html 
        res.type('text/html').send(`
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cromwell CMS Admin Panel</title>
            <script>
            CromwellStore = {
                cmsSettings: ${JSON.stringify(cmsConfig)},
                environment: {
                    isAdminPanel: true,
                    mode: '${isDevelopment ? 'dev' : 'prod'}'
                }
            }
            </script>
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;900&display=swap" rel="stylesheet">
        </head>

        <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root"></div>
            <script src="/admin/build/webapp.js"></script>
        </body>
        `);
    }

    app.get(`/admin`, indexPageHandle);
    app.get(`/admin/`, indexPageHandle);
    app.get(`/admin/#`, indexPageHandle);
    app.get(`/admin/#/`, indexPageHandle);
    app.get(`/admin/#/*`, indexPageHandle);

    await app.listen(port, '::', 1, (err) => {
        if (err) {
            console.error(err);
            if (process.send) process.send(adminPanelMessages.onStartErrorMessage);
        } else {
            console.log(`Admin Panel server has started at ${serviceLocator.getAdminPanelUrl()}`);
            if (process.send) process.send(adminPanelMessages.onStartMessage);
        }
    });

    if (isDevelopment) {

        const buildProc = fork(resolve(serviceBuildDir, 'compiler.js'), watch ? ['--watch'] : [],
            { stdio: 'inherit', cwd: getAdminPanelDir(), env: { NODE_ENV: 'development' } });

        buildProc.on('message', (message) => {
            if (message === adminPanelMessages.onBuildEndMessage && bs) {
                bs.reload();
            }
        });
    }

}

try {
    start();
} catch (e) {
    console.error(e);
    if (process.send) process.send(adminPanelMessages.onStartErrorMessage);
}