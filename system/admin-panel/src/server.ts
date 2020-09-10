import fs from 'fs-extra';
import { resolve } from 'path';
import webpack from 'webpack';
import express from 'express';
import { TCmsConfig } from '@cromwell/core';
import { appBuildDev, appBuildProd, publicStaticDir, projectRootDir } from './constants';
import { readCMSConfig } from '@cromwell/core-backend';
const chalk = require('react-dev-utils/chalk');

const startDevServer = () => {
    const watch = true;

    const CMSconfig = readCMSConfig(projectRootDir)

    const env = process.argv[2];
    const config = require('../webpack.config');
    const compiler = webpack(config);

    let isDevelopment = env === 'development';
    let isProduction = env === 'production';

    if (!isDevelopment && !isProduction)
        throw (`devServer::startDevServer: rocess.argv[2] is invalid - ${env}
    valid values - "development" and "production"`);

    const buildDir = isDevelopment ? appBuildDev : appBuildProd;
    const port = process.env.PORT || CMSconfig.adminPanelPort;

    const app = express();

    let bs;
    if (isDevelopment) {
        bs = require('browser-sync').create();
        bs.init({ watch: false });
        app.use(require('connect-browser-sync')(bs));
    }

    app.use("/", express.static(buildDir));
    app.use("/", express.static(publicStaticDir));

    app.get(`*`, function (req, res) {
        const filePath = `${buildDir}/index.html`;
        fs.access(filePath, fs.constants.R_OK, (err) => {
            if (!err) {
                res.sendFile(filePath);
            } else {
                res.status(404).send("index.html not found. Run build command")
            }
        })
    })

    const { address } = app.listen(port);

    if (isDevelopment) {
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
            console.log(stats.toString({
                chunks: false,
                colors: true
            }
            ))
        });
        else compiler.run((err, stats) => {
            console.log(stats.toString({
                chunks: false,
                colors: true
            }));
        });
    }

}

startDevServer();