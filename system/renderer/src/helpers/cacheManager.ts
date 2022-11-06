import { sleep } from '@cromwell/core';
import { TAuthSettings } from '@cromwell/core-backend/dist/helpers/auth-settings';
import { getLogger } from '@cromwell/core-backend/dist/helpers/logger';
import { getRendererTempDir } from '@cromwell/core-backend/dist/helpers/paths';
import fs from 'fs-extra';
import glob from 'glob';
import { IncomingMessage, ServerResponse } from 'http';
import LRUCache from 'lru-cache';
import { IncrementalCacheValue } from 'next/dist/server/incremental-cache';
import { NextServer as _NextServer } from 'next/dist/server/next';
import _Server from 'next/dist/server/next-server';
import normalizePath from 'normalize-path';
import { join, resolve } from 'path';

type IncrementalCacheEntry = {
  curRevalidate?: number | false;
  revalidateAfter: number | false;
  isStale?: boolean;
  value: IncrementalCacheValue | null;
};

type NextServer = Omit<_NextServer, 'server'> & {
  server: Omit<_Server, 'incrementalCache'> & {
    incrementalCache: {
      cache: LRUCache<string, IncrementalCacheEntry>;
    };
  };
};

const logger = getLogger();

type ManagerOptions = {
  app: NextServer;
  req: IncomingMessage;
  res: ServerResponse;
  authSettings: TAuthSettings;
  port: number;
  themeName: string;
};

let isPurgingAll = false;

export const processCacheRequest = async (options: ManagerOptions) => {
  if (isPurgingAll) return;
  const { req, authSettings, port } = options;
  const url = new URL(`http://localhost:${port}${req.url!}`);
  const purgeParam = url.searchParams.get('purge');
  const pageRoute = url.searchParams.get('pageRoute');

  if (!purgeParam) return;
  if (!checkAuth(req, authSettings)) return;

  if (purgeParam === 'page' && pageRoute) {
    await purgePageCache(options, pageRoute);
  }
  if (purgeParam === 'all') {
    isPurgingAll = true;
    try {
      await purgeEntireCache(options);
    } catch (error) {
      logger.error(error);
    }
    isPurgingAll = false;
  }
};

const checkAuth = (req: IncomingMessage, authSettings: TAuthSettings) => {
  const authHeader = String(req?.headers?.['authorization'] ?? '');

  if (authHeader.startsWith('Service ')) {
    // Access by secret token from other services such as Renderer
    const serviceSecret = authHeader.substring(8, authHeader.length);
    if (serviceSecret === authSettings.serviceSecret) {
      return true;
    }
  }
  return false;
};

const purgePageCache = async (options: ManagerOptions, pathname: string) => {
  const cache = options.app.server?.incrementalCache?.cache;
  if (!cache) return;

  const pagesDir = join(getRendererTempDir(), `.next/server/pages`);
  const fullPathname = join(pagesDir, pathname);
  try {
    await fs.remove(`${fullPathname}.html`);
    await fs.remove(`${fullPathname}.json`);

    if (cache.has(pathname)) {
      cache.del(pathname);
    }

    logger.log(`Next.js cache of ${pathname} was successfully purged`);
  } catch (err) {
    logger.error(`Could not purge Next.js cache of ${fullPathname} - ${err}`);
  }
};

const purgeEntireCache = async (options: ManagerOptions) => {
  const pagesDir = resolve(getRendererTempDir(), `.next/server/pages`);
  const cache = options.app?.server?.incrementalCache?.cache;
  if (!cache) return;

  try {
    await purgeNextJsFileCache(pagesDir);

    cache.prune();
    cache.reset();
    await sleep(0.05);

    logger.log(`Entire Next.js cache was successfully purged`);
  } catch (error) {
    logger.error(`Could not purge entire Next.js cache - ${error}`);
  }
};

export const purgeNextJsFileCache = async (pagesDir: string) => {
  const generatedPages = await new Promise<string[] | undefined>((done) => {
    glob(`${normalizePath(pagesDir)}/**/*.+(html|json)`, (err, matches) => {
      if (err) {
        logger.error(err);
        done(undefined);
        return;
      }
      done(matches);
    });
  });

  if (generatedPages?.length) {
    await Promise.all(
      generatedPages.map(async (pageFile) => {
        try {
          await fs.remove(pageFile);
        } catch (error) {
          logger.error(error);
        }
      }),
    );
    await sleep(0.05);
  }
};
