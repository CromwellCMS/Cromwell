import { setStoreItem, TCmsSettings } from '@cromwell/core';
import {
  adminPanelMessages,
  getAdminPanelDir,
  getAdminPanelServiceBuildDir,
  getAdminPanelStaticDir,
  getAdminPanelTempDir,
  getAdminPanelWebPublicDir,
  getAdminPanelWebServiceBuildDir,
  getPublicDir,
  readCMSConfigSync,
} from '@cromwell/core-backend';
import { getRestApiClient } from '@cromwell/core-frontend';
import { spawnSync } from 'child_process';
import fs from 'fs-extra';
import normalizePath from 'normalize-path';
import { resolve } from 'path';
import symlinkDir from 'symlink-dir';
import yargs from 'yargs-parser';

const start = async () => {
  const args = yargs(process.argv.slice(2));
  if (args.serverUrl) {
    process.env.API_URL = args.serverUrl;
  }

  const env = process.argv[2];

  const isProduction = env === 'production' || env === 'prod';
  const isDevelopment = env === 'development' || env === 'dev';
  if (!isDevelopment && !isProduction)
    throw `devServer::startDevServer: process.argv[2] is invalid - ${env} valid values - "development" and "production"`;

  const configsDir = resolve(getAdminPanelTempDir(), 'configs');

  await linkFiles({ isProduction, configsDir });

  await outputEnv({ isProduction, configsDir });

  const port = args.port ?? 4064;

  if (isProduction) {
    spawnSync(`next -p ${port}`, { shell: true, cwd: getAdminPanelServiceBuildDir(), stdio: 'inherit' });
  } else {
    spawnSync(`next dev -p ${port}`, { shell: true, cwd: getAdminPanelDir(), stdio: 'inherit' });
  }
};

const linkFiles = async ({ isProduction, configsDir }: HelperOptions) => {
  const projectPublicDir = normalizePath(getPublicDir());
  const webTempDir = normalizePath(getAdminPanelTempDir());
  const adminPanelStaticDir = normalizePath(getAdminPanelStaticDir());

  if (!fs.existsSync(webTempDir)) await fs.ensureDir(webTempDir);
  fs.ensureDirSync(configsDir);

  if (isProduction) {
    const publicDir = normalizePath(getAdminPanelWebPublicDir());

    // Link public dir in project root to admin panel temp public dir for Fastify web server
    if (fs.existsSync(projectPublicDir)) {
      if (!fs.existsSync(publicDir)) {
        await symlinkDir(projectPublicDir, publicDir);
      }
    } else {
      fs.ensureDirSync(publicDir);
    }

    // Link service build dir
    const serviceBuildDir = getAdminPanelServiceBuildDir();
    const webTempServiceLink = getAdminPanelWebServiceBuildDir();
    if (!fs.existsSync(webTempServiceLink) && fs.existsSync(serviceBuildDir)) {
      await symlinkDir(serviceBuildDir, webTempServiceLink);
    }

    // Link admin static
    if (adminPanelStaticDir && !fs.existsSync(resolve(publicDir, 'admin/static'))) {
      await symlinkDir(adminPanelStaticDir, resolve(publicDir, 'admin/static'));
    }

    // Link prod next.js build
    const serviceNextBuildDir = resolve(serviceBuildDir, '.next');
    const tempNextBuildDir = resolve(webTempDir, '.next');
    if (!fs.existsSync(tempNextBuildDir) && fs.existsSync(serviceNextBuildDir)) {
      await symlinkDir(serviceNextBuildDir, tempNextBuildDir);
    }

    // Link env config
    if (!fs.existsSync(resolve(publicDir, 'configs'))) {
      await symlinkDir(configsDir, resolve(publicDir, 'configs'));
    }
  } else {
    // Link public dir in project root to admin panel temp public dir for Fastify web server
    const publicDir = resolve(getAdminPanelDir(), 'public');

    if (fs.existsSync(projectPublicDir)) {
      if (!fs.existsSync(publicDir)) {
        await symlinkDir(projectPublicDir, publicDir);
      }
    } else {
      fs.ensureDirSync(publicDir);
    }

    // Link admin static
    if (adminPanelStaticDir && !fs.existsSync(resolve(publicDir, 'admin/static'))) {
      await symlinkDir(adminPanelStaticDir, resolve(publicDir, 'admin/static'));
    }

    // Link env config
    if (!fs.existsSync(resolve(publicDir, 'configs'))) {
      await symlinkDir(configsDir, resolve(publicDir, 'configs'));
    }
  }
};

const outputEnv = async ({ isProduction, configsDir }: HelperOptions) => {
  let cmsSettings: TCmsSettings = readCMSConfigSync();
  setStoreItem('cmsSettings', cmsSettings);

  try {
    cmsSettings = (await getRestApiClient().getCmsSettings()) ?? cmsSettings;
    setStoreItem('cmsSettings', cmsSettings);
  } catch (error) {
    console.error(error);
  }

  fs.outputJSONSync(resolve(configsDir, 'public-env.json'), {
    cmsSettings: {
      domain: cmsSettings?.domain,
      url: cmsSettings?.url,
      apiUrl: cmsSettings?.apiUrl,
      adminUrl: cmsSettings?.adminUrl,
      frontendUrl: cmsSettings?.frontendUrl,
      redirects: cmsSettings?.redirects,
      rewrites: cmsSettings?.rewrites,
      themeName: cmsSettings?.themeName,
      defaultPageSize: cmsSettings?.defaultPageSize,
      currencies: cmsSettings?.currencies,
      timezone: cmsSettings?.timezone,
      language: cmsSettings?.language,
      favicon: cmsSettings?.favicon,
      logo: cmsSettings?.logo,
      defaultShippingPrice: cmsSettings?.defaultShippingPrice,
      disablePayLater: cmsSettings?.disablePayLater,
      headHtml: cmsSettings?.headHtml,
      footerHtml: cmsSettings?.footerHtml,
      customMeta: cmsSettings?.customMeta,
      modules: cmsSettings?.modules,
    },
    environment: {
      isAdminPanel: true,
      mode: isProduction ? 'prod' : 'dev',
    },
  });
};

try {
  start();
} catch (e) {
  console.error(e);
  if (process.send) process.send(adminPanelMessages.onStartErrorMessage);
}
type HelperOptions = { isProduction: boolean; configsDir: string };
