import yargs from 'yargs-parser';
import colors from 'colors/safe';

/**
 * CLI endpoint
 * npx cromwella --args
 */

const cli = () => {
    const args = yargs(process.argv.slice(2));

    const projectRootDir: string = (!args.path || typeof args.path !== 'string' || args.path == '') ?
        process.cwd() : args.path;

    if (!projectRootDir || typeof projectRootDir !== 'string' || projectRootDir == '') {
        console.log(colors.red(`\nCromwella:: Error. Please pass absolute project root directory as --path argument\n`));
        return;
    }

    const isProduction = Boolean(typeof args.production === 'boolean' && args.production)
    const installationMode = isProduction ? 'production' : 'development';
    const forceInstall = Boolean(args.f);


    if (args.bundle) {
        const { bundler } = require('./bundler');
        bundler(projectRootDir, installationMode, isProduction, forceInstall);
    } else {
        const { installer } = require('./installer');
        installer(projectRootDir, installationMode, isProduction, forceInstall);
    }
}

cli();