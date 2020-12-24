import { setStoreItem } from '@cromwell/core';
import yargs from 'yargs-parser';

import { rebuildPage } from './PageBuilder';

let envMode: 'dev' | 'prod' | undefined = undefined;

export const setEnv = (): 'dev' | 'prod' => {
    if (envMode) return envMode;

    setStoreItem('rebuildPage', rebuildPage);
    const args = yargs(process.argv.slice(2));

    envMode = args.env ?? 'prod';
    const logLevel = args.logLevel ?? 'errors-only';

    setStoreItem('environment', {
        mode: envMode,
        logLevel
    });

    return envMode!;
}