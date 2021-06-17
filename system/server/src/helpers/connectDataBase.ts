import { setStoreItem } from '@cromwell/core';
import {
    getLogger,
    getServerDir,
    getServerTempDir,
    ORMEntities,
    readCMSConfig,
    readCmsModules,
} from '@cromwell/core-backend';
import fs from 'fs-extra';
import normalizePath from 'normalize-path';
import { resolve } from 'path';
import { ConnectionOptions, createConnection, getConnection, getCustomRepository } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import yargs from 'yargs-parser';

import { PluginService } from '../services/plugin.service';
import { ThemeService } from '../services/theme.service';
import { MockService } from '../services/mock.service';
import { collectPlugins } from './collectPlugins';
import { loadEnv } from './loadEnv';
import { GenericCms, GenericPlugin, GenericTheme } from './genericEntities';

type Writeable<T> = { -readonly [P in keyof T]: T[P] };
const logger = getLogger();

export const connectDatabase = async () => {

    const args = yargs(process.argv.slice(2));
    const cmsConfig = await readCMSConfig();
    const tempDBPath = resolve(getServerTempDir(), 'db.sqlite3');
    const env = loadEnv();

    const defaultOrmConfig: ConnectionOptions = {
        type: "sqlite",
        database: tempDBPath,
        entityPrefix: 'crw_',
        migrationsTableName: "crw_migrations",
        cli: {
            migrationsDir: "migrations"
        }
    }

    let hasDatabasePath = false;
    const serverDir = getServerDir();
    if (cmsConfig?.orm?.database) hasDatabasePath = true;

    let ormconfig: ConnectionOptions = Object.assign({}, defaultOrmConfig, cmsConfig.orm)

    if (!ormconfig || !ormconfig.type) throw new Error('Invalid ormconfig');
    setStoreItem('dbType', ormconfig.type);

    // Adjust unset options for different DBs
    const adjustedOptions: Partial<Writeable<ConnectionOptions & MysqlConnectionOptions>> = {};

    let isNewSQLiteDB = false;
    if (ormconfig.type === 'sqlite') {
        if (env.envMode === 'dev') {
            adjustedOptions.synchronize = true;
        }

        if (!hasDatabasePath) {
            if (!await fs.pathExists(defaultOrmConfig.database) && serverDir) {
                // Server probably was launched at the first time and has no DB created
                // Use mocked DB
                const dempDBPath = resolve(serverDir, 'db.sqlite3');
                if (await fs.pathExists(dempDBPath)) {
                    isNewSQLiteDB = true;
                    await fs.copy(dempDBPath, tempDBPath);
                }
            }
        }
    }

    if (ormconfig.type === 'mysql' || ormconfig.type === 'mariadb' || ormconfig.type === 'postgres') {
        adjustedOptions.migrationsRun = true;
        adjustedOptions.synchronize = false;
    }

    if (ormconfig.type === 'mysql' || ormconfig.type === 'mariadb') {
        adjustedOptions.timezone = '+0';
    }

    ormconfig = Object.assign(adjustedOptions, ormconfig);

    const pluginExports = await collectPlugins();

    const connectionOptions: ConnectionOptions = {
        ...ormconfig,
        entities: [
            ...ORMEntities,
            ...(pluginExports.entities ?? [] as any),
            ...(ormconfig?.entities ?? [])
        ],
        migrations: [
            ...(pluginExports.migrations ?? [] as any),
            (serverDir && ormconfig?.cli?.migrationsDir) ?
                normalizePath(resolve(serverDir, ormconfig.cli.migrationsDir)) + '/*.js' : '',
        ].filter(it => it && it !== ''),
    };

    if (connectionOptions) await createConnection(connectionOptions);

    if (isNewSQLiteDB) {
        // if new DB, delete old themes and plugins from tables to install them anew
        const pluginRepo = getCustomRepository(GenericPlugin.repository);
        const dbPlugins = await pluginRepo.getAll();
        await Promise.all(dbPlugins.map(plugin => pluginRepo.remove(plugin)));

        const themeRepo = getCustomRepository(GenericTheme.repository);
        const dbThemes = await themeRepo.getAll();
        await Promise.all(dbThemes.map(theme => themeRepo.remove(theme)));

        const cmsRepo = getCustomRepository(GenericCms.repository);
        const cmsConfigs = await cmsRepo.getAll();
        await Promise.all(cmsConfigs.map(config => cmsRepo.remove(config)));
    }


    // Check installed cms modules. All available themes and plugins should be registered in DB
    // If some are not, then activate them here at Server startup
    const cmsModules = await readCmsModules();

    const pluginRepo = getCustomRepository(GenericPlugin.repository);
    const dbPlugins = await pluginRepo.getAll();

    const pluginService = new PluginService();
    for (const pluginName of cmsModules.plugins) {
        if (!dbPlugins.find(plugin => plugin.name === pluginName)) {
            try {
                await pluginService.activatePlugin(pluginName);
            } catch (error) {
                logger.error('Server connectDatabase: failed to activate plugin ' + pluginName, error);
            }
        }
    }

    const themeRepo = getCustomRepository(GenericTheme.repository);
    const dbThemes = await themeRepo.getAll();

    const themeService = new ThemeService();
    for (const themeName of cmsModules.themes) {
        if (!dbThemes.find(theme => theme.name === themeName)) {
            try {
                await themeService.activateTheme(themeName);
            } catch (error) {
                logger.error('Server connectDatabase: failed to activate theme ' + themeName, error);
            }
        }
    }


    if (args.init) {
        const mockService = new MockService();
        setTimeout(() => {
            mockService.mockAll();
        }, 1000);
    }

}

export const closeConnection = async () => {
    await getConnection().close();
}