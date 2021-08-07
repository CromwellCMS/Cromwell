import { getLogger } from '@cromwell/core-backend';
import { createServer } from 'http';
import next from 'next';
import { parse } from 'url';

import { findRedirect } from './helpers/redirects';

const logger = getLogger();

export const startNextServer = async (options?: {
    dev?: boolean;
    port?: number;
    dir?: string;
}) => {
    const port = options?.port ?? 3000;
    const app = next({
        dev: options?.dev ?? false,
        dir: options?.dir,
    })
    const handle = app.getRequestHandler();
    await app.prepare();

    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url!, true)
        const { pathname, search } = parsedUrl;

        if (!pathname) {
            handle(req, res, parsedUrl);
            return;
        }

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

        handle(req, res, parsedUrl);
    })

    const success = await new Promise(done => {
        server.on('error', (err) => {
            logger.error(err);
            done(false);
        });

        server.listen(port, () => {
            done(true);
            logger.info(`> Next.js server ready on http://localhost:${port}`)
        })

        setTimeout(() => done(false), 15000);
    })

    return success;
}