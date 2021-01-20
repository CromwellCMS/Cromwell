import { TServiceNames } from '@cromwell/cms';
import yargs from 'yargs/yargs';
import { createTask } from './tasks/create';

const args = yargs(process.argv.slice(2))
    // START
    .command<{ service?: string; development?: boolean }>({
        command: 'start [options]',
        describe: 'starts CMS or specified service',
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
                startServiceByName(serviceToStart, development);
            } else {
                await checkModules(development);
                startSystem(development);
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
    .command<{ name?: string; type?: string }>({
        command: 'create <name> [options]',
        describe: 'creates new Cromwell project',
        aliases: ['create', 'c'],
        builder: (yargs) => {
            return yargs.option('type', {
                alias: 't',
                desc: 'type of project - default, plugin, theme',
                type: 'string'
            })
        },
        handler: (argv) => {
            createTask(argv.name)
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
            const { bundler } = require('@cromwell/cromwella');
            bundler(process.cwd(), !argv.development, argv.remove, argv.force);
        }
    })
    // DOWNLOAD
    .command({
        command: 'download',
        describe: 'download bundled frontend modules',
        aliases: ['download', 'd'],
        handler: (argv) => {
            const { downloader } = require('@cromwell/cromwella');
            downloader(process.cwd());
        }
    })
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
