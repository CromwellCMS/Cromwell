import { setStoreItem } from '@cromwell/core';
import {
    getCmsSettings,
    getOrmConfigPath,
    getServerDir,
    getServerTempDir,
    ORMEntities,
    readCmsModules,
} from '@cromwell/core-backend';
import fs from 'fs-extra';
import normalizePath from 'normalize-path';
import { resolve } from 'path';
import { ConnectionOptions, createConnection, getConnection, getCustomRepository } from 'typeorm';

import { PluginService } from '../services/plugin.service';
import { ThemeService } from '../services/theme.service';
import { collectPlugins } from './collectPlugins';
import { GenericCms, GenericPlugin, GenericTheme } from './genericEntities';

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export const connectDatabase = async (sType: 'main' | 'plugin') => {

    const tempDBPath = resolve(getServerTempDir(), 'db.sqlite3');

    const defaultOrmConfig: ConnectionOptions = {
        type: "sqlite",
        database: tempDBPath,
        entityPrefix: 'crw_',
        migrationsTableName: "crw_migrations",
        cli: {
            migrationsDir: "migrations"
        }
    }

    let ormconfig: ConnectionOptions | undefined;
    try {
        ormconfig = require(getOrmConfigPath())
    } catch (e) { }

    let hasDatabasePath = false;
    const serverDir = getServerDir();
    if (ormconfig?.database) hasDatabasePath = true;

    ormconfig = Object.assign({}, defaultOrmConfig, ormconfig)

    if (!ormconfig || !ormconfig.type) throw new Error('Invalid ormconfig');
    setStoreItem('dbType', ormconfig.type);

    // Adjust unset options for different DBs
    const adjustedOptions: Partial<Writeable<ConnectionOptions>> = {};

    let isNewSQLiteDB = false;
    if (ormconfig.type === 'sqlite') {
        if (ormconfig.synchronize === undefined) adjustedOptions.synchronize = true;

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

    if (ormconfig.type === 'mysql' || ormconfig.type === 'postgres') {
        if (ormconfig.migrationsRun === undefined) adjustedOptions.migrationsRun = true;
        if (ormconfig.synchronize === undefined) adjustedOptions.synchronize = false;
    }
    ormconfig = Object.assign(adjustedOptions as any, ormconfig) as ConnectionOptions;

    const connectionOptions: ConnectionOptions = {
        ...ormconfig,
        entities: [
            ...ORMEntities,
            ...(sType === 'plugin' ? (await collectPlugins()).entities : []),
            ...(ormconfig?.entities ?? [])
        ],
        migrations: [
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
    // If some are not, then install them here at Server startup
    const cmsModules = await readCmsModules();

    const pluginRepo = getCustomRepository(GenericPlugin.repository);
    const dbPlugins = await pluginRepo.getAll();

    const pluginService = new PluginService();
    for (const pluginName of cmsModules.plugins) {
        if (!dbPlugins.find(plugin => plugin.name === pluginName)) {
            await pluginService.installPlugin(pluginName);
        }
    }

    const themeRepo = getCustomRepository(GenericTheme.repository);
    const dbThemes = await themeRepo.getAll();

    const themeService = new ThemeService();
    for (const themeName of cmsModules.themes) {
        if (!dbThemes.find(theme => theme.name === themeName)) {
            await themeService.installTheme(themeName);
        }
    }

    // Check CmsSettings
    await getCmsSettings();
}

export const closeConnection = async () => {
    await getConnection().close();
}