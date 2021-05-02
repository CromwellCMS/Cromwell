import { setStoreItem } from '@cromwell/core';
import {
    Attribute,
    User,
    CmsEntity,
    PluginEntity,
    Post,
    Product,
    Order,
    Tag,
    PageStats,
    ProductCategory,
    ProductReview,
    ThemeEntity,
    getOrmConfigPath,
    getServerTempDir,
    readCmsModules,
    getServerDir
} from '@cromwell/core-backend';
import { resolve } from 'path';
import { ConnectionOptions, createConnection, getConnection } from 'typeorm';
import { getCustomRepository } from 'typeorm';
import normalizePath from 'normalize-path';
import fs from 'fs-extra';

import { collectPlugins } from './collectPlugins';
import { getCmsSettings, CmsService } from '../services/cms.service';
import { PluginService } from '../services/plugin.service';
import { ThemeService } from '../services/theme.service';
import { GenericPlugin, GenericTheme, GenericCms } from './genericEntities';

export const connectDatabase = async (sType: 'main' | 'plugin') => {

    const tempDBPath = resolve(getServerTempDir(), 'db.sqlite3');

    const defaultOrmConfig: ConnectionOptions = {
        type: "sqlite",
        database: tempDBPath,
        synchronize: false,
        entityPrefix: 'crw_',
        migrationsRun: true,
        migrationsTableName: "crw_migrations",
        cli: {
            migrationsDir: "migration"
        }
    }

    let ormconfig: ConnectionOptions | undefined;
    try {
        ormconfig = require(getOrmConfigPath())
    } catch (e) { }

    let isNewSQLiteDB = false;
    const serverDir = getServerDir();

    if (!ormconfig?.database) {
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

    ormconfig = Object.assign({}, defaultOrmConfig, ormconfig)

    if (!ormconfig || !ormconfig.type) throw new Error('Invalid ormconfig');
    setStoreItem('dbType', ormconfig.type);

    console.log(normalizePath(resolve(serverDir!, ormconfig!.cli!.migrationsDir!)) + '/*.js')

    const pluginsExports = await collectPlugins();
    const connectionOptions: ConnectionOptions = {
        ...ormconfig,
        entities: [
            Product, ProductCategory, Post, User,
            Attribute, ProductReview, Order,
            ThemeEntity, PluginEntity, CmsEntity,
            Tag, PageStats,
            ...(sType === 'plugin' ? pluginsExports.entities : []),
            ...(ormconfig.entities ?? [])
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
            await pluginService.installPlugin(pluginName)
        }
    }

    const themeRepo = getCustomRepository(GenericTheme.repository);
    const dbThemes = await themeRepo.getAll();
    const themeService = new ThemeService(new CmsService(), pluginService);

    for (const themeName of cmsModules.themes) {
        if (!dbThemes.find(theme => theme.name === themeName)) {
            await themeService.installTheme(themeName)
        }
    }

    // Check CmsSettings
    const settings = await getCmsSettings();
    if (settings) {
        setStoreItem('cmsSettings', settings)
    }
}

export const closeConnection = async () => {
    await getConnection().close();
}