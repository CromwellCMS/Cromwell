import { setStoreItem } from '@cromwell/core';
import {
    Attribute,
    User,
    CmsEntity,
    PluginEntity,
    Post,
    Product,
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
import fs from 'fs-extra';

import { collectPlugins } from './collectPlugins';
import { getCmsSettings, CmsService } from '../services/cms.service';
import { PluginService } from '../services/plugin.service';
import { ThemeService } from '../services/theme.service';
import { GenericPlugin, GenericTheme } from './genericEntities';


export const connectDatabase = async () => {

    const tempDBPath = resolve(getServerTempDir(), 'db.sqlite3');

    const defaultOrmConfig: ConnectionOptions = {
        "type": "sqlite",
        "database": tempDBPath,
        "synchronize": true
    }

    let ormconfig: ConnectionOptions | undefined;
    try {
        ormconfig = require(getOrmConfigPath())
    } catch (e) { }

    let isNewSQLiteDB = false;

    if (!ormconfig?.database) {
        const serverDir = getServerDir();
        if (!await fs.pathExists(defaultOrmConfig.database) && serverDir) {
            // Server probably was launched at the first time and has no DB created
            // Use mocked DB
            isNewSQLiteDB = true;
            const dempDBPath = resolve(serverDir, 'db.sqlite3');
            if (await fs.pathExists(dempDBPath)) {
                await fs.copy(dempDBPath, tempDBPath);
            }
        }
    }

    ormconfig = Object.assign({}, defaultOrmConfig, ormconfig)

    if (!ormconfig || !ormconfig.type) throw new Error('Invalid ormconfig');
    setStoreItem('dbType', ormconfig.type);

    const pluginsExports = await collectPlugins();
    const connectionOptions: ConnectionOptions = {
        ...ormconfig,
        entities: [
            Product, ProductCategory, Post, User,
            Attribute, ProductReview,
            ThemeEntity, PluginEntity, CmsEntity,
            ...pluginsExports.entities,
            ...(ormconfig.entities ?? [])
        ],
    };

    if (connectionOptions) await createConnection(connectionOptions);

    // Check CmsSettings
    const settings = await getCmsSettings();
    if (settings) {
        setStoreItem('cmsSettings', settings)
    }

    if (isNewSQLiteDB) {
        // if new DB, delete old themes and plugins from tables to install them anew
        const pluginRepo = getCustomRepository(GenericPlugin.repository);
        const dbPlugins = await pluginRepo.getAll();
        await Promise.all(dbPlugins.map(plugin => pluginRepo.remove(plugin)));

        const themeRepo = getCustomRepository(GenericTheme.repository);
        const dbThemes = await themeRepo.getAll();
        await Promise.all(dbThemes.map(theme => themeRepo.remove(theme)));
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
    const themeService = new ThemeService(new CmsService());

    for (const themeName of cmsModules.themes) {
        if (!dbThemes.find(theme => theme.name === themeName)) {
            await themeService.installTheme(themeName)
        }
    }

}

export const closeConnection = async () => {
    await getConnection().close();
}