import { sleep } from '@cromwell/core';
import { TAuthSettings } from '@cromwell/core-backend/dist/helpers/auth-settings';
import { getLogger } from '@cromwell/core-backend/dist/helpers/logger';
import { getRendererTempDir } from '@cromwell/core-backend/dist/helpers/paths';
import fs from 'fs-extra';
import glob from 'glob';
import { IncomingMessage, ServerResponse } from 'http';
import NextLRUCacheClass from 'next/dist/compiled/lru-cache';
import normalizePath from 'normalize-path';
import { join, resolve } from 'path';

import type LRUCache from 'lru-cache';

const logger = getLogger();

type ManagerOptions = {
  req: IncomingMessage;
  res: ServerResponse;
  authSettings: TAuthSettings;
  port: number;
  themeName: string;
};

type IncrementalCacheEntry = {
  curRevalidate?: number | false;
  revalidateAfter: number | false;
  isStale?: boolean;
};

/**
 * Next.js doesn't keep LRU instance in server instance anymore, it's just `let` in a module context, so no way to access it.
 * So here's a patch on the LRU class to keep track of all instances
 */
const lruInstances = new Set<LRUCache<string, IncrementalCacheEntry>>();

const originalSet = NextLRUCacheClass.prototype.set;
NextLRUCacheClass.prototype.set = function (...args) {
  lruInstances.add(this);
  const result = originalSet.apply(this, args);
  return result;
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
    await purgePageCache(pageRoute);
  }
  if (purgeParam === 'all') {
    isPurgingAll = true;
    try {
      await purgeEntireCache();
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

const purgePageCache = async (pathname: string) => {
  const pagesDir = join(getRendererTempDir(), `.next/server/pages`);
  const fullPathname = join(pagesDir, pathname);
  try {
    await fs.remove(`${fullPathname}.html`);
    await fs.remove(`${fullPathname}.json`);

    for (const lruCache of lruInstances) {
      if (lruCache.has(pathname)) {
        lruCache.del(pathname);
      }
    }

    logger.log(`Next.js cache of ${pathname} was successfully purged`);
  } catch (err) {
    logger.error(`Could not purge Next.js cache of ${fullPathname} - ${err}`);
  }
};

const purgeEntireCache = async () => {
  const pagesDir = resolve(getRendererTempDir(), `.next/server/pages`);

  try {
    await purgeNextJsFileCache(pagesDir);

    try {
      for (const lruCache of [...lruInstances]) {
        // Make sure we're removing next.js pages cache and not some/any other LRU cache
        if (lruCache.has('/index') || lruCache.has('/_app')) {
          (lruCache.purgeStale || lruCache.prune)?.apply?.(lruCache);
          (lruCache.clear || lruCache.reset)?.apply?.(lruCache);
        }
      }
    } catch (error) {
      console.error(error);
    }

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
