import { setStoreItem } from '@cromwell/core';
import yargs from 'yargs-parser';

import { rebuildPage } from './PageBuilder';
import { TServerCommands } from './constants';

let sEnv: TEnv | undefined = undefined;

type TEnv = {
    envMode: 'dev' | 'prod';
    serverType: 'main' | 'plugin';
}

export const loadEnv = (): TEnv => {
    if (sEnv) return sEnv;

    setStoreItem('rebuildPage', rebuildPage);
    const args = yargs(process.argv.slice(2));
    const scriptName = process.argv[2] as TServerCommands | undefined;

    const envMode = (scriptName === 'devMain' || scriptName === 'devPlugin') ? 'dev' : 'prod';
    const logLevel = args.logLevel ?? envMode === 'dev' ? 'detailed' : 'errors-only';
    const serverType = (scriptName === 'devPlugin' || scriptName === 'prodPlugin') ? 'plugin' : 'main';

    setStoreItem('environment', {
        mode: envMode,
        logLevel
    });

    sEnv = {
        envMode,
        serverType,
    }
    return sEnv;
}