import yargs from 'yargs-parser';
import colorsdef from 'colors/safe';
import { isAbsolute, resolve } from 'path';
const colors: any = colorsdef;
import { buildTask } from './buildTask';

/**
 * CLI endpoint
 * npx cromwella --args
 */

const cli = async () => {
    const args = yargs(process.argv.slice(2));
    const scriptName: 'build' | 'b' | 'watch' | 'w' = process.argv[2] as any;
    const commands = ['build', 'b', 'watch', 'w']

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
        await buildTask();
    } else if (scriptName === 'watch' || scriptName === 'w') {
        await buildTask(true);
    } else {
        console.error(colors.brightRed(`\nError. Invalid command. Available commands are: ${commands.join(', ')} \n`));
    }
}

cli();