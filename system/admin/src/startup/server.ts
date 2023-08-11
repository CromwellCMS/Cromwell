import { setStoreItem, TCmsSettings } from '@cromwell/core';
import { readCMSConfigSync } from '@cromwell/core-backend/dist/helpers/cms-settings';
import { getLogger } from '@cromwell/core-backend/dist/helpers/logger';
import {
  getAdminPanelDir,
  getAdminPanelServiceBuildDir,
  getAdminPanelStaticDir,
  getAdminPanelTempDir,
  getAdminPanelWebPublicDir,
  getPublicDir,
} from '@cromwell/core-backend/dist/helpers/paths';
import { reportProcessPid } from '@cromwell/core-backend/dist/helpers/shell';
import { getRestApiClient } from '@cromwell/core-frontend/dist/api/CRestApiClient';
import { fastifySendFile, resolvePublicFilePathToServe } from '@cromwell/utils/build/static';
import fs from 'fs-extra';
import normalizePath from 'normalize-path';
import { join, resolve } from 'path';
import symlinkDir from 'symlink-dir';
import yargs from 'yargs-parser';

import type { FastifyReply, FastifyRequest } from 'fastify';

const logger = getLogger();

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

  const configsDir = isDevelopment
    ? resolve(getAdminPanelTempDir(getAdminPanelDir() as string), 'configs')
    : resolve(getAdminPanelTempDir(), 'configs');

  await linkFiles({ isProduction, configsDir });

  await outputEnv({ isProduction, configsDir });

  if (isProduction) {
    await startProdServer(args.port);
  } else {
    // await startDevServer(args.port);
  }

  logger.info('Admin startup successfully ran');
};

const linkFiles = async ({ isProduction, configsDir }: HelperOptions) => {
  const projectPublicDir = normalizePath(getPublicDir());
  const adminPanelStaticDir = normalizePath(getAdminPanelStaticDir());
  const webTempDir = normalizePath(getAdminPanelTempDir());
  const adminPublicStaticDir = resolve(projectPublicDir, 'admin/static');

  if (!fs.pathExistsSync(webTempDir)) await fs.ensureDir(webTempDir);
  fs.ensureDirSync(configsDir);

  if (isProduction) {
    const tempPublicDir = normalizePath(getAdminPanelWebPublicDir());
    const serviceNextBuildDir = resolve(getAdminPanelServiceBuildDir(), '.next');
    const tempNextBuildDir = resolve(webTempDir, '.next');

    // Remove old links
    await fs.remove(tempPublicDir).catch(() => null);
    await fs.remove(tempNextBuildDir).catch(() => null);

    await new Promise((res) => setTimeout(res, 500));

    // console.log('publicDir', publicDir);

    // Link public dir in project root to admin panel temp public dir for Fastify web server
    if (fs.pathExistsSync(projectPublicDir)) {
      if (!fs.pathExistsSync(tempPublicDir)) {
        await symlinkDir(projectPublicDir, tempPublicDir);
      }
    } else {
      fs.ensureDirSync(tempPublicDir);
    }

    // Link admin static
    if (fs.pathExistsSync(adminPanelStaticDir) && !fs.pathExistsSync(adminPublicStaticDir)) {
      await symlinkDir(adminPanelStaticDir, adminPublicStaticDir);
    }

    // Link prod next.js build
    if (!fs.existsSync(tempNextBuildDir) && fs.existsSync(serviceNextBuildDir)) {
      await symlinkDir(serviceNextBuildDir, tempNextBuildDir);
    }

    fs.copyFileSync(resolve(getAdminPanelDir(), 'next.config.js'), resolve(webTempDir, 'next.config.js'));
  } else {
    // Link public dir in project root to admin panel temp public dir
    const publicDir = resolve(getAdminPanelDir(), 'public');

    fs.ensureDirSync(projectPublicDir);

    if (fs.pathExistsSync(projectPublicDir)) {
      if (!fs.pathExistsSync(publicDir)) {
        await symlinkDir(projectPublicDir, publicDir);
      }
    } else {
      fs.ensureDirSync(publicDir);
    }

    // Link admin static
    if (fs.pathExistsSync(adminPanelStaticDir) && !fs.pathExistsSync(adminPublicStaticDir)) {
      await symlinkDir(adminPanelStaticDir, adminPublicStaticDir);
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

const startProdServer = (port: number) => {
  // start fastify server:
  const fastify = require('fastify')({ logger: false });

  fastify.get('/*', async function (req: FastifyRequest, reply: FastifyReply) {
    const url = new URL('http://localhost' + req.raw.url);
    const publicPath = normalizePath(url.pathname).replace(/^(\.\.(\/|\\|$))+/, '');

    if (publicPath.indexOf('\0') !== -1) {
      throw new Error('Poison Null Bytes');
    }

    if (publicPath.startsWith('/admin/_next/static')) {
      const filePath = join(getAdminPanelTempDir(), '.next/static', publicPath.replace('/admin/_next/static', ''));
      return fastifySendFile(reply, filePath);
    }

    if (publicPath.startsWith('/admin/static')) {
      const filePath = join(getAdminPanelTempDir(), 'public/admin/static', publicPath.replace('/admin/static', ''));
      return fastifySendFile(reply, filePath);
    }

    if (publicPath.startsWith('/admin')) {
      return reply
        .type('text/html')
        .send(fs.createReadStream(join(getAdminPanelTempDir(), '.next/server/pages/index.html')));
    }

    const { pathInPublicDir } = await resolvePublicFilePathToServe(req.raw.url);

    if (pathInPublicDir) {
      return fastifySendFile(reply, pathInPublicDir);
    }

    return reply.status(404).send('Not found');
  });

  fastify.get('/admin/api/public-env', function () {
    const configPath = resolve(process.cwd(), '.cromwell/admin/configs/public-env.json');
    return fs.readJsonSync(configPath);
  });

  fastify.listen({ port }, (err, address) => {
    if (err) throw err;
    logger.info(`Admin panel server listening on ${address}`);
  });
};

start().catch((e) => console.error(e));

type HelperOptions = { isProduction: boolean; configsDir: string };

reportProcessPid('admin_server');
