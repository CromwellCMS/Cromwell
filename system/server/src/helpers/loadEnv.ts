import { setStoreItem } from '@cromwell/core';
import { getServerDir, getServerTempDir } from '@cromwell/core-backend';
import cacache from 'cacache';
import fs from 'fs-extra';
import { resolve } from 'path';
import yargs from 'yargs-parser';

import { authSettings, isRandomSecret } from '../auth/constants';
import { TServerCommands } from './constants';
import { rebuildPage } from './PageBuilder';

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


export const checkConfigs = async (envMode: TEnv) => {
    const serverCachePath = resolve(getServerTempDir(), 'cache');

    // If secret keys weren't set in config, they will be randomly generated
    // Since we have two server instances, we need to sync keys between them via filecache
    if (isRandomSecret) {
        const getSettings = async () => {
            try {
                const cachedData = await cacache.get(serverCachePath, 'auth_settings');
                const cachedSeettings: typeof authSettings = JSON.parse(cachedData.data.toString());
                if (cachedSeettings?.accessSecret) return cachedSeettings;
            } catch (error) { }
        }

        const cached = await getSettings();
        if (!cached || !cached.accessSecret || !cached.refreshSecret || !cached.cookieSecret || !cached.actionsSecret) {
            await cacache.put(serverCachePath, 'auth_settings', JSON.stringify(authSettings));
        } else {
            authSettings.accessSecret = cached.accessSecret;
            authSettings.refreshSecret = cached.refreshSecret;
            authSettings.cookieSecret = cached.cookieSecret;
            authSettings.actionsSecret = cached.actionsSecret;
        }
    }


    if (envMode.serverType === 'main') {
        const mailsDir = resolve(getServerTempDir(), 'emails');
        const serverDir = getServerDir();
        if (! await fs.pathExists(mailsDir) && serverDir) {
            const templatesSrc = resolve(serverDir, 'static/emails');
            await fs.copy(templatesSrc, mailsDir);
        }
    }
}
