import { findRedirect, setStoreItem, TCmsSettings } from '@cromwell/core';
import { getAuthSettings } from '@cromwell/core-backend/dist/helpers/auth-settings';
import { readCMSConfig } from '@cromwell/core-backend/dist/helpers/cms-settings';
import { getLogger } from '@cromwell/core-backend/dist/helpers/logger';
import cookie from 'cookie';
import fs from 'fs-extra';
import { createServer } from 'http';
import next from 'next';
import { join } from 'path';
import send from 'send';
import { parse } from 'url';

import { processCacheRequest } from './helpers/cacheManager';

export { purgeNextJsFileCache } from './helpers/cacheManager';

const logger = getLogger();

export const startNextServer = async (options?: {
    dev?: boolean;
    port?: number;
    dir?: string;
    targetThemeName?: string;
}) => {
    const config = await readCMSConfig();
    const authSettings = await getAuthSettings();
    setStoreItem('cmsSettings', config);

    const themeName = options?.targetThemeName ?? config?.defaultSettings?.publicSettings?.themeName;
    if (!themeName) {
        logger.error('No theme name provided');
        return;
    }

    const port = options?.port ?? 3000;
    const app = next({
        dev: options?.dev ?? false,
        dir: options?.dir,
    });

    if (config.monolith) {
        try {
            const dbConnector: typeof import('@cromwell/core-backend/dist/helpers/connect-database')
                = require('@cromwell/core-backend/dist/helpers/connect-database');

            await dbConnector.connectDatabase({
                development: config.env === 'dev',
            });
        } catch (error) {
            logger.error(error);
        }
    }

    const handle = app.getRequestHandler();
    await app.prepare();

    const server = createServer(async (req, res) => {
        const parsedUrl = parse(req.url!, true);
        const { pathname, search } = parsedUrl;

        // Static file serving
        try {
            if (req.url) {
                const filePath = join(process.cwd(), 'public', req.url);
                if ((await fs.lstat(filePath)).isFile()) {
                    send(req, filePath).pipe(res);
                    return;
                }
            }
        } catch (err) { }

        // Pass settings to frontend via cookies
        res.setHeader('Set-Cookie', cookie.serialize('crw_cms_config', JSON.stringify({
            apiUrl: config.apiUrl,
            adminUrl: config.adminUrl,
            frontendUrl: config.frontendUrl,
            centralServerUrl: config.centralServerUrl,
        } as TCmsSettings), {
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        }));

        await processCacheRequest({ app: app as any, req, res, authSettings, port, themeName });

        if (!pathname) {
            handle(req, res, parsedUrl);
            return;
        }

        // Handle redirects
        const redirect = findRedirect(pathname, search);

        if (redirect) {
            if (redirect.type === 'redirect' && redirect.to) {
                res.writeHead(redirect?.statusCode ?? redirect?.permanent ? 301 : 307, {
                    Location: redirect.to,
                });
                res.end();
                return;
            }

            if (redirect.type === 'rewrite' && redirect.from) {
                parsedUrl.pathname = redirect.from;
                req.url = redirect.from;
                app.render(req, res, redirect.from);
                return;
            }
        }

        // Default handle
        handle(req, res, parsedUrl);
    })

    const success = await new Promise(done => {
        server.on('error', (err) => {
            logger.error(err);
            done(false);
        });

        server.listen(port, () => {
            done(true);
            logger.log(`> Next.js server ready on http://localhost:${port}`)
        })

        setTimeout(() => done(false), 15000);
    })

    return success;
}
