import { setStoreItem, TCmsConfig } from '@cromwell/core';
import { getCmsEntity, getCmsSettings, readCMSConfigSync } from '@cromwell/core-backend/dist/helpers/cms-settings';
import { cmsPackageName } from '@cromwell/core-backend/dist/helpers/constants';
import { getLogger } from '@cromwell/core-backend/dist/helpers/logger';
import { getModulePackage, getServerDir, getServerTempDir } from '@cromwell/core-backend/dist/helpers/paths';
import { getCentralServerClient } from '@cromwell/core-frontend';
import fs from 'fs-extra';
import { resolve } from 'path';
import { ConnectionOptions } from 'typeorm';

import { TServerCommands } from './constants';

const logger = getLogger();

let sEnv: TEnv | undefined = undefined;

type TEnv = {
    envMode: 'dev' | 'prod';
    scriptName: TServerCommands;
    cmsConfig: TCmsConfig;
}

export const loadEnv = (): TEnv => {
    if (sEnv) return sEnv;

    const scriptName = process.argv[2] as TServerCommands;
    const cmsConfig = readCMSConfigSync();
    const envMode = cmsConfig?.env ?? (scriptName === 'dev') ? 'dev' : 'prod';

    setStoreItem('environment', {
        mode: envMode,
    });

    sEnv = {
        envMode,
        scriptName,
        cmsConfig,
    }
    return sEnv;
}

export const checkConfigs = async () => {
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
    const cmsEntity = await getCmsEntity();

    if (cmsPckg?.version && cmsPckg.version !== settings?.version) {
        try {
            const remoteInfo = await getCentralServerClient().getVersionByPackage(cmsPckg.version);
            if (remoteInfo) {
                cmsEntity.internalSettings = {
                    ...(cmsEntity.internalSettings ?? {}),
                    version: remoteInfo.version
                }
                await cmsEntity.save();
            }
        } catch (error) {
            logger.warn(error);
        }

        if (!cmsEntity?.internalSettings?.version) {
            cmsEntity.internalSettings = {
                ...(cmsEntity.internalSettings ?? {}),
                version: cmsPckg.version
            }
            await cmsEntity.save();
        }
    }
}

export const getMigrationsDirName = (dbType: ConnectionOptions['type']) => {
    if (dbType === 'sqlite') return 'migrations/sqlite';
    if (dbType === 'mysql' || dbType === 'mariadb') return 'migrations/mysql';
    if (dbType === 'postgres') return 'migrations/postgres';
}