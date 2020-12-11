import yargs from 'yargs-parser';
import colorsdef from 'colors/safe';
import { isAbsolute, resolve } from 'path';
const colors: any = colorsdef;
import { buildTask } from './cli/buildTask';

/**
 * CLI endpoint
 * npx cromwella --args
 */

const cli = () => {
    const args = yargs(process.argv.slice(2));
    const scriptName: 'build' | 'b' = process.argv[2] as any;
    const commands = ['build', 'b']

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

    if (scriptName === 'build' || scriptName === 'b') {
        buildTask();
    } else {
        console.error(colors.brightRed(`\nError. Invalid command. Available commands are: ${commands.join(', ')} \n`));
    }
}

cli();