import yargs from 'yargs-parser';
import colorsdef from 'colors/safe';
const colors: any = colorsdef;

/**
 * CLI endpoint
 * npx cromwella --args
 */

const cli = () => {
    const args = yargs(process.argv.slice(2));
    const scriptName: 'install' | 'i' | 'bundle' | 'b' | 'rebundle' | 'r'
        | 'link' | 'l' = process.argv[2] as any;
    const commands = ['install', 'i', 'bundle', 'b', 'rebundle', 'r', 'link', 'l']

    const projectRootDir: string = (!args.path || typeof args.path !== 'string' || args.path == '') ?
        process.cwd() : args.path;

    const isProduction = Boolean(typeof args.production === 'boolean' && args.production)
    const noInstall = Boolean(args['skip-install']);
    const installationMode = isProduction ? 'production' : 'development';
    const forceInstall = Boolean(args.f);

    if (scriptName === 'bundle' || scriptName === 'b') {
        const { bundler } = require('./bundler');
        bundler(projectRootDir, installationMode, isProduction, false, noInstall);
    } else if (scriptName === 'rebundle' || scriptName === 'r') {
        const { bundler } = require('./bundler');
        bundler(projectRootDir, installationMode, isProduction, true, noInstall);
    } else if (scriptName === 'install' || scriptName === 'i') {
        const { installer } = require('./installer');
        installer(projectRootDir, installationMode, isProduction, forceInstall);
    } else {
        console.error(colors.brightRed(`\nCromwella:: Error. Invalid command. Available commands are: ${commands.join(', ')} \n`));
    }
}

cli();