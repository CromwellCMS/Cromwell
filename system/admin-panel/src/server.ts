import fs from 'fs-extra';
import { resolve } from 'path';
import webpack from 'webpack';
import express from 'express';
import { TCmsConfig, serviceLocator } from '@cromwell/core';
import {
    readCMSConfigSync, adminPanelMessages, getAdminPanelDir, getAdminPanelServiceBuildDir,
    getAdminPanelWebPublicDir, getAdminPanelWebBuildDir, getCMSConfigPath, cmsConfigFileName,
    getAdminPanelWebServiceBuildDir
} from '@cromwell/core-backend';
import symlinkDir from 'symlink-dir';
import compress from 'compression';


const projectRootDir = resolve(__dirname, '../../../');
const localProjectDir = resolve(__dirname, '../');

const webpackConfig = require('../webpack.config');
const chalk = require('react-dev-utils/chalk');

const startDevServer = async () => {
    const watch = true;
    const CMSconfig = readCMSConfigSync(projectRootDir)

    const publicDir = getAdminPanelWebPublicDir(projectRootDir);
    const webTempDir = getAdminPanelWebBuildDir(projectRootDir);
    if (!fs.existsSync(webTempDir)) await fs.mkdir(webTempDir);

    // Link public dir in root to renderer's public dir for Express.js server
    if (!fs.existsSync(publicDir) && fs.existsSync(resolve(projectRootDir, 'public'))) {
        await symlinkDir(resolve(projectRootDir, 'public'), publicDir)
    }

    const cmsConfigPath = getCMSConfigPath(projectRootDir);
    const tempCmsConfigPath = resolve(webTempDir, cmsConfigFileName)
    // Link CMS config for Express.js server
    await fs.copyFile(cmsConfigPath, tempCmsConfigPath);

    // Link service build dir
    const serviceBuildDir = getAdminPanelServiceBuildDir(projectRootDir);
    const webTempServiceLink = getAdminPanelWebServiceBuildDir(projectRootDir);
    if (!fs.existsSync(webTempServiceLink) && fs.existsSync(serviceBuildDir)) {
        await symlinkDir(serviceBuildDir, webTempServiceLink);
    }

    console.log('process.argv', process.argv);
    const env = process.argv[2];

    let isProduction = env === 'production';
    let isDevelopment = env === 'development';


    if (!isDevelopment && !isProduction)
        throw (`devServer::startDevServer: process.argv[2] is invalid - ${env}
    valid values - "development" and "production"`);

    const port = process.env.PORT || CMSconfig.adminPanelPort;

    const app = express();

    let bs;
    if (isDevelopment) {
        bs = require('browser-sync').create();
        bs.init({ watch: false });
        app.use(require('connect-browser-sync')(bs));
    }

    app.use(compress());

    app.use("/", express.static(webTempDir));
    app.use("/", express.static(publicDir));

    app.get(`*`, function (req, res) {
        if (/.+\.\w+$/.test(req.path)) {
            // file requested, 404
            res.status(404).send("File not found.");
        } else {
            // route requested, send index.html 
            const filePath = resolve(serviceBuildDir, 'index.html');
            fs.access(filePath, fs.constants.R_OK, (err) => {
                if (!err) {
                    res.sendFile(filePath);
                } else {
                    res.status(404).send("index.html not found. Run build command");
                }
            })
        }

    })

    app.listen(port, () => {
        console.log(`Admin Panel server has started at ${serviceLocator.getAdminPanelUrl()}`);
        if (process.send) process.send(adminPanelMessages.onStartMessage);
    }).on('error', (err) => {
        console.error(err);
        if (process.send) process.send(adminPanelMessages.onStartErrorMessage);
    });

    if (isDevelopment) {
        webpackConfig.mode = env;
        const compiler = webpack(webpackConfig);

        compiler.hooks.watchRun.tap('MyPlugin1', (params) => {
            console.log(chalk.cyan('\r\nBegin compile at ' + new Date() + '\r\n'));
        });

        compiler.hooks.done.tap('MyPlugin2', (params) => {
            setTimeout(() => {
                console.log(chalk.cyan('\r\nEnd compile at ' + new Date() + '\r\n'));
                if (isDevelopment && bs) {
                    bs.reload();
                }
            }, 100)
        });


        if (watch) compiler.watch({}, (err, stats) => {
            console.log(stats?.toString({
                chunks: false,
                colors: true
            }));
        });
        else compiler.run((err, stats) => {
            console.log(stats?.toString({
                chunks: false,
                colors: true
            }));

        });
    }

}

try {
    startDevServer();
} catch (e) {
    console.error(e);
    if (process.send) process.send(adminPanelMessages.onStartErrorMessage);
}