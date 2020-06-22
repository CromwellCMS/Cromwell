const path = require('path');
const url = require('url');
const fs = require('fs');
const webpack = require('webpack');
const config = require('./webpack.config');
const appBuildDev = path.resolve('./.cromwell/static/dev');
const appBuildProd = path.resolve('./.cromwell/static/prod');
const env = process.env.NODE_ENV;
const compiler = webpack(config);

const isDevelopment = env === 'development';
const isProduction = env === 'production';

if (!isDevelopment && !isProduction)
    throw (`process.env.NODE_ENV is invalid - ${env}
    valid values - "development" and "production"`);

const dir = isDevelopment ? appBuildDev : appBuildProd;
const port = process.env.PORT || 3010;

const watch = process.env.WATCH;

const bs = require('browser-sync').create();
bs.init({
    watch: true,
    server: {
        baseDir: dir,
        middleware: [
            function (req, res, next) {
                let fileName = url.parse(req.url);
                fileName = fileName.href.split(fileName.search).join("");
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



if (watch === 'true')
    compiler.watch({}, (err, stats) => {
        console.log(stats.toString({
            chunks: false,
            colors: true
        }
        ))
    });
else
    compiler.run((err, stats) => {
        console.log(stats.toString({
            chunks: false,
            colors: true
        }));
    });
