import { setStoreItem } from '@cromwell/core';
import { cmsPackageName, getCmsEntity, getCmsSettings, getLogger, getModulePackage, getServerDir, getServerTempDir } from '@cromwell/core-backend';
import cacache from 'cacache';
import fs from 'fs-extra';
import { resolve } from 'path';
import yargs from 'yargs-parser';
import { getCentralServerClient } from '@cromwell/core-frontend';

import { authSettings, isRandomSecret } from '../auth/constants';
import { TServerCommands } from './constants';

let sEnv: TEnv | undefined = undefined;
const logger = getLogger();

type TEnv = {
    envMode: 'dev' | 'prod';
    scriptName: TServerCommands;
}

export const loadEnv = (): TEnv => {
    if (sEnv) return sEnv;

    const args = yargs(process.argv.slice(2));
    const scriptName = process.argv[2] as TServerCommands;

    if (args.proxyPort) {
        process.env.API_PORT = args.proxyPort + '';
    }

    if (!scriptName || (scriptName as any) === '') {
        const msg = 'Provide as first argument to this script one of these commands: build, dev, prod, serverDev, serverProd';
        getLogger(false).error(msg);
    }

    const envMode = (scriptName === 'dev') ? 'dev' : 'prod';
    const logLevel = args.logLevel ?? envMode === 'dev' ? 'detailed' : 'errors-only';

    setStoreItem('environment', {
        mode: envMode,
        logLevel
    });

    sEnv = {
        envMode,
        scriptName,
    }
    return sEnv;
}


export const checkConfigs = async () => {
    const serverCachePath = resolve(getServerTempDir(), 'cache');

    // If secret keys weren't set in config, they will be randomly generated
    // Save them into filecache to not generate on every launch, otherwise it'll
    // cause log-out for all users
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


    const mailsDir = resolve(getServerTempDir(), 'emails');
    const serverDir = getServerDir();
    if (! await fs.pathExists(mailsDir) && serverDir) {
        const templatesSrc = resolve(serverDir, 'static/emails');
        await fs.copy(templatesSrc, mailsDir);
    }
}


export const checkCmsVersion = async () => {
    // Check CMS version
    const settings = await getCmsSettings();
    const cmsPckg = await getModulePackage(cmsPackageName);
    if (cmsPckg?.version && cmsPckg.version !== settings?.version) {
        try {
            const cmsEntity = await getCmsEntity();
            const remoteinfo = await getCentralServerClient().getVersionByPackage(cmsPckg.version);
            if (remoteinfo) {
                cmsEntity.version = remoteinfo.version;
                await cmsEntity.save();
            }
        } catch (error) {
            logger.error(error);
        }
    }
}