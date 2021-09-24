import { sleep } from '@cromwell/core';
import { TAuthSettings } from '@cromwell/core-backend/dist/helpers/auth-settings';
import { getLogger } from '@cromwell/core-backend/dist/helpers/logger';
import { getRendererTempDir, getThemeBuildDir } from '@cromwell/core-backend/dist/helpers/paths';
import fs from 'fs-extra';
import { IncomingMessage, ServerResponse } from 'http';
import LRUCache from 'lru-cache';
import { IncrementalCacheValue } from 'next/dist/server/incremental-cache';
import { NextServer as _NextServer } from 'next/dist/server/next';
import _Server from 'next/dist/server/next-server';
import fetch from 'node-fetch';
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
    }
};

const logger = getLogger();

type ManagerOptions = {
    app: NextServer;
    req: IncomingMessage;
    res: ServerResponse;
    authSettings: TAuthSettings;
    port: number;
    themeName: string;
}

export const processCacheRequest = async (options: ManagerOptions) => {
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
        await purgeEntireCache(options);
    }
}

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
}

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

        logger.log(`Cache of ${fullPathname} was successfully purged`);
    } catch (err) {
        logger.error(err);
        logger.error(`Could not purge cache of ${fullPathname} - ${err}`);
    }
}

const purgeEntireCache = async (options: ManagerOptions) => {
    const pagesDir = resolve(getRendererTempDir(), `.next/server/pages`);
    const cache = options.app?.server?.incrementalCache?.cache;
    if (!cache) return;

    try {
        await fs.remove(pagesDir);
        await sleep(0.05);

        const themeBuildDir = await getThemeBuildDir(options.themeName);
        if (!themeBuildDir) {
            logger.error('purgeEntireCache: !themeBuildDir');
            return;
        }
        const pagesOriginalDir = resolve(themeBuildDir, `.next/server/pages`);

        await fs.copy(pagesOriginalDir, pagesDir);
        await sleep(0.05);

        cache.reset();
        await sleep(0.05);

        const rendererUrl = `http://localhost:${options.port}`;
        try {
            await fetch(rendererUrl);
            await fetch(rendererUrl);
        } catch (e) {
            logger.error(e);
        }
    } catch (error) {
        logger.error(error);
        logger.error(`Could not purge entire cache`);
    }
}
