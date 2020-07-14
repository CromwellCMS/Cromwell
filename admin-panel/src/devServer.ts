import { CMSconfig } from '../.cromwell/imports/plugins.gen';
import fs from 'fs-extra';
import { resolve } from 'path';
import url from 'url';
import webpack from 'webpack';

export const startDevServer = (watch?: boolean) => {
    const appBuildDev = resolve('./.cromwell/static/dev');
    const appBuildProd = resolve('./.cromwell/static/prod');
    const env = process.env.NODE_ENV;
    const config = require('../webpack.config');
    const compiler = webpack(config);

    let isDevelopment = env === 'development';
    let isProduction = env === 'production';

    if (!isDevelopment && !isProduction)
        throw (`devServer::startDevServer: process.env.NODE_ENV is invalid - ${env}
    valid values - "development" and "production"`);

    const dir = isDevelopment ? appBuildDev : appBuildProd;
    const port = process.env.PORT || CMSconfig.adminPanelPort;

    // const watch = process.env.WATCH;

    const bs = require('browser-sync').create();
    bs.init({
        files: [`${dir}/*.js`],
        open: false,
        // watch: true,
        server: {
            baseDir: dir,
            middleware: [
                function (req, res, next) {
                    let urlWithStringQuery = url.parse(req.url);
                    let fileName = urlWithStringQuery.href.split(urlWithStringQuery.search || '').join("");
                    const fileExists = fs.existsSync(dir + fileName);
                    if (!fileExists && fileName.indexOf("browser-sync-client") < 0)
                        req.url = `/index.html`;

                    return next();
                },
            ],
        },
        port: port,
        startPath: '/',
        logLevel: 'debug',
        logFileChanges: true,
        logConnections: true,
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
