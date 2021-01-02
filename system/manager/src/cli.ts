import { setStoreItem } from '@cromwell/core';
import { readCMSConfig } from '@cromwell/core-backend';
import { bundler, installer, downloader } from '@cromwell/cromwella';
import colorsdef from 'colors/safe';
import { isAbsolute, resolve } from 'path';
import yargs from 'yargs-parser';

import { commands, TScriptName } from './constants';
import { buildTask } from './helpers/buildTask';
import { checkModules } from './helpers/checkModules';
import { startNamedService, startSystem } from './managers/baseManager';

const colors: any = colorsdef;

/**
 * CLI endpoint
 * npx cromwella --args
 */

const cli = async () => {
    const args = yargs(process.argv.slice(2));

    const scriptName: TScriptName = process.argv[2] as any;

    let projectRootDir: string | undefined;
    if (args.path && typeof args.path === 'string' && args.path !== '') {
        if (isAbsolute(args.path)) {
            projectRootDir = args.path;
        } else {
            projectRootDir = resolve(process.cwd(), args.path);
        }
    } else {
        projectRootDir = process.cwd();
    }

    const isProduction = Boolean(args.production || args.prod);
    const isDevelopment = Boolean(args.development || args.dev);
    const noInstall = Boolean(args['skip-install']);
    const installationMode = isProduction ? 'production' : 'development';
    const forceInstall = Boolean(args.f);
    const serviceToStart = args.service;

    const cmsConfig = await readCMSConfig();
    setStoreItem('cmsSettings', cmsConfig);
    setStoreItem('environment', {
        mode: isDevelopment ? 'dev' : 'prod',
        logLevel: isDevelopment ? 'detailed' : 'errors-only'
    })

    if (scriptName === 'build' || scriptName === 'b') {
        await checkModules(isDevelopment);
        await buildTask();

    } else if (scriptName === 'watch' || scriptName === 'w') {
        await checkModules(isDevelopment);
        await buildTask(true);

    } else if (scriptName === 'bundle-modules' || scriptName === 'bm') {
        bundler(projectRootDir, installationMode, isProduction, false, noInstall);

    } else if (scriptName === 'rebundle-modules' || scriptName === 'rm') {
        bundler(projectRootDir, installationMode, isProduction, true, noInstall);

    } else if (scriptName === 'install' || scriptName === 'i') {
        installer(projectRootDir, installationMode, isProduction, forceInstall);

    } else if (scriptName === 'download' || scriptName === 'd') {
        downloader(projectRootDir);

    } else if (scriptName === 'start' || scriptName === 's') {
        if (serviceToStart) {
            startNamedService(serviceToStart, isDevelopment);
        } else {
            await checkModules(isDevelopment);
            startSystem(isDevelopment);
        }
    } else {
        console.error(colors.brightRed(`\nError. Invalid command. Available commands are: ${commands.join(', ')} \n`));
    }
}

cli();