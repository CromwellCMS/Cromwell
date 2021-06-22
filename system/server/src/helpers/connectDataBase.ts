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
import { GenericPlugin, GenericTheme } from './genericEntities';
import { loadEnv } from './settings';

type Writeable<T> = { -readonly [P in keyof T]: T[P] };
const logger = getLogger();

export const connectDatabase = async (ormConfigOverride?: Partial<Writeable<ConnectionOptions & MysqlConnectionOptions>>,
    awaitCheck?: boolean) => {

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

    let ormconfig: ConnectionOptions = Object.assign({}, defaultOrmConfig, ormConfigOverride, cmsConfig.orm)

    if (!ormconfig || !ormconfig.type) throw new Error('Invalid ormconfig');
    setStoreItem('dbType', ormconfig.type);

    // Adjust unset options for different DBs
    const adjustedOptions: Partial<Writeable<ConnectionOptions & MysqlConnectionOptions>> = {};

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

    const checking = checkData(args.init);
    if (awaitCheck) await checking;
}

const checkData = async (init: boolean) => {
    const cmsModules = await readCmsModules();

    const pluginRepo = getCustomRepository(GenericPlugin.repository);
    const dbPlugins = await pluginRepo.getAll();

    const themeRepo = getCustomRepository(GenericTheme.repository);
    const dbThemes = await themeRepo.getAll();

    const pluginService = Container.get(PluginService);
    const themeService = Container.get(ThemeService);
    const cmsService = Container.get(CmsService);

    // Check versions if some Themes/Plugins were manually updated. 
    // Run activate to update info in DB
    const pluginPackages = await cmsService.readPlugins();
    const promises1 = dbPlugins.map(async ent => {
        const pckg = pluginPackages.find(p => p.name === ent.name);
        if (pckg?.version && pckg.version !== ent.version) {
            try {
                await pluginService.activatePlugin(ent.name);
            } catch (error) {
                logger.error('Server connectDatabase: failed to activate plugin ' + ent.name, error);
            }
        }
    });

    const themePackages = await cmsService.readThemes();
    const promises2 = dbThemes.map(async ent => {
        const pckg = themePackages.find(p => p.name === ent.name);
        if (pckg?.version && pckg.version !== ent.version) {
            try {
                await themeService.activateTheme(ent.name);
            } catch (error) {
                logger.error('Server connectDatabase: failed to activate theme ' + ent.name, error);
            }
        }
    });

    // Check installed cms modules. All available themes and plugins should be registered in DB
    // If some are not, then activate them here at Server startup
    const promises3 = cmsModules.plugins.map(async pluginName => {
        if (!dbPlugins.find(plugin => plugin.name === pluginName)) {
            try {
                await pluginService.activatePlugin(pluginName);
            } catch (error) {
                logger.error('Server connectDatabase: failed to activate plugin ' + pluginName, error);
            }
        }
    })

    const promises4 = cmsModules.themes.map(async themeName => {
        if (!dbThemes.find(theme => theme.name === themeName)) {
            try {
                await themeService.activateTheme(themeName);
            } catch (error) {
                logger.error('Server connectDatabase: failed to activate theme ' + themeName, error);
            }
        }
    })

    // Check all static content is copied in public
    const promises5 = cmsModules.themes.map(async themeName => {
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

    const promises6 = cmsModules.plugins.map(async pluginName => {
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

    await Promise.all([...promises1, ...promises2, ...promises3, ...promises4, ...promises5, ...promises6,])

    if (init) {
        const mockService = Container.get(MockService);
        await mockService.mockAll();
    }
}

export const closeConnection = async () => {
    await getConnection().close();
}