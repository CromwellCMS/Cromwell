import { setStoreItem } from '@cromwell/core';
import {
    getLogger,
    getModuleStaticDir,
    getPublicPluginsDir,
    getPublicThemesDir,
    getServerDir,
    getServerTempDir,
    ORMEntities,
    readCMSConfig,
    readCmsModules,
} from '@cromwell/core-backend';
import fs from 'fs-extra';
import normalizePath from 'normalize-path';
import { resolve } from 'path';
import { Container } from 'typedi';
import { ConnectionOptions, createConnection, getConnection, getCustomRepository } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import yargs from 'yargs-parser';

import { CmsService } from '../services/cms.service';
import { MockService } from '../services/mock.service';
import { PluginService } from '../services/plugin.service';
import { ThemeService } from '../services/theme.service';
import { collectPlugins } from './collectPlugins';
import { GenericCms, GenericPlugin, GenericTheme } from './genericEntities';
import { loadEnv } from './settings';

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
                const mockedDBPath = resolve(serverDir, 'db.sqlite3');
                if (await fs.pathExists(mockedDBPath)) {
                    isNewSQLiteDB = true;
                    await fs.copy(mockedDBPath, tempDBPath);
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

    (async () => {
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

        const cmsModules = await readCmsModules();

        const pluginRepo = getCustomRepository(GenericPlugin.repository);
        const dbPlugins = await pluginRepo.getAll();

        const themeRepo = getCustomRepository(GenericTheme.repository);
        const dbThemes = await themeRepo.getAll();

        const pluginService = Container.get(PluginService);
        const themeService = Container.get(ThemeService);
        const cmsService = Container.get(CmsService);

        // Check versions if some Themes/Plugins were manually updated. 
        // Sync versions in DB.
        const pluginPackages = await cmsService.readPlugins();
        dbPlugins.forEach(ent => {
            const pckg = pluginPackages.find(p => p.name === ent.name);
            if (pckg?.version && pckg.version !== ent.version) {
                ent.version = pckg.version;
                ent.save();
            }
        });

        const themePackages = await cmsService.readThemes();
        dbThemes.forEach(ent => {
            const pckg = themePackages.find(p => p.name === ent.name);
            if (pckg?.version && pckg.version !== ent.version) {
                ent.version = pckg.version;
                ent.save();
            }
        });

        // Check installed cms modules. All available themes and plugins should be registered in DB
        // If some are not, then activate them here at Server startup
        for (const pluginName of cmsModules.plugins) {
            if (!dbPlugins.find(plugin => plugin.name === pluginName)) {
                try {
                    await pluginService.activatePlugin(pluginName);
                } catch (error) {
                    logger.error('Server connectDatabase: failed to activate plugin ' + pluginName, error);
                }
            }
        }

        for (const themeName of cmsModules.themes) {
            if (!dbThemes.find(theme => theme.name === themeName)) {
                try {
                    await themeService.activateTheme(themeName);
                } catch (error) {
                    logger.error('Server connectDatabase: failed to activate theme ' + themeName, error);
                }
            }
        }

        // Check static content is copied in public
        cmsModules.themes.forEach(async themeName => {
            const themeStaticDir = await getModuleStaticDir(themeName);
            if (themeStaticDir && await fs.pathExists(themeStaticDir)) {
                try {
                    const publicThemesDir = getPublicThemesDir();
                    await fs.ensureDir(publicThemesDir);
                    await fs.copy(themeStaticDir, resolve(publicThemesDir, themeName), {
                        overwrite: false,
                    });
                } catch (e) { logger.log(e) }
            }
        });

        cmsModules.plugins.forEach(async pluginName => {
            const pluginStaticDir = await getModuleStaticDir(pluginName)
            if (pluginStaticDir && await fs.pathExists(pluginStaticDir)) {
                try {
                    const publicPluginsDir = getPublicPluginsDir();
                    await fs.ensureDir(publicPluginsDir);
                    await fs.copy(pluginStaticDir, resolve(publicPluginsDir, pluginName),
                        { overwrite: false });
                } catch (e) { logger.log(e) }
            }
        });


        if (args.init) {
            const mockService = Container.get(MockService);
            setTimeout(() => {
                mockService.mockAll();
            }, 1000);
        }
    })();
}

export const closeConnection = async () => {
    await getConnection().close();
}