import { TServiceNames } from '@cromwell/cms';
import yargs from 'yargs/yargs';
import { createTask } from './tasks/create';

const args = yargs(process.argv.slice(2))
    // START
    .command<{ service?: string; development?: boolean }>({
        command: 'start [options]',
        describe: 'starts CMS or a specified service',
        aliases: ['start', 's'],
        builder: (yargs) => {
            return yargs
                .option('service', {
                    alias: 'sv',
                    desc: 'Specify service to start: "server", "renderer", "adminPanel"',
                    choices: ["server", "s", "renderer", "r", "adminPanel", "a"]
                })
                .option('development', {
                    alias: 'dev',
                    desc: 'Start service in development mode',
                    type: 'boolean'
                })
        },
        handler: async (argv) => {
            const serviceToStart = argv.service as TServiceNames;
            const development = argv.development;

            const { checkModules, startServiceByName, startSystem } = require('@cromwell/cms');

            if (serviceToStart) {
                await startServiceByName(serviceToStart, development);
            } else {
                await checkModules(development);
                await startSystem(development ? 'development' : 'production');
            }
        }
    })
    // CLOSE SERVICE
    .command<{ service?: string; development?: boolean }>({
        command: 'close [options]',
        describe: `closes CMS or a specified service by it's saved PID`,
        aliases: ['close', 'cl'],
        builder: (yargs) => {
            return yargs
                .option('service', {
                    alias: 'sv',
                    desc: 'Specify service to close: "server", "renderer", "adminPanel"',
                    choices: ["server", "s", "renderer", "r", "adminPanel", "a"]
                })
        },
        handler: async (argv) => {
            const serviceToClose = argv.service as TServiceNames;

            const { closeServiceByName, closeSystem } = require('@cromwell/cms');

            if (serviceToClose) {
                await closeServiceByName(serviceToClose);
            } else {
                await closeSystem();
            }
        }
    })
    // BUILD
    .command<{ watch?: boolean }>({
        command: 'build [options]',
        describe: 'builds CMS module - theme or plugin',
        aliases: ['build', 'b'],
        builder: (yargs) => {
            return yargs.option('watch', {
                alias: 'w',
                desc: 'watch files and rebuild on change',
                type: 'boolean'
            })
        },
        handler: (argv) => {
            const { buildTask } = require('@cromwell/cms');

            buildTask(argv.watch);
        }
    })
    // CREATE
    .command<{ name?: string; type?: string; noInstall?: boolean }>({
        command: 'create <name> [options]',
        describe: 'creates new Cromwell project',
        aliases: ['create', 'c'],
        builder: (yargs) => {
            return yargs.option('type', {
                alias: 't',
                desc: 'type of project - default, plugin, theme',
                type: 'string'
            }).option('noInstall', {
                alias: 'noInstall',
                desc: 'do not run npm install',
                type: 'boolean'
            })
        },
        handler: (argv) => {
            createTask(argv.name, argv.noInstall)
        }
    })
    // BUNDLE MODULES
    .command<{ remove?: boolean; development?: boolean; force?: boolean; }>({
        command: 'bm [options]',
        describe: 'bundle frontend node_modules',
        aliases: ['bundle-modules', 'bm'],
        builder: (yargs) => {
            return yargs
                .option('remove', {
                    alias: 'r',
                    desc: 'Remove old bundles before',
                    type: 'boolean'
                })
                .option('development', {
                    alias: 'dev',
                    desc: 'Bundle module in development mode',
                    type: 'boolean'
                })
                .option('force', {
                    alias: 'f',
                    desc: 'Force bundle if found conflicts',
                    type: 'boolean'
                })
        },
        handler: (argv) => {
            const { bundler } = require('@cromwell/utils');
            bundler({
                projectRootDir: process.cwd(),
                isProduction: !argv.development,
                rebundle: argv.remove,
                forceInstall: argv.force,
            });
        }
    })
    // DOWNLOAD
    .command({
        command: 'download',
        describe: 'download bundled frontend modules',
        aliases: ['download', 'd'],
        handler: (argv) => {
            const { downloader } = require('@cromwell/utils');
            downloader();
        }
    })

    // CLEAN
    .command({
        command: 'clean',
        describe: 'remove all compiled directories',
        aliases: ['clean'],
        handler: (argv) => {
            require('../src/utils/cleanup.js');
        }
    })
    .recommendCommands()
    .demandCommand(1, '')
    .help()
    .strict()
    .argv;
