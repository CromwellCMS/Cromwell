import {
  connectDatabase as coreConnectDatabase,
  GenericPlugin,
  GenericTheme,
  getCurrentRoles,
  getLogger,
  getModuleStaticDir,
  getPublicPluginsDir,
  getPublicThemesDir,
  readCmsModules,
  setDbConnected,
} from '@cromwell/core-backend';
import fs from 'fs-extra';
import { resolve } from 'path';
import { Container } from 'typedi';
import { ConnectionOptions, getConnection, getCustomRepository } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import yargs from 'yargs-parser';

import { CmsService } from '../services/cms.service';
import { MockService } from '../services/mock.service';
import { PluginService } from '../services/plugin.service';
import { ThemeService } from '../services/theme.service';
import { Writeable } from './constants';
import { loadEnv } from './settings';

const logger = getLogger();

export const connectDatabase = async (
  ormConfigOverride?: Partial<Writeable<ConnectionOptions & MysqlConnectionOptions>>,
  awaitCheck?: boolean,
) => {
  const env = loadEnv();
  await coreConnectDatabase({ ormConfigOverride, development: env.envMode === 'dev' });

  const args = yargs(process.argv.slice(2));
  const checking = checkData(args.init).then(() => {
    setDbConnected(true);
  });

  if (awaitCheck) {
    await checking;
  }
};

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
  const promises1 = dbPlugins.map(async (ent) => {
    const pckg = pluginPackages.find((p) => p.name === ent.name);
    if (pckg?.version && pckg.version !== ent.version && ent.name) {
      try {
        await pluginService.activatePlugin(ent.name, { noRestart: true });
      } catch (error) {
        logger.error('Server connectDatabase: failed to activate plugin ' + ent.name, error);
      }
    }
  });

  const themePackages = await cmsService.readThemes();
  const promises2 = dbThemes.map(async (ent) => {
    const pckg = themePackages.find((p) => p.name === ent.name);
    if (pckg?.version && pckg.version !== ent.version && ent.name) {
      try {
        await themeService.activateTheme(ent.name);
      } catch (error) {
        logger.error('Server connectDatabase: failed to activate theme ' + ent.name, error);
      }
    }
  });

  // Check installed cms modules. All available themes and plugins should be registered in DB
  // If some are not, then activate them here at Server startup
  const promises3 = cmsModules.plugins.map(async (pluginName) => {
    if (!dbPlugins.find((plugin) => plugin.name === pluginName)) {
      try {
        await pluginService.activatePlugin(pluginName, { noRestart: true });
      } catch (error) {
        logger.error('Server connectDatabase: failed to activate plugin ' + pluginName, error);
      }
    }
  });

  const promises4 = cmsModules.themes.map(async (themeName) => {
    if (!dbThemes.find((theme) => theme.name === themeName)) {
      try {
        await themeService.activateTheme(themeName);
      } catch (error) {
        logger.error('Server connectDatabase: failed to activate theme ' + themeName, error);
      }
    }
  });

  // Check all static content is copied in public
  const promises5 = cmsModules.themes.map(async (themeName) => {
    const themeStaticDir = await getModuleStaticDir(themeName);
    if (themeStaticDir && (await fs.pathExists(themeStaticDir))) {
      try {
        const publicThemesDir = getPublicThemesDir();
        await fs.ensureDir(publicThemesDir);
        await fs.copy(themeStaticDir, resolve(publicThemesDir, themeName), {
          overwrite: false,
        });
      } catch (e) {
        logger.log(e);
      }
    }
  });

  const promises6 = cmsModules.plugins.map(async (pluginName) => {
    const pluginStaticDir = await getModuleStaticDir(pluginName);
    if (pluginStaticDir && (await fs.pathExists(pluginStaticDir))) {
      try {
        const publicPluginsDir = getPublicPluginsDir();
        await fs.ensureDir(publicPluginsDir);
        await fs.copy(pluginStaticDir, resolve(publicPluginsDir, pluginName), { overwrite: false });
      } catch (e) {
        logger.log(e);
      }
    }
  });

  await Promise.all([...promises1, ...promises2, ...promises3, ...promises4, ...promises5, ...promises6]);

  if (init) {
    const mockService = Container.get(MockService);
    await mockService.mockAll();
  }

  getCurrentRoles();
};

export const closeConnection = async () => {
  await getConnection().close();
};
