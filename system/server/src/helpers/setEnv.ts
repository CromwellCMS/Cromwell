import { setStoreItem } from '@cromwell/core';
import yargs from 'yargs-parser';

import { rebuildPage } from './PageBuilder';

let envMode: 'dev' | 'prod' | undefined = undefined;

export const setEnv = (): 'dev' | 'prod' => {
    if (envMode) return envMode;

    setStoreItem('rebuildPage', rebuildPage);
    const args = yargs(process.argv.slice(2));
    const scriptName = process.argv[2] as 'dev' | 'prod' | undefined;

    envMode = scriptName ?? 'prod';
    const logLevel = args.logLevel ?? scriptName === 'dev' ? 'detailed' : 'errors-only';

    setStoreItem('environment', {
        mode: envMode,
        logLevel
    });

    return envMode!;
}