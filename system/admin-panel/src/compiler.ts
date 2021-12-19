import { adminPanelMessages } from '@cromwell/core-backend';
import webpack from 'webpack';
import yargs from 'yargs-parser';

const webpackConfig = require('../webpack.config');
const chalk = require('react-dev-utils/chalk');

const run = async () => {
    const args = yargs(process.argv.slice(2));

    const compiler = webpack(webpackConfig);

    compiler.hooks.watchRun.tap('adminPanelStart', () => {
        console.log(chalk.cyan('\r\nBegin admin panel compile at ' + new Date() + '\r\n'));
    });

    compiler.hooks.done.tap('adminPanelDone', () => {
        setTimeout(() => {
            console.log(chalk.cyan('\r\nEnd admin panel compile at ' + new Date() + '\r\n'));

            if (process.send) process.send(adminPanelMessages.onBuildEndMessage);
        }, 100)
    });


    if (args.watch) compiler.watch({}, (err, stats) => {
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

run();