import { bundledModulesDirName, setStoreItem } from '@cromwell/core';
import {
    adminPanelMessages,
    getAdminPanelDir,
    getAdminPanelServiceBuildDir,
    getAdminPanelStaticDir,
    getAdminPanelTempDir,
    getAdminPanelWebPublicDir,
    getAdminPanelWebServiceBuildDir,
    getBundledModulesDir,
    getPublicDir,
    readCMSConfigSync,
} from '@cromwell/core-backend';
import { getRestApiClient } from '@cromwell/core-frontend';
import compress from 'compression';
import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import fs from 'fs-extra';
import middie from 'middie';
import normalizePath from 'normalize-path';
import { resolve } from 'path';
import symlinkDir from 'symlink-dir';
import yargs from 'yargs-parser';

const start = async () => {
    const args = yargs(process.argv.slice(2));
    if (args.serverUrl) {
        process.env.API_URL = args.serverUrl;
    }
    let cmsSettings = readCMSConfigSync();
    setStoreItem('cmsSettings', cmsSettings);

    try {
        cmsSettings = await getRestApiClient().getCmsSettings() ?? cmsSettings;
        setStoreItem('cmsSettings', cmsSettings);
    } catch (error) {
        console.error(error);
    }

    const env = process.argv[2];

    const isProduction = env === 'production' || env === 'prod';
    const isDevelopment = env === 'development' || env === 'dev';
    if (!isDevelopment && !isProduction)
        throw (`devServer::startDevServer: process.argv[2] is invalid - ${env} valid values - "development" and "production"`);

    const projectPublicDir = normalizePath(getPublicDir());
    const publicDir = normalizePath(getAdminPanelWebPublicDir());
    const webTempDir = normalizePath(getAdminPanelTempDir());
    const adminPanelStaticDir = normalizePath(getAdminPanelStaticDir())
    if (!fs.existsSync(webTempDir)) await fs.ensureDir(webTempDir);

    // Link public dir in project root to admin panel temp public dir for Fastify web server
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

    const port = args.port ?? 4064;
    const app = fastify();
    await app.register(middie);

    if (isDevelopment) {
        const { runRollupCompiler, runWebpackCompiler } = require(resolve(getAdminPanelDir(),
            './src/helpers/compiler.js'));

        // Start Webpack watcher
        runWebpackCompiler();

        // Since we use `swc` for Typescript compilation, it will not make any type checks.
        // Run TSC in the background to see TS error.
        runRollupCompiler();
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

    const indexPageHandle = (req, res) => {
        // route requested, send index.html
        const files = fs.readdirSync(webTempDir + '/build');
        const webapp = files.find(file => file.startsWith('webapp') && file.endsWith('.js'));

        res.type('text/html').send(`
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="shortcut icon" type="image/png" href="/admin/static/icon_small.png"/>
            <title>Cromwell CMS Admin Panel</title>
            <script>
            CromwellStore = {
                cmsSettings: ${JSON.stringify(cmsSettings)},
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
            <script src="/admin/build/${webapp}"></script>
        </body>
        `);
    }

    app.get(`/admin`, indexPageHandle);
    app.get(`/admin/`, indexPageHandle);
    app.get(`/admin/*`, indexPageHandle);

    await app.listen(port, '::', 1, (err) => {
        if (err) {
            console.error(err);
            if (process.send) process.send(adminPanelMessages.onStartErrorMessage);
        } else {
            if (process.send) process.send(adminPanelMessages.onStartMessage);
        }
    });

}

try {
    start();
} catch (e) {
    console.error(e);
    if (process.send) process.send(adminPanelMessages.onStartErrorMessage);
}
