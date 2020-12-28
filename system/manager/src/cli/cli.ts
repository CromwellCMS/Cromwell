import yargs from 'yargs-parser';
import colorsdef from 'colors/safe';
import { isAbsolute, resolve } from 'path';
import { buildTask } from './buildTask';
import { bundler, installer } from '@cromwell/cromwella';
const colors: any = colorsdef;

/**
 * CLI endpoint
 * npx cromwella --args
 */

const cli = async () => {
    const args = yargs(process.argv.slice(2));
    const scriptName: 'build' | 'b' | 'watch' | 'w' | 'install' | 'i' |
        'bundle-modules' | 'bm' | 'rebundle-modules' | 'rm' = process.argv[2] as any;
    const commands = ['build', 'b', 'watch', 'w', 'install', 'i',
        'bundle-modules', 'bm', 'rebundle-modules', 'rm']

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

    const isProduction = Boolean(typeof args.production === 'boolean' && args.production)
    const noInstall = Boolean(args['skip-install']);
    const installationMode = isProduction ? 'production' : 'development';
    const forceInstall = Boolean(args.f);


    if (scriptName === 'build' || scriptName === 'b') {
        await buildTask();
    } else if (scriptName === 'watch' || scriptName === 'w') {
        await buildTask(true);
    } else if (scriptName === 'bundle-modules' || scriptName === 'bm') {
        bundler(projectRootDir, installationMode, isProduction, false, noInstall);
    } else if (scriptName === 'rebundle-modules' || scriptName === 'rm') {
        bundler(projectRootDir, installationMode, isProduction, true, noInstall);
    } else if (scriptName === 'install' || scriptName === 'i') {
        installer(projectRootDir, installationMode, isProduction, forceInstall);
    } else {
        console.error(colors.brightRed(`\nError. Invalid command. Available commands are: ${commands.join(', ')} \n`));
    }
}

cli();